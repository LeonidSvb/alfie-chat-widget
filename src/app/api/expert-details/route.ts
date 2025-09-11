import { NextRequest, NextResponse } from 'next/server';

export interface ExpertDetailsResponse {
  success: boolean;
  expert?: {
    id: string;
    name: string;
    profession: string;
    avatar?: string;
    link?: string;
    bio?: string;
  };
  error?: string;
}

/**
 * API endpoint для получения полных данных эксперта по ID
 * 
 * GET /api/expert-details?id=expertId
 * 
 * Возвращает полную информацию об эксперте из Airtable
 */
export async function GET(request: NextRequest): Promise<NextResponse<ExpertDetailsResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const expertId = searchParams.get('id');

    if (!expertId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Expert ID is required'
        },
        { status: 400 }
      );
    }

    // Проверяем переменные окружения
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Airtable configuration missing'
        },
        { status: 500 }
      );
    }

    // Запрос к Airtable для получения конкретной записи
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/Expert%20Info/${expertId}`;
    
    const response = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: 'Expert not found'
          },
          { status: 404 }
        );
      }
      
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();

    // Маппинг данных из Airtable
    const expert = {
      id: data.id,
      name: data.fields['Author Name'] || 'Unknown Expert',
      profession: data.fields['Profession(s)'] || 'Professional Guide',
      avatar: data.fields['Profile Pictures'] && data.fields['Profile Pictures'][0]?.url,
      link: data.fields['Profile Link'],
      bio: data.fields['Bio (one line)']
    };

    return NextResponse.json({
      success: true,
      expert
    });

  } catch (error) {
    console.error('Expert details API error:', error);
    
    if (error instanceof Error) {
      // Ошибки сети Airtable
      if (error.message.includes('ENOTFOUND') || error.message.includes('EAI_AGAIN')) {
        return NextResponse.json(
          {
            success: false,
            error: '🌐 Network connectivity issue. Please check your connection and try again.'
          },
          { status: 503 }
        );
      }
      
      // Ошибки API Airtable
      if (error.message.includes('Airtable API')) {
        return NextResponse.json(
          {
            success: false,
            error: '📊 Expert database temporarily unavailable. Please try again later.'
          },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: '❌ An unexpected error occurred while fetching expert details.'
      },
      { status: 500 }
    );
  }
}

// Обработка неподдерживаемых методов
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to fetch expert details.' },
    { status: 405 }
  );
}