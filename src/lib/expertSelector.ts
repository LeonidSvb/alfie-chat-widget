/**
 * Система выбора экспертов на основе анализа путеводителей
 * 
 * Эта функция анализирует сгенерированный путеводитель и список доступных экспертов,
 * затем выбирает наиболее подходящего эксперта (или экспертов) на основе:
 * 1. Соответствия местоположения (наивысший приоритет)
 * 2. Совпадения активностей 
 * 3. Глубины экспертизы
 * 4. Языковых и культурных знаний
 * 
 * Функция работает с двумя потоками:
 * - "I Know Where To Go": возвращает ID одного эксперта
 * - "Inspire Me": возвращает массив из 3 ID экспертов (по одному на каждую идею)
 */

import { openai } from './openai';
import { expertSelectionPrompt } from '../../back/prompts/expert-selection-prompt';
import { SimpleExpert, fetchAllExperts } from './simpleExpertFetcher';
import { TripGuide } from '../types/tripGuide';

export interface ExpertSelectionRequest {
  tripGuide: TripGuide;
  experts: SimpleExpert[];
}

export interface ExpertSelectionResult {
  success: boolean;
  selectedExpertIds: string | string[];
  error?: string;
}

/**
 * Основная функция выбора экспертов с автоматическим получением данных
 * 
 * @param tripGuide - Сгенерированный путеводитель (содержит flowType и content)
 * @returns Результат с ID выбранного эксперта или массивом ID экспертов
 */
export async function selectBestExpert(
  tripGuide: TripGuide
): Promise<ExpertSelectionResult> {
  try {
    // Валидация входных данных
    if (!tripGuide || !tripGuide.content) {
      throw new Error('Trip guide content is required');
    }

    // Получаем реальных экспертов из Airtable
    const experts = await fetchAllExperts();
    
    if (!experts || experts.length === 0) {
      throw new Error('No experts available in database');
    }

    // Подготовка данных для AI
    const expertsList = experts.map(expert => ({
      id: expert.id,
      profession: expert.profession,
      bio: expert.oneline_bio
    }));

    // Формирование промпта с данными
    const prompt = `${expertSelectionPrompt}

🗺️ TRIP GUIDE TO ANALYZE:
Flow Type: ${tripGuide.flowType}
Content: ${tripGuide.content}

👥 AVAILABLE EXPERTS:
${expertsList.map(expert => 
  `ID: ${expert.id} | Profession: ${expert.profession} | Bio: ${expert.bio}`
).join('\n')}

Select the best expert(s) and return only the ID(s) in the specified format.`;

    // Запрос к OpenAI
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
      temperature: 0.1, // Низкая температура для более предсказуемых результатов
      max_tokens: 100 // Краткий ответ с только ID
    });

    const result = completion.choices[0]?.message?.content?.trim();

    if (!result) {
      throw new Error('No response from AI expert selection');
    }

    // Парсинг результата в зависимости от типа потока
    let selectedExpertIds: string | string[];

    if (tripGuide.flowType === 'i-know-where') {
      // Для "I Know Where To Go" ожидаем один ID
      selectedExpertIds = result.replace(/[`"]/g, '').trim();
      
      // Проверяем что ID существует в списке экспертов
      if (selectedExpertIds !== 'NO_MATCH' && !experts.find(e => e.id === selectedExpertIds)) {
        throw new Error(`Selected expert ID ${selectedExpertIds} not found in experts list`);
      }
    } else if (tripGuide.flowType === 'inspire-me') {
      // Для "Inspire Me" ожидаем массив из 3 ID
      try {
        selectedExpertIds = JSON.parse(result);
        
        if (!Array.isArray(selectedExpertIds) || selectedExpertIds.length !== 3) {
          throw new Error('Expected array of 3 expert IDs for inspire-me flow');
        }

        // Проверяем что все ID существуют и уникальны
        const uniqueIds = new Set(selectedExpertIds);
        if (uniqueIds.size !== 3) {
          throw new Error('Expert IDs must be unique');
        }

        for (const id of selectedExpertIds) {
          if (!experts.find(e => e.id === id)) {
            throw new Error(`Selected expert ID ${id} not found in experts list`);
          }
        }
      } catch (parseError) {
        throw new Error(`Failed to parse expert IDs array: ${parseError}`);
      }
    } else {
      throw new Error(`Unsupported flow type: ${tripGuide.flowType}`);
    }

    console.log(`Expert selection successful for ${tripGuide.flowType}:`, selectedExpertIds);

    return {
      success: true,
      selectedExpertIds
    };

  } catch (error) {
    console.error('Expert selection error:', error);
    
    return {
      success: false,
      selectedExpertIds: tripGuide.flowType === 'inspire-me' ? [] : 'NO_MATCH',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Вспомогательная функция для получения полных данных выбранных экспертов
 * 
 * @param selectedIds - ID выбранных экспертов
 * @param experts - Полный список экспертов
 * @returns Массив объектов экспертов с полными данными
 */
export function getSelectedExpertsDetails(
  selectedIds: string | string[], 
  experts: SimpleExpert[]
): SimpleExpert[] {
  const idsArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
  
  return idsArray
    .filter(id => id !== 'NO_MATCH')
    .map(id => experts.find(expert => expert.id === id))
    .filter((expert): expert is SimpleExpert => expert !== undefined);
}