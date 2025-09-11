import { NextRequest, NextResponse } from 'next/server';
import { generateTripWithExperts, IntegratedTripResult } from '@/lib/integratedTripPlannerWithExperts';
import { QuestionnaireData } from '@/types/questionnaire';

/**
 * Интегрированный API endpoint для генерации путеводителя + подбора экспертов
 * 
 * Этот endpoint заменяет отдельные вызовы /api/generate-trip-guide и /api/select-expert
 * одним быстрым запросом с параллельной обработкой.
 * 
 * Возвращает:
 * - Сгенерированный путеводитель
 * - ID подходящих экспертов
 * - Информацию о времени выполнения
 */
export async function POST(request: NextRequest): Promise<NextResponse<IntegratedTripResult>> {
  try {
    const body = await request.json() as QuestionnaireData;

    // Валидация обязательных полей
    if (!body.flowType || !body.answers) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: flowType or answers'
        },
        { status: 400 }
      );
    }

    // Проверка типа потока
    if (!['inspire-me', 'i-know-where'].includes(body.flowType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid flow type. Must be "inspire-me" or "i-know-where"'
        },
        { status: 400 }
      );
    }

    console.log(`🚀 Запрос интегрированного планирования: ${body.flowType}`);

    // Выполняем интегрированную генерацию путеводителя + подбор экспертов
    const result = await generateTripWithExperts(body);

    if (!result.success) {
      // Определяем тип ошибки для правильного HTTP статуса
      let statusCode = 500;
      let errorType = 'unknown';

      if (result.error) {
        if (result.error.includes('quota') || result.error.includes('insufficient_quota')) {
          statusCode = 429;
          errorType = 'quota_exceeded';
        } else if (result.error.includes('rate limit') || result.error.includes('429')) {
          statusCode = 429;
          errorType = 'rate_limited';
        } else if (result.error.includes('API key') || result.error.includes('unauthorized')) {
          statusCode = 401;
          errorType = 'auth_error';
        } else if (result.error.includes('network') || result.error.includes('timeout')) {
          statusCode = 503;
          errorType = 'network_error';
        } else if (result.error.includes('Airtable') || result.error.includes('database')) {
          statusCode = 503;
          errorType = 'database_error';
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: result.error || 'An unexpected error occurred',
          timing: result.timing
        },
        { status: statusCode }
      );
    }

    console.log(`✅ Интегрированное планирование завершено за ${result.timing?.total}ms`);

    return NextResponse.json({
      success: true,
      tripGuide: result.tripGuide,
      selectedExpertIds: result.selectedExpertIds,
      timing: result.timing
    });

  } catch (error) {
    console.error('Integrated trip planning API error:', error);
    
    // Обработка различных типов ошибок
    if (error instanceof Error) {
      // Ошибки OpenAI quota/billing
      if (error.message.includes('quota') || error.message.includes('insufficient_quota')) {
        return NextResponse.json(
          {
            success: false,
            error: '🏦 OpenAI quota exceeded. Please check your billing and plan details.'
          },
          { status: 429 }
        );
      }
      
      // Ошибки rate limiting OpenAI
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return NextResponse.json(
          {
            success: false,
            error: '⏳ Service temporarily busy. Please try again in a few moments.'
          },
          { status: 429 }
        );
      }
      
      // Ошибки API ключа OpenAI
      if (error.message.includes('API key') || error.message.includes('unauthorized')) {
        return NextResponse.json(
          {
            success: false,
            error: '🔑 API configuration issue. Please contact support.'
          },
          { status: 401 }
        );
      }

      // Ошибки Airtable
      if (error.message.includes('Airtable') || error.message.includes('database')) {
        return NextResponse.json(
          {
            success: false,
            error: '📊 Expert database temporarily unavailable. Trip guide generated without expert matching.'
          },
          { status: 206 } // Partial content - guide есть, экспертов нет
        );
      }
      
      // Сетевые ошибки
      if (error.message.includes('network') || error.message.includes('timeout')) {
        return NextResponse.json(
          {
            success: false,
            error: '🌐 Network connectivity issue. Please check your connection and try again.'
          },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: '❌ An unexpected error occurred during trip planning. Please try again.'
      },
      { status: 500 }
    );
  }
}

// Обработка неподдерживаемых методов
export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed. Use POST to generate trip with experts.',
      usage: {
        method: 'POST',
        endpoint: '/api/generate-trip-with-experts',
        body: {
          flowType: 'inspire-me | i-know-where',
          answers: 'QuestionnaireAnswers object'
        }
      }
    },
    { status: 405 }
  );
}