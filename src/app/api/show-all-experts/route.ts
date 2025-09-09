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

    // Get ALL records to see full structure
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${expertsTableId}?maxRecords=10`,
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
    
    if (!data.records || data.records.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No records found'
      });
    }

    // Analyze all records to see field structure
    const allFieldNames = new Set();
    const recordsWithFields = data.records.map((record: any) => {
      const fieldNames = Object.keys(record.fields);
      fieldNames.forEach(name => allFieldNames.add(name));
      
      return {
        id: record.id,
        expertName: record.fields['Author Name'],
        fieldCount: fieldNames.length,
        fieldNames: fieldNames,
        // Show raw data for first 3 records
        rawFields: data.records.indexOf(record) < 3 ? record.fields : null
      };
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalRecords: data.records.length,
      allUniqueFields: Array.from(allFieldNames).sort(),
      totalUniqueFields: allFieldNames.size,
      records: recordsWithFields
    });

  } catch (error) {
    console.error('Show all experts error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}