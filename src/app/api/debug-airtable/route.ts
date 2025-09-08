import { NextResponse } from 'next/server';
import { getAllExperts, getAllExpertDestinations, debugAirtableTables } from '@/lib/airtable';

export async function GET() {
  try {
    // Get debug info about table structures
    const debugInfo = await debugAirtableTables();
    
    // Get all experts
    const experts = await getAllExperts();
    
    // Get all destinations  
    const destinations = await getAllExpertDestinations();

    return NextResponse.json({
      success: true,
      debugInfo,
      experts: {
        count: experts.length,
        data: experts
      },
      destinations: {
        count: destinations.length,
        data: destinations
      }
    });
  } catch (error) {
    console.error('Error in debug-airtable API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}