/**
 * Интегрированная система планирования путешествий с выбором экспертов
 * 
 * Этот модуль объединяет генерацию путеводителей и подбор экспертов в одном процессе,
 * оптимизированном для быстрого параллельного выполнения.
 * 
 * Workflow:
 * 1. Запрос на генерацию TripGuide (OpenAI)
 * 2. Параллельно: загрузка экспертов из Airtable
 * 3. Как только TripGuide готов → немедленный выбор экспертов
 * 4. Возврат полного результата: путеводитель + подходящие эксперты
 */

import { generateInspireGuide, generatePlanningGuide } from './tripGuideGenerator';
import { selectBestExpert } from './expertSelector';
import { fetchAllExperts } from './simpleExpertFetcher';
import { TripGuide } from '../types/tripGuide';
import { QuestionnaireData } from '../types/questionnaire';

export interface IntegratedTripResult {
  success: boolean;
  tripGuide?: TripGuide;
  selectedExpertIds?: string | string[];
  error?: string;
  timing?: {
    tripGuideGeneration: number;
    expertSelection: number;
    total: number;
  };
}

/**
 * Основная интегрированная функция планирования с экспертами
 * 
 * Выполняет параллельно:
 * - Генерацию путеводителя
 * - Предзагрузку списка экспертов
 * 
 * Затем немедленно подбирает экспертов на основе готового путеводителя
 */
export async function generateTripWithExperts(
  questionnaireData: QuestionnaireData
): Promise<IntegratedTripResult> {
  const startTime = Date.now();
  
  try {
    console.log(`🚀 Запуск интегрированного планирования (${questionnaireData.flowType})`);

    // Запускаем параллельно: генерацию путеводителя + загрузку экспертов
    const [tripGuideResult, expertsResult] = await Promise.allSettled([
      // Генерация путеводителя
      questionnaireData.flowType === 'inspire-me' 
        ? generateInspireGuide(questionnaireData.answers)
        : generatePlanningGuide(questionnaireData.answers),
      
      // Предзагрузка экспертов из Airtable
      fetchAllExperts()
    ]);

    const tripGuideTime = Date.now() - startTime;

    // Проверяем результат генерации путеводителя
    if (tripGuideResult.status === 'rejected') {
      throw new Error(`Trip guide generation failed: ${tripGuideResult.reason}`);
    }

    const tripGuide = tripGuideResult.value;
    console.log(`✅ TripGuide готов (${tripGuideTime}ms): ${tripGuide.title}`);

    // Проверяем результат загрузки экспертов
    if (expertsResult.status === 'rejected') {
      console.warn(`⚠️ Не удалось загрузить экспертов: ${expertsResult.reason}`);
      // Возвращаем только путеводитель без экспертов
      return {
        success: true,
        tripGuide,
        selectedExpertIds: questionnaireData.flowType === 'inspire-me' ? [] : 'NO_EXPERTS',
        error: 'Experts unavailable - guide generated successfully',
        timing: {
          tripGuideGeneration: tripGuideTime,
          expertSelection: 0,
          total: Date.now() - startTime
        }
      };
    }

    const experts = expertsResult.value;
    console.log(`✅ Эксперты загружены: ${experts.length} доступно`);

    // Теперь быстро подбираем экспертов на основе готового путеводителя
    const expertSelectionStart = Date.now();
    
    // Подготавливаем данные для AI
    const expertsList = experts.map(expert => ({
      id: expert.id,
      profession: expert.profession,
      bio: expert.oneline_bio
    }));

    // Формируем промпт с данными
    const { expertSelectionPrompt } = await import('../../back/prompts/expert-selection-prompt');
    const { openai } = await import('./openai');

    const prompt = `${expertSelectionPrompt}

🗺️ TRIP GUIDE TO ANALYZE:
Flow Type: ${tripGuide.flowType}
Content: ${tripGuide.content}

👥 AVAILABLE EXPERTS:
${expertsList.map(expert => 
  `ID: ${expert.id} | Profession: ${expert.profession} | Bio: ${expert.bio}`
).join('\n')}

Select the best expert(s) and return only the ID(s) in the specified format.`;

    // Запрос к OpenAI для выбора экспертов
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert matching system. Follow the instructions precisely and return only the requested format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 100
    });

    const result = completion.choices[0]?.message?.content?.trim();
    const expertSelectionTime = Date.now() - expertSelectionStart;

    if (!result) {
      throw new Error('No response from AI expert selection');
    }

    // Парсим результат в зависимости от типа потока
    let selectedExpertIds: string | string[];

    if (tripGuide.flowType === 'i-know-where') {
      selectedExpertIds = result.replace(/[`"]/g, '').trim();
      
      if (selectedExpertIds !== 'NO_MATCH' && !experts.find(e => e.id === selectedExpertIds)) {
        throw new Error(`Selected expert ID ${selectedExpertIds} not found`);
      }
    } else {
      selectedExpertIds = JSON.parse(result);
      
      if (!Array.isArray(selectedExpertIds) || selectedExpertIds.length !== 3) {
        throw new Error('Expected array of 3 expert IDs for inspire-me flow');
      }

      const uniqueIds = new Set(selectedExpertIds);
      if (uniqueIds.size !== 3) {
        throw new Error('Expert IDs must be unique');
      }

      for (const id of selectedExpertIds) {
        if (!experts.find(e => e.id === id)) {
          throw new Error(`Selected expert ID ${id} not found`);
        }
      }
    }

    const totalTime = Date.now() - startTime;
    
    console.log(`✅ Эксперты подобраны (${expertSelectionTime}ms):`, selectedExpertIds);
    console.log(`🏁 Полное время выполнения: ${totalTime}ms`);

    return {
      success: true,
      tripGuide,
      selectedExpertIds,
      timing: {
        tripGuideGeneration: tripGuideTime,
        expertSelection: expertSelectionTime,
        total: totalTime
      }
    };

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('Integrated trip planning error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timing: {
        tripGuideGeneration: 0,
        expertSelection: 0,
        total: totalTime
      }
    };
  }
}

/**
 * Вспомогательная функция для получения полных данных выбранных экспертов
 */
export async function getSelectedExpertsDetails(selectedIds: string | string[]) {
  const experts = await fetchAllExperts();
  const idsArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
  
  return idsArray
    .filter(id => id !== 'NO_MATCH' && id !== 'NO_EXPERTS')
    .map(id => experts.find(expert => expert.id === id))
    .filter(expert => expert !== undefined);
}