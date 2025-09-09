import Airtable from 'airtable';
import { Expert } from '@/types/expert';

export const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

const EXPERTS_TABLE = 'tblsSB9gBBFhH2qci';
const EXPERT_DESTINATIONS_TABLE = 'tblGzWR1aYpAssoOP';

export async function queryExperts(tags: string[]): Promise<Expert[]> {
  try {
    const records = await airtable(EXPERTS_TABLE).select({
      maxRecords: 10,
    }).all();

    return records.map(record => mapAirtableRecordToExpert(record));
  } catch (error) {
    console.error('Error querying experts from Airtable:', error);
    return [];
  }
}

export async function getExpertById(expertId: string): Promise<Expert | null> {
  try {
    const record = await airtable(EXPERTS_TABLE).find(expertId);
    
    return {
      id: record.id,
      name: record.get('name') as string,
      avatar: record.get('avatar') as string || undefined,
      description: record.get('description') as string,
      specialties: (record.get('specialties') as string || '').split(',').map(s => s.trim()),
      tags: (record.get('tags') as string || '').split(',').map(s => s.trim()),
      link: record.get('link') as string,
      rating: record.get('rating') as number || undefined,
      reviewCount: record.get('reviewCount') as number || undefined,
      location: record.get('location') as string || undefined,
      languages: record.get('languages') ? (record.get('languages') as string).split(',').map(s => s.trim()) : undefined,
      isActive: record.get('isActive') as boolean,
      createdAt: record.get('createdAt') ? new Date(record.get('createdAt') as string) : undefined,
      updatedAt: record.get('updatedAt') ? new Date(record.get('updatedAt') as string) : undefined,
    };
  } catch (error) {
    console.error('Error getting expert by ID from Airtable:', error);
    return null;
  }
}

export async function getAllExperts(): Promise<Expert[]> {
  try {
    const records = await airtable(EXPERTS_TABLE).select({
      maxRecords: 100,
    }).all();

    return records.map(record => mapAirtableRecordToExpert(record));
  } catch (error) {
    console.error('Error getting all experts from Airtable:', error);
    return getMockExperts();
  }
}

export async function getAllExpertDestinations() {
  try {
    const records = await airtable(EXPERT_DESTINATIONS_TABLE).select({
      maxRecords: 1000,
    }).all();

    return records.map(record => ({
      id: record.id,
      expertId: record.get('Expert ID') || record.get('Expert') || '',
      expertName: record.get('Expert Name') || record.get('Author Name') || '',
      country: record.get('Country') || '',
      region: record.get('Region') || '',
      subRegion: record.get('Sub-Region') || '',
      city: record.get('City') || '',
      specificLocation: record.get('Specific Location') || '',
      createdAt: (record as any).createdTime ? new Date((record as any).createdTime) : undefined,
      ...record.fields
    }));
  } catch (error) {
    console.error('Error getting expert destinations from Airtable:', error);
    return [];
  }
}

export async function debugAirtableTables() {
  try {
    console.log('=== DEBUGGING AIRTABLE TABLES ===');
    
    // Get experts table
    const expertsRecords = await airtable(EXPERTS_TABLE).select({ maxRecords: 5 }).all();
    console.log('Experts table sample:');
    expertsRecords.forEach(record => {
      console.log('Expert ID:', record.id);
      console.log('Fields:', Object.keys(record.fields));
      console.log('Sample data:', record.fields);
      console.log('---');
    });

    // Get destinations table  
    const destinationsRecords = await airtable(EXPERT_DESTINATIONS_TABLE).select({ maxRecords: 5 }).all();
    console.log('Destinations table sample:');
    destinationsRecords.forEach(record => {
      console.log('Destination ID:', record.id);
      console.log('Fields:', Object.keys(record.fields));
      console.log('Sample data:', record.fields);
      console.log('---');
    });

    return {
      expertsCount: expertsRecords.length,
      destinationsCount: destinationsRecords.length,
      expertsFields: expertsRecords[0] ? Object.keys(expertsRecords[0].fields) : [],
      destinationsFields: destinationsRecords[0] ? Object.keys(destinationsRecords[0].fields) : []
    };
  } catch (error) {
    console.error('Error debugging Airtable tables:', error);
    return { error: error.message };
  }
}

function mapAirtableRecordToExpert(record: any): Expert {
  const fields = record.fields;
  const profilePicture = fields['Profile Picture 600 x 600'];
  const avatar = profilePicture && profilePicture[0] ? profilePicture[0].url : undefined;
  
  // Generate tags from bio and profession since we don't have explicit tags
  const bio = fields['One line bio'] || '';
  const profession = fields['Profession(s)'] || '';
  const destinations = fields['Destinations'] || '';
  
  const tags = generateTagsFromText(bio + ' ' + profession + ' ' + destinations);
  
  return {
    id: record.id,
    name: fields['Author Name'] || 'Unknown Expert',
    avatar: avatar,
    description: bio,
    specialties: profession ? profession.split(',').map((s: string) => s.trim()) : [],
    tags: tags,
    link: fields['Profile Link'] || '',
    rating: undefined,
    reviewCount: undefined,
    location: destinations,
    languages: ['English'],
    isActive: true,
    createdAt: record.createdTime ? new Date(record.createdTime) : undefined,
    updatedAt: undefined,
  };
}

function generateTagsFromText(text: string): string[] {
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall', 'who', 'what', 'where', 'when', 'why', 'how', 'a', 'an'];
  
  const tags = [];
  
  // Extract relevant keywords
  if (text.toLowerCase().includes('hik')) tags.push('hiking');
  if (text.toLowerCase().includes('mountain')) tags.push('mountains');
  if (text.toLowerCase().includes('park') || text.toLowerCase().includes('ranger')) tags.push('national-parks');
  if (text.toLowerCase().includes('trail')) tags.push('trails');
  if (text.toLowerCase().includes('backpack')) tags.push('backpacking');
  if (text.toLowerCase().includes('climb')) tags.push('climbing');
  if (text.toLowerCase().includes('outdoor')) tags.push('outdoor');
  if (text.toLowerCase().includes('adventure')) tags.push('adventure');
  if (text.toLowerCase().includes('guide')) tags.push('guide');
  if (text.toLowerCase().includes('family')) tags.push('family');
  if (text.toLowerCase().includes('solo')) tags.push('solo');
  if (text.toLowerCase().includes('cultural') || text.toLowerCase().includes('culture')) tags.push('cultural');
  if (text.toLowerCase().includes('bike') || text.toLowerCase().includes('cycling')) tags.push('cycling');
  if (text.toLowerCase().includes('ski')) tags.push('skiing');
  if (text.toLowerCase().includes('water') || text.toLowerCase().includes('kayak')) tags.push('water-activities');
  if (text.toLowerCase().includes('desert')) tags.push('desert');
  if (text.toLowerCase().includes('canyon')) tags.push('canyon');
  if (text.toLowerCase().includes('utah')) tags.push('utah');
  if (text.toLowerCase().includes('europe')) tags.push('europe');
  if (text.toLowerCase().includes('luxury')) tags.push('luxury');
  if (text.toLowerCase().includes('budget')) tags.push('budget');
  
  return tags.length > 0 ? tags : ['outdoor', 'adventure', 'expert'];
}

function getMockExperts(): Expert[] {
  const mockTags = [
    ['hiking', 'mountains', 'outdoor', 'adventure', 'nature'],
    ['beach', 'surfing', 'coastal', 'water-sports', 'tropical'],
    ['cultural', 'museums', 'history', 'art', 'urban'],
    ['food', 'culinary', 'wine', 'local-cuisine', 'gastronomic'],
    ['family', 'kids', 'budget', 'accessible', 'safe'],
    ['luxury', 'spa', 'wellness', 'romantic', 'premium'],
    ['backpacking', 'budget', 'hostels', 'independent', 'young'],
    ['wildlife', 'safari', 'nature', 'photography', 'conservation']
  ];

  return [
    {
      id: 'mock-1',
      name: 'Sarah Mountain',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
      description: 'Adventure hiking specialist with 15+ years exploring mountain trails worldwide. Expert in sustainable outdoor travel.',
      specialties: ['Mountain Hiking', 'Adventure Travel', 'Sustainable Tourism'],
      tags: mockTags[0],
      link: 'https://calendly.com/sarah-mountain',
      rating: 4.9,
      reviewCount: 127,
      location: 'Colorado, USA',
      languages: ['English', 'Spanish'],
      isActive: true,
    },
    {
      id: 'mock-2',
      name: 'Carlos Beach',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      description: 'Coastal travel expert specializing in beach destinations and water activities across Latin America.',
      specialties: ['Beach Destinations', 'Water Sports', 'Latin America'],
      tags: mockTags[1],
      link: 'https://calendly.com/carlos-beach',
      rating: 4.8,
      reviewCount: 89,
      location: 'Costa Rica',
      languages: ['Spanish', 'English', 'Portuguese'],
      isActive: true,
    },
    {
      id: 'mock-3',
      name: 'Emma Culture',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      description: 'Cultural travel guide focused on historical sites, museums, and authentic local experiences in Europe.',
      specialties: ['Cultural Tours', 'Historical Sites', 'European Travel'],
      tags: mockTags[2],
      link: 'https://calendly.com/emma-culture',
      rating: 4.7,
      reviewCount: 156,
      location: 'Rome, Italy',
      languages: ['Italian', 'English', 'French'],
      isActive: true,
    },
    {
      id: 'mock-4',
      name: 'Pierre Gourmet',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      description: 'Culinary travel specialist offering food tours, cooking classes, and wine experiences.',
      specialties: ['Food Tours', 'Wine Tasting', 'Culinary Travel'],
      tags: mockTags[3],
      link: 'https://calendly.com/pierre-gourmet',
      rating: 4.9,
      reviewCount: 203,
      location: 'Lyon, France',
      languages: ['French', 'English'],
      isActive: true,
    },
    {
      id: 'mock-5',
      name: 'Lisa Family',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      description: 'Family travel expert specializing in kid-friendly destinations and activities worldwide.',
      specialties: ['Family Travel', 'Kid-Friendly Activities', 'Safe Destinations'],
      tags: mockTags[4],
      link: 'https://calendly.com/lisa-family',
      rating: 4.8,
      reviewCount: 94,
      location: 'San Diego, USA',
      languages: ['English'],
      isActive: true,
    },
    {
      id: 'mock-6',
      name: 'Alexandre Luxury',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      description: 'Luxury travel consultant creating bespoke high-end experiences and wellness retreats.',
      specialties: ['Luxury Travel', 'Wellness Retreats', 'Bespoke Experiences'],
      tags: mockTags[5],
      link: 'https://calendly.com/alexandre-luxury',
      rating: 4.9,
      reviewCount: 67,
      location: 'Monaco',
      languages: ['French', 'English', 'Italian'],
      isActive: true,
    },
    {
      id: 'mock-7',
      name: 'Jake Backpack',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      description: 'Backpacking and budget travel expert helping young travelers explore the world affordably.',
      specialties: ['Backpacking', 'Budget Travel', 'Hostels'],
      tags: mockTags[6],
      link: 'https://calendly.com/jake-backpack',
      rating: 4.6,
      reviewCount: 178,
      location: 'Bangkok, Thailand',
      languages: ['English', 'Thai'],
      isActive: true,
    },
    {
      id: 'mock-8',
      name: 'Dr. Wildlife',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      description: 'Wildlife photography and safari expert with deep knowledge of African conservation efforts.',
      specialties: ['Wildlife Photography', 'Safari Tours', 'Conservation'],
      tags: mockTags[7],
      link: 'https://calendly.com/dr-wildlife',
      rating: 4.8,
      reviewCount: 112,
      location: 'Nairobi, Kenya',
      languages: ['English', 'Swahili'],
      isActive: true,
    },
  ];
}