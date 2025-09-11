import { NextRequest, NextResponse } from 'next/server';
import { fetchAllExperts } from '@/lib/simpleExpertFetcher';

/**
 * Простой тестовый endpoint для проверки получения экспертов из Airtable
 */
export async function GET() {
  try {
    console.log('🔍 Тестируем получение экспертов из Airtable...');
    
    const experts = await fetchAllExperts();
    
    console.log(`✅ Получено экспертов: ${experts.length}`);
    
    return NextResponse.json({
      success: true,
      count: experts.length,
      experts: experts.slice(0, 5), // Показываем первых 5 для примера
      sample: experts.length > 0 ? {
        id: experts[0].id,
        profession: experts[0].profession,
        bio_preview: experts[0].oneline_bio?.substring(0, 100) + '...'
      } : null
    });

  } catch (error) {
    console.error('Ошибка получения экспертов:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : null
    }, { status: 500 });
  }
}