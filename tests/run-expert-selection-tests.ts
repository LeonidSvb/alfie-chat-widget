// Тестирование системы выбора экспертов
import { selectBestExpert } from '../src/lib/expertSelector';
import { testTripGuides, testExperts } from './expert-selection-test-data';

interface TestResult {
  testId: string;
  flowType: string;
  expectedMatches: string[];
  actualResult: string | string[];
  success: boolean;
  accuracy: number;
  error?: string;
}

// Ожидаемые результаты для каждого теста
const expectedResults: Record<string, string[]> = {
  'test-1-nepal': ['expert-nepal-1'],
  'test-2-indonesia': ['expert-diving-1'],
  'test-3-berlin': ['expert-berlin-1'],
  'test-4-utah-parks': ['expert-utah-1'],
  'test-5-japan-skiing': ['expert-japan-ski-1'],
  
  'test-6-winter-escape': ['expert-patagonia-1', 'expert-morocco-1', 'expert-thailand-1'],
  'test-7-summer-active': ['expert-norway-1', 'expert-romania-1', 'expert-scotland-1'],
  'test-8-family-adventure': ['expert-australia-1', 'expert-costarica-1', 'expert-newzealand-1'],
  'test-9-cultural-immersion': ['expert-uzbekistan-1', 'expert-ethiopia-1', 'expert-bhutan-1'],
  'test-10-autumn-colors': ['expert-japanese-alps-1', 'expert-canadian-rockies-1', 'expert-european-alps-1']
};

/**
 * Вычисляет точность сопоставления
 */
function calculateAccuracy(expected: string[], actual: string | string[]): number {
  const actualArray = Array.isArray(actual) ? actual : [actual];
  
  if (expected.length !== actualArray.length) {
    return 0;
  }

  let matches = 0;
  for (const expectedId of expected) {
    if (actualArray.includes(expectedId)) {
      matches++;
    }
  }

  return (matches / expected.length) * 100;
}

/**
 * Запуск всех тестов
 */
export async function runAllTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('🚀 Запуск тестирования системы выбора экспертов...\n');

  for (const tripGuide of testTripGuides) {
    console.log(`Тестирование: ${tripGuide.title} (${tripGuide.flowType})`);
    
    try {
      const result = await selectBestExpert(tripGuide, testExperts);
      const expected = expectedResults[tripGuide.id];
      const accuracy = calculateAccuracy(expected, result.selectedExpertIds);

      const testResult: TestResult = {
        testId: tripGuide.id,
        flowType: tripGuide.flowType,
        expectedMatches: expected,
        actualResult: result.selectedExpertIds,
        success: result.success,
        accuracy,
        error: result.error
      };

      results.push(testResult);

      console.log(`✅ Результат: ${JSON.stringify(result.selectedExpertIds)}`);
      console.log(`📊 Точность: ${accuracy}%\n`);

    } catch (error) {
      const testResult: TestResult = {
        testId: tripGuide.id,
        flowType: tripGuide.flowType,
        expectedMatches: expectedResults[tripGuide.id],
        actualResult: 'ERROR',
        success: false,
        accuracy: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      results.push(testResult);
      console.log(`❌ Ошибка: ${testResult.error}\n`);
    }
  }

  return results;
}

/**
 * Анализ результатов тестирования
 */
export function analyzeResults(results: TestResult[]): {
  overallAccuracy: number;
  successRate: number;
  iKnowWhereAccuracy: number;
  inspireMeAccuracy: number;
  detailedAnalysis: string;
} {
  const totalTests = results.length;
  const successfulTests = results.filter(r => r.success).length;
  const totalAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / totalTests;

  const iKnowWhereResults = results.filter(r => r.flowType === 'i-know-where');
  const inspireMeResults = results.filter(r => r.flowType === 'inspire-me');

  const iKnowWhereAccuracy = iKnowWhereResults.reduce((sum, r) => sum + r.accuracy, 0) / iKnowWhereResults.length;
  const inspireMeAccuracy = inspireMeResults.reduce((sum, r) => sum + r.accuracy, 0) / inspireMeResults.length;

  let detailedAnalysis = '📋 ДЕТАЛЬНЫЙ АНАЛИЗ РЕЗУЛЬТАТОВ:\n\n';
  
  // Анализ по типам потоков
  detailedAnalysis += `🎯 I KNOW WHERE TO GO (${iKnowWhereResults.length} тестов):\n`;
  iKnowWhereResults.forEach(r => {
    detailedAnalysis += `  • ${r.testId}: ${r.accuracy}% (ожидали: ${r.expectedMatches[0]}, получили: ${r.actualResult})\n`;
  });

  detailedAnalysis += `\n🌟 INSPIRE ME (${inspireMeResults.length} тестов):\n`;
  inspireMeResults.forEach(r => {
    detailedAnalysis += `  • ${r.testId}: ${r.accuracy}%\n`;
    detailedAnalysis += `    Ожидали: [${r.expectedMatches.join(', ')}]\n`;
    detailedAnalysis += `    Получили: ${JSON.stringify(r.actualResult)}\n\n`;
  });

  // Анализ ошибок
  const errors = results.filter(r => !r.success);
  if (errors.length > 0) {
    detailedAnalysis += `❌ ОШИБКИ (${errors.length}):\n`;
    errors.forEach(r => {
      detailedAnalysis += `  • ${r.testId}: ${r.error}\n`;
    });
  }

  return {
    overallAccuracy: totalAccuracy,
    successRate: (successfulTests / totalTests) * 100,
    iKnowWhereAccuracy,
    inspireMeAccuracy,
    detailedAnalysis
  };
}

/**
 * Рекомендации по улучшению
 */
export function generateRecommendations(results: TestResult[]): string {
  let recommendations = '🔧 РЕКОМЕНДАЦИИ ПО УЛУЧШЕНИЮ:\n\n';

  const lowAccuracyTests = results.filter(r => r.accuracy < 80);
  const failedTests = results.filter(r => !r.success);

  // Анализ проблем с точностью
  if (lowAccuracyTests.length > 0) {
    recommendations += `📉 Низкая точность (${lowAccuracyTests.length} тестов):\n`;
    lowAccuracyTests.forEach(r => {
      recommendations += `  • ${r.testId}: ${r.accuracy}% - требует улучшения промпта\n`;
    });
    recommendations += '\n';
  }

  // Анализ технических ошибок
  if (failedTests.length > 0) {
    recommendations += `⚠️ Технические проблемы (${failedTests.length}):\n`;
    failedTests.forEach(r => {
      recommendations += `  • ${r.testId}: ${r.error}\n`;
    });
    recommendations += '\n';
  }

  // Общие рекомендации
  recommendations += '💡 КОНКРЕТНЫЕ УЛУЧШЕНИЯ:\n\n';
  
  recommendations += '1. **Улучшение промпта**:\n';
  recommendations += '   - Добавить больше примеров сопоставления местоположений\n';
  recommendations += '   - Усилить логику приоритетов для Inspire Me потока\n';
  recommendations += '   - Добавить fallback логику для нечетких совпадений\n\n';

  recommendations += '2. **Обработка ошибок**:\n';
  recommendations += '   - Добавить retry механизм для API ошибок\n';
  recommendations += '   - Улучшить валидацию ответов от OpenAI\n';
  recommendations += '   - Добавить fallback на rule-based matching\n\n';

  recommendations += '3. **Оптимизация производительности**:\n';
  recommendations += '   - Кэширование результатов для похожих запросов\n';
  recommendations += '   - Батчевая обработка для Inspire Me потока\n';
  recommendations += '   - Мониторинг времени ответа\n\n';

  return recommendations;
}

// Экспорт для запуска тестов
if (require.main === module) {
  runAllTests().then(results => {
    const analysis = analyzeResults(results);
    const recommendations = generateRecommendations(results);

    console.log('\n🎯 ИТОГОВЫЕ РЕЗУЛЬТАТЫ:');
    console.log(`Общая точность: ${analysis.overallAccuracy.toFixed(1)}%`);
    console.log(`Успешность: ${analysis.successRate.toFixed(1)}%`);
    console.log(`I Know Where: ${analysis.iKnowWhereAccuracy.toFixed(1)}%`);
    console.log(`Inspire Me: ${analysis.inspireMeAccuracy.toFixed(1)}%`);

    console.log('\n' + analysis.detailedAnalysis);
    console.log(recommendations);
  });
}