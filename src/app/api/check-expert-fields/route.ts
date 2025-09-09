import { NextResponse } from 'next/server';
import { airtable } from '@/lib/airtable';

const EXPERTS_TABLE = 'tblsSB9gBBFhH2qci';

export async function GET() {
  try {
    // Get one expert record to see ALL fields
    const records = await airtable(EXPERTS_TABLE).select({ 
      maxRecords: 1 
    }).all();

    if (records.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No expert records found'
      });
    }

    const record = records[0];
    const allFields = record.fields;
    const fieldNames = Object.keys(allFields);

    // Check specifically for new location fields
    const locationFields = {
      countries: allFields['Countries'] || null,
      states: allFields['States'] || null, 
      regions: allFields['Regions'] || null,
      specificAreas: allFields['SpecificAreas'] || null,
      // Alternative field names if different
      countriesAlt: allFields['Country'] || null,
      statesAlt: allFields['State'] || null,
      regionsAlt: allFields['Region'] || null,
      specificAreasAlt: allFields['Specific Areas'] || null,
    };

    return NextResponse.json({
      success: true,
      expertId: record.id,
      expertName: allFields['Author Name'],
      allFieldNames: fieldNames,
      locationFields,
      fieldsFound: fieldNames.length,
      newLocationFieldsExist: {
        countries: fieldNames.includes('Countries'),
        states: fieldNames.includes('States'),
        regions: fieldNames.includes('Regions'), 
        specificAreas: fieldNames.includes('SpecificAreas'),
        // Alternative names
        countriesAlt: fieldNames.includes('Country'),
        statesAlt: fieldNames.includes('State'),
        regionsAlt: fieldNames.includes('Region'),
        specificAreasAlt: fieldNames.includes('Specific Areas'),
      }
    });

  } catch (error) {
    console.error('Error checking expert fields:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}