import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const expertsTableId = 'tblsSB9gBBFhH2qci';

    if (!apiKey || !baseId) {
      return NextResponse.json({
        success: false,
        error: 'Missing Airtable credentials'
      });
    }

    // Direct API call to Airtable - bypass any caching
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${expertsTableId}?maxRecords=1`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Force no caching
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.records || data.records.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No records found'
      });
    }

    const firstRecord = data.records[0];
    const fields = firstRecord.fields;
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
      'Specific_Areas': fieldNames.includes('Specific_Areas'),
      'Location Countries': fieldNames.includes('Location Countries'),
      'Location States': fieldNames.includes('Location States'),
      'Location Regions': fieldNames.includes('Location Regions'),
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
      expertName: fields['Author Name'],
      totalFields: fieldNames.length,
      allFieldNames: fieldNames,
      locationFieldChecks,
      locationFieldValues,
      rawFields: fields
    });

  } catch (error) {
    console.error('Direct Airtable check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}