import { NextRequest, NextResponse } from 'next/server';
import { selectBestExpert } from '@/lib/expertSelector';
import { fetchAllExperts } from '@/lib/simpleExpertFetcher';
import { TripGuide } from '@/types/tripGuide';

export interface SelectExpertRequest {
  tripGuide: TripGuide;
}

export interface SelectExpertResponse {
  success: boolean;
  selectedExpertIds?: string | string[];
  error?: string;
  errorType?: string;
}

/**
 * API endpoint для выбора наиболее подходящих экспертов на основе путеводителя
 * 
 * Принимает:
 * - tripGuide: объект с данными путеводителя (включая flowType и content)
 * 
 * Возвращает:
 * - Для "i-know-where": один ID эксперта (string)
 * - Для "inspire-me": массив из 3 ID экспертов (string[])
 */
export async function POST(request: NextRequest): Promise<NextResponse<SelectExpertResponse>> {
  try {
    const body = await request.json() as SelectExpertRequest;

    // Валидация обязательных полей
    if (!body.tripGuide) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: tripGuide',
          errorType: 'validation_error'
        },
        { status: 400 }
      );
    }

    if (!body.tripGuide.flowType || !body.tripGuide.content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Trip guide must contain flowType and content',
          errorType: 'validation_error'
        },
        { status: 400 }
      );
    }

    // Проверяем корректность flowType
    if (!['inspire-me', 'i-know-where'].includes(body.tripGuide.flowType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid flowType. Must be "inspire-me" or "i-know-where"',
          errorType: 'validation_error'
        },
        { status: 400 }
      );
    }

    // Получаем список всех экспертов
    const experts = await fetchAllExperts();

    if (experts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No experts available for selection',
          errorType: 'no_experts'
        },
        { status: 404 }
      );
    }

    // Выбираем наиболее подходящих экспертов
    const selectionResult = await selectBestExpert(body.tripGuide, experts);

    if (!selectionResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: selectionResult.error || 'Expert selection failed',
          errorType: 'selection_error'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      selectedExpertIds: selectionResult.selectedExpertIds
    });

  } catch (error) {
    console.error('Expert selection API error:', error);
    
    // Обработка различных типов ошибок
    if (error instanceof Error) {
      // Ошибки OpenAI quota/billing
      if (error.message.includes('quota') || error.message.includes('insufficient_quota')) {
        return NextResponse.json(
          {
            success: false,
            error: '🏦 OpenAI quota exceeded. Please check your billing and plan details.',
            errorType: 'quota_exceeded'
          },
          { status: 429 }
        );
      }
      
      // Ошибки rate limiting OpenAI
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return NextResponse.json(
          {
            success: false,
            error: '⏳ Service temporarily busy. Please try again in a few moments.',
            errorType: 'rate_limited'
          },
          { status: 429 }
        );
      }
      
      // Ошибки API ключа OpenAI
      if (error.message.includes('API key') || error.message.includes('unauthorized')) {
        return NextResponse.json(
          {
            success: false,
            error: '🔑 API configuration issue. Please contact support.',
            errorType: 'auth_error'
          },
          { status: 401 }
        );
      }

      // Ошибки Airtable
      if (error.message.includes('Airtable') || error.message.includes('AIRTABLE')) {
        return NextResponse.json(
          {
            success: false,
            error: '📊 Expert database temporarily unavailable. Please try again later.',
            errorType: 'database_error'
          },
          { status: 503 }
        );
      }
      
      // Сетевые ошибки
      if (error.message.includes('network') || error.message.includes('timeout')) {
        return NextResponse.json(
          {
            success: false,
            error: '🌐 Network connectivity issue. Please check your connection and try again.',
            errorType: 'network_error'
          },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: '❌ An unexpected error occurred during expert selection. Please try again.',
        errorType: 'unknown'
      },
      { status: 500 }
    );
  }
}

// Обработка неподдерживаемых методов
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to select experts.' },
    { status: 405 }
  );
}