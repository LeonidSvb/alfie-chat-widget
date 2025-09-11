import { NextRequest, NextResponse } from 'next/server';
import { fetchAllExperts } from '@/lib/simpleExpertFetcher';

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
 * Использует кэшированные данные экспертов из fetchAllExperts
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

    // Используем fetchAllExperts для получения кэшированных данных
    const experts = await fetchAllExperts();
    
    // Находим эксперта по ID
    const expertData = experts.find(expert => expert.id === expertId);
    
    if (!expertData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Expert not found'
        },
        { status: 404 }
      );
    }

    // Маппинг данных для фронтенда
    const expert = {
      id: expertData.id,
      name: expertData.name,
      profession: expertData.profession || 'Professional Guide',
      avatar: expertData.avatar,
      link: expertData.link,
      bio: expertData.bio
    };

    return NextResponse.json({
      success: true,
      expert
    });

  } catch (error) {
    console.error('Expert details API error:', error);
    
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