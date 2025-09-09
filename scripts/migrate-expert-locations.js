const Airtable = require('airtable');

// Load environment variables from process.env (should work in Next.js environment)
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.error('❌ Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID environment variables');
  process.exit(1);
}

const base = new Airtable({
  apiKey: apiKey,
}).base(baseId);

const EXPERTS_TABLE = 'tblsSB9gBBFhH2qci';
const EXPERT_DESTINATIONS_TABLE = 'tblGzWR1aYpAssoOP';

async function migrateExpertLocations() {
  try {
    console.log('🚀 Starting expert location data migration...');

    // Get all expert destinations
    console.log('📦 Fetching expert destinations...');
    const destinations = await base(EXPERT_DESTINATIONS_TABLE).select({
      maxRecords: 1000,
    }).all();

    console.log(`Found ${destinations.length} destination records`);

    // Group destinations by expert
    const expertDestinations = {};
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
      const state = record.get('State') || record.get('Region');
      const region = record.get('Sub-Region') || record.get('Region');
      const specificLocation = record.get('Specific Location');
      const city = record.get('City');

      if (country) expertDestinations[key].countries.add(country);
      if (state) expertDestinations[key].states.add(state);
      if (region) expertDestinations[key].regions.add(region);
      if (specificLocation) expertDestinations[key].specificAreas.add(specificLocation);
      if (city) expertDestinations[key].cities.add(city);
    });

    console.log(`Grouped into ${Object.keys(expertDestinations).length} expert location sets`);

    // Get all experts
    console.log('👥 Fetching expert records...');
    const experts = await base(EXPERTS_TABLE).select({
      maxRecords: 100,
    }).all();

    console.log(`Found ${experts.length} expert records`);

    // Update experts with location data
    let updatedCount = 0;
    let skippedCount = 0;

    for (const expert of experts) {
      const expertId = expert.id;
      const expertName = expert.get('Author Name');
      
      // Find matching destination data by ID or name
      let locationData = expertDestinations[expertId];
      if (!locationData && expertName) {
        locationData = expertDestinations[expertName];
      }

      if (!locationData) {
        console.log(`⏭️  No destination data found for expert: ${expertName} (${expertId})`);
        skippedCount++;
        continue;
      }

      // Prepare update data
      const updateData = {};
      
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
          await base(EXPERTS_TABLE).update(expertId, updateData);
          console.log(`✅ Updated ${expertName}: ${JSON.stringify(updateData)}`);
          updatedCount++;
          
          // Rate limiting - wait 100ms between updates
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`❌ Failed to update expert ${expertName}:`, error);
        }
      } else {
        console.log(`⏭️  No location data to migrate for expert: ${expertName}`);
        skippedCount++;
      }
    }

    console.log('\n🎉 Migration completed!');
    console.log(`✅ Updated: ${updatedCount} experts`);
    console.log(`⏭️  Skipped: ${skippedCount} experts`);
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateExpertLocations().then(() => {
  console.log('🚀 Migration script completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Migration script failed:', error);
  process.exit(1);
});