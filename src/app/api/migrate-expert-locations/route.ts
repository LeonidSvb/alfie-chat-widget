import { NextResponse } from 'next/server';
import { airtable } from '@/lib/airtable';

const EXPERTS_TABLE = 'tblsSB9gBBFhH2qci';
const EXPERT_DESTINATIONS_TABLE = 'tblGzWR1aYpAssoOP';

export async function POST() {
  try {
    console.log('🚀 Starting expert location data migration...');

    // Get all expert destinations
    console.log('📦 Fetching expert destinations...');
    const destinations = await airtable(EXPERT_DESTINATIONS_TABLE).select({
      maxRecords: 1000,
    }).all();

    console.log(`Found ${destinations.length} destination records`);

    // Group destinations by expert
    const expertDestinations: any = {};
    destinations.forEach(record => {
      const expertId = record.get('Expert ID') || record.get('Expert') || '';
      const expertName = record.get('Expert Name') || record.get('Author Name') || '';
      
      if (!expertId && !expertName) {
        console.warn('⚠️  Skipping record with no expert identifier:', record.id);
        return;
      }

      const key = expertId || expertName;
      
      if (!expertDestinations[key]) {
        expertDestinations[key] = {
          expertId,
          expertName,
          countries: new Set(),
          states: new Set(),
          regions: new Set(),
          specificAreas: new Set(),
          cities: new Set()
        };
      }

      const country = record.get('Country');
      const state = record.get('State');
      const region = record.get('Region');
      const subRegion = record.get('Subregion/Area') || record.get('Sub-Region');
      const specificLocation = record.get('Specific Location') || record.get('Specific Area / Notes');
      const city = record.get('City/Town') || record.get('City');

      if (country) expertDestinations[key].countries.add(country);
      if (state) expertDestinations[key].states.add(state);
      if (region) expertDestinations[key].regions.add(region);
      if (subRegion) expertDestinations[key].specificAreas.add(subRegion);
      if (specificLocation) expertDestinations[key].specificAreas.add(specificLocation);
      if (city) expertDestinations[key].cities.add(city);
    });

    console.log(`Grouped into ${Object.keys(expertDestinations).length} expert location sets`);

    // Get all experts
    console.log('👥 Fetching expert records...');
    const experts = await airtable(EXPERTS_TABLE).select({
      maxRecords: 100,
    }).all();

    console.log(`Found ${experts.length} expert records`);

    // Update experts with location data
    let updatedCount = 0;
    let skippedCount = 0;
    const updateResults = [];

    for (const expert of experts) {
      const expertId = expert.id;
      const expertName = expert.get('Author Name') as string;
      
      // Find matching destination data by ID or name
      let locationData = expertDestinations[expertId];
      if (!locationData && expertName) {
        locationData = expertDestinations[expertName];
      }

      if (!locationData) {
        console.log(`⏭️  No destination data found for expert: ${expertName} (${expertId})`);
        skippedCount++;
        updateResults.push({
          expertName,
          expertId,
          status: 'skipped',
          reason: 'No destination data found'
        });
        continue;
      }

      // Prepare update data
      const updateData: any = {};
      
      if (locationData.countries.size > 0) {
        updateData['Country'] = Array.from(locationData.countries);
      }
      
      if (locationData.states.size > 0) {
        updateData['State'] = Array.from(locationData.states);
      }
      
      if (locationData.regions.size > 0) {
        updateData['Region'] = Array.from(locationData.regions);
      }
      
      if (locationData.specificAreas.size > 0) {
        updateData['Specific area'] = Array.from(locationData.specificAreas);
      }
      
      if (locationData.cities.size > 0) {
        updateData['City / Town'] = Array.from(locationData.cities);
      }

      // Only update if we have location data to add
      if (Object.keys(updateData).length > 0) {
        try {
          await airtable(EXPERTS_TABLE).update(expertId, updateData);
          console.log(`✅ Updated ${expertName}: ${JSON.stringify(updateData)}`);
          updatedCount++;
          updateResults.push({
            expertName,
            expertId,
            status: 'updated',
            data: updateData
          });
          
          // Rate limiting - wait 100ms between updates
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`❌ Failed to update expert ${expertName}:`, error);
          updateResults.push({
            expertName,
            expertId,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      } else {
        console.log(`⏭️  No location data to migrate for expert: ${expertName}`);
        skippedCount++;
        updateResults.push({
          expertName,
          expertId,
          status: 'skipped',
          reason: 'No location data to migrate'
        });
      }
    }

    console.log('\n🎉 Migration completed!');
    console.log(`✅ Updated: ${updatedCount} experts`);
    console.log(`⏭️  Skipped: ${skippedCount} experts`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalDestinations: destinations.length,
        expertLocationSets: Object.keys(expertDestinations).length,
        totalExperts: experts.length,
        updated: updatedCount,
        skipped: skippedCount
      },
      results: updateResults
    });
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}