import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('id') || 'recHHRTKg4IMUcWWi'; // Default to the record you mentioned

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const expertsTableId = 'tblsSB9gBBFhH2qci';

    if (!apiKey || !baseId) {
      return NextResponse.json({
        success: false,
        error: 'Missing Airtable credentials'
      });
    }

    // Get specific record
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${expertsTableId}/${recordId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const fields = data.fields;
    const fieldNames = Object.keys(fields);

    // Check all possible location field variations
    const locationFieldChecks = {
      // Primary names
      'Countries': fieldNames.includes('Countries'),
      'States': fieldNames.includes('States'), 
      'Regions': fieldNames.includes('Regions'),
      'SpecificAreas': fieldNames.includes('SpecificAreas'),
      
      // Alternative names
      'Country': fieldNames.includes('Country'),
      'State': fieldNames.includes('State'),
      'Region': fieldNames.includes('Region'),
      'Specific Areas': fieldNames.includes('Specific Areas'),
    };

    const locationFieldValues = {
      'Countries': fields['Countries'] || null,
      'States': fields['States'] || null,
      'Regions': fields['Regions'] || null,
      'SpecificAreas': fields['SpecificAreas'] || null,
      'Country': fields['Country'] || null,
      'State': fields['State'] || null,
      'Region': fields['Region'] || null,
      'Specific Areas': fields['Specific Areas'] || null,
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      recordId: data.id,
      expertName: fields['Author Name'],
      totalFields: fieldNames.length,
      allFieldNames: fieldNames,
      locationFieldChecks,
      locationFieldValues,
      rawFields: fields
    });

  } catch (error) {
    console.error('Check specific expert error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}