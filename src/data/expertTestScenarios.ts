import { QuestionnaireData } from '@/types/questionnaire';

export interface ExpertTestScenario {
  id: string;
  name: string;
  description: string;
  data: QuestionnaireData;
}

export const inspireMeScenarios: ExpertTestScenario[] = [
  {
    id: 'inspire-adventure-mountains',
    name: 'Mountain Adventure Seeker',
    description: 'Adventure seeker looking for mountain experiences worldwide',
    data: {
      flowType: 'inspire-me',
      answers: {
        travelStyle: 'adventure',
        budget: '$3000-5000',
        duration: '10-14 days',
        season: 'summer',
        activities: ['hiking', 'rock climbing', 'mountaineering'],
        groupType: 'solo',
        accommodation: 'camping',
        experience: 'experienced'
      }
    }
  },
  {
    id: 'inspire-cultural-asia',
    name: 'Cultural Explorer - Asia',
    description: 'Cultural traveler interested in Asian destinations',
    data: {
      flowType: 'inspire-me',
      answers: {
        travelStyle: 'cultural',
        budget: '$2000-3000',
        duration: '7-10 days', 
        season: 'spring',
        activities: ['temple visits', 'local cuisine', 'traditional crafts'],
        groupType: 'couple',
        accommodation: 'boutique hotels',
        regions: ['asia']
      }
    }
  },
  {
    id: 'inspire-beach-tropical',
    name: 'Tropical Beach Lover',
    description: 'Beach enthusiast looking for tropical paradise',
    data: {
      flowType: 'inspire-me',
      answers: {
        travelStyle: 'relaxation',
        budget: '$4000-6000',
        duration: '7-10 days',
        season: 'winter',
        activities: ['snorkeling', 'beach relaxation', 'water sports'],
        groupType: 'family',
        accommodation: 'resort',
        climate: 'tropical'
      }
    }
  },
  {
    id: 'inspire-wildlife-africa',
    name: 'Wildlife Safari Enthusiast',
    description: 'Nature lover seeking African wildlife experiences',
    data: {
      flowType: 'inspire-me',
      answers: {
        travelStyle: 'nature',
        budget: '$5000-8000',
        duration: '14+ days',
        season: 'dry season',
        activities: ['safari', 'wildlife photography', 'conservation tours'],
        groupType: 'small group',
        accommodation: 'safari lodge',
        regions: ['africa']
      }
    }
  },
  {
    id: 'inspire-luxury-europe',
    name: 'European Luxury Traveler',
    description: 'Luxury traveler exploring European culture and cuisine',
    data: {
      flowType: 'inspire-me',
      answers: {
        travelStyle: 'luxury',
        budget: '$8000+',
        duration: '10-14 days',
        season: 'fall',
        activities: ['fine dining', 'art galleries', 'wine tasting'],
        groupType: 'couple',
        accommodation: '5-star hotels',
        regions: ['europe']
      }
    }
  },
  {
    id: 'inspire-backpacker-south-america',
    name: 'South American Backpacker',
    description: 'Budget backpacker exploring South America',
    data: {
      flowType: 'inspire-me',
      answers: {
        travelStyle: 'backpacking',
        budget: '$1000-2000',
        duration: '14+ days',
        season: 'any',
        activities: ['hiking', 'local culture', 'budget travel'],
        groupType: 'solo',
        accommodation: 'hostels',
        regions: ['south america']
      }
    }
  },
  {
    id: 'inspire-photography-landscapes',
    name: 'Landscape Photography Tour',
    description: 'Photographer seeking stunning landscape destinations',
    data: {
      flowType: 'inspire-me',
      answers: {
        travelStyle: 'photography',
        budget: '$3000-5000',
        duration: '10-14 days',
        season: 'golden hour seasons',
        activities: ['landscape photography', 'sunrise/sunset shoots', 'remote locations'],
        groupType: 'solo',
        accommodation: 'convenient for early morning shoots',
        interests: ['photography', 'nature']
      }
    }
  },
  {
    id: 'inspire-wellness-retreat',
    name: 'Wellness Retreat Seeker',
    description: 'Health-focused traveler seeking wellness experiences',
    data: {
      flowType: 'inspire-me',
      answers: {
        travelStyle: 'wellness',
        budget: '$3000-5000',
        duration: '7-10 days',
        season: 'any',
        activities: ['yoga', 'meditation', 'spa treatments'],
        groupType: 'solo',
        accommodation: 'wellness resort',
        interests: ['health', 'mindfulness']
      }
    }
  },
  {
    id: 'inspire-food-tour',
    name: 'Culinary Adventure Tourist',
    description: 'Food lover seeking authentic culinary experiences',
    data: {
      flowType: 'inspire-me',
      answers: {
        travelStyle: 'culinary',
        budget: '$4000-6000',
        duration: '7-10 days',
        season: 'harvest season',
        activities: ['food tours', 'cooking classes', 'local markets'],
        groupType: 'couple',
        accommodation: 'food-focused locations',
        interests: ['cuisine', 'local culture']
      }
    }
  },
  {
    id: 'inspire-winter-sports',
    name: 'Winter Sports Enthusiast',
    description: 'Snow sports lover looking for winter destinations',
    data: {
      flowType: 'inspire-me',
      answers: {
        travelStyle: 'active',
        budget: '$4000-6000',
        duration: '7-10 days',
        season: 'winter',
        activities: ['skiing', 'snowboarding', 'winter hiking'],
        groupType: 'friends',
        accommodation: 'ski resort',
        climate: 'snow'
      }
    }
  }
];

export const iKnowWhereScenarios: ExpertTestScenario[] = [
  {
    id: 'japan-cultural-spring',
    name: 'Japan Cultural Journey - Cherry Blossom',
    description: 'Traditional Japanese experience during sakura season',
    data: {
      flowType: 'i-know-where',
      answers: {
        destination: 'Japan',
        city: 'Tokyo and Kyoto',
        duration: '10 days',
        budget: '$4000-6000',
        season: 'spring',
        interests: ['temples', 'traditional culture', 'cherry blossoms'],
        groupType: 'couple',
        accommodation: 'traditional ryokan and modern hotels'
      }
    }
  },
  {
    id: 'patagonia-trekking',
    name: 'Patagonia Trekking Expedition',
    description: 'Multi-day trekking in Torres del Paine and Fitz Roy',
    data: {
      flowType: 'i-know-where',
      answers: {
        destination: 'Patagonia',
        region: 'Argentina and Chile',
        duration: '14 days',
        budget: '$3000-5000',
        season: 'summer',
        activities: ['trekking', 'camping', 'glacier viewing'],
        groupType: 'small group',
        experience: 'experienced hiker'
      }
    }
  },
  {
    id: 'iceland-ring-road',
    name: 'Iceland Ring Road Adventure',
    description: 'Complete Ring Road circuit with northern lights',
    data: {
      flowType: 'i-know-where',
      answers: {
        destination: 'Iceland',
        duration: '10 days',
        budget: '$5000-7000',
        season: 'winter',
        activities: ['northern lights', 'ice caves', 'hot springs'],
        groupType: 'couple',
        transportation: 'rental car',
        accommodation: 'guesthouses and hotels'
      }
    }
  },
  {
    id: 'nepal-everest-base-camp',
    name: 'Nepal Everest Base Camp Trek',
    description: 'Classic EBC trek through Sherpa villages',
    data: {
      flowType: 'i-know-where',
      answers: {
        destination: 'Nepal',
        region: 'Everest region',
        duration: '16 days',
        budget: '$2000-3000',
        season: 'pre-monsoon',
        activities: ['trekking', 'mountain views', 'cultural immersion'],
        groupType: 'solo',
        experience: 'high altitude experience required'
      }
    }
  },
  {
    id: 'new-zealand-south-island',
    name: 'New Zealand South Island Circuit',
    description: 'Adventure sports and natural beauty tour',
    data: {
      flowType: 'i-know-where',
      answers: {
        destination: 'New Zealand',
        region: 'South Island',
        duration: '12 days',
        budget: '$4000-6000',
        season: 'summer',
        activities: ['bungee jumping', 'hiking', 'scenic drives'],
        groupType: 'friends',
        transportation: 'rental car'
      }
    }
  },
  {
    id: 'morocco-sahara-cities',
    name: 'Morocco Imperial Cities & Sahara',
    description: 'Cultural tour through Morocco with desert experience',
    data: {
      flowType: 'i-know-where',
      answers: {
        destination: 'Morocco',
        cities: 'Marrakech, Fez, Sahara Desert',
        duration: '9 days',
        budget: '$2500-4000',
        season: 'winter',
        activities: ['medina exploration', 'camel trekking', 'desert camping'],
        groupType: 'couple',
        accommodation: 'riads and desert camp'
      }
    }
  },
  {
    id: 'costa-rica-biodiversity',
    name: 'Costa Rica Biodiversity Explorer',
    description: 'Wildlife and nature focused Costa Rica journey',
    data: {
      flowType: 'i-know-where',
      answers: {
        destination: 'Costa Rica',
        duration: '8 days',
        budget: '$3000-4500',
        season: 'dry season',
        activities: ['wildlife watching', 'zip lining', 'volcano tours'],
        groupType: 'family',
        accommodation: 'eco-lodges'
      }
    }
  },
  {
    id: 'norway-fjords-summer',
    name: 'Norway Fjords Summer Journey',
    description: 'Scenic fjords exploration with midnight sun',
    data: {
      flowType: 'i-know-where',
      answers: {
        destination: 'Norway',
        region: 'Western fjords',
        duration: '10 days',
        budget: '$5000-8000',
        season: 'summer',
        activities: ['fjord cruises', 'hiking', 'midnight sun'],
        groupType: 'couple',
        accommodation: 'hotels with fjord views'
      }
    }
  },
  {
    id: 'vietnam-north-to-south',
    name: 'Vietnam North to South Journey',
    description: 'Comprehensive Vietnam experience from Hanoi to Ho Chi Minh',
    data: {
      flowType: 'i-know-where',
      answers: {
        destination: 'Vietnam',
        route: 'Hanoi to Ho Chi Minh City',
        duration: '12 days',
        budget: '$2000-3500',
        season: 'dry season',
        activities: ['street food tours', 'Ha Long Bay', 'Mekong Delta'],
        groupType: 'solo',
        accommodation: 'mix of hotels and homestays'
      }
    }
  },
  {
    id: 'peru-inca-trail-machu-picchu',
    name: 'Peru Inca Trail to Machu Picchu',
    description: 'Classic Inca Trail trek ending at Machu Picchu',
    data: {
      flowType: 'i-know-where',
      answers: {
        destination: 'Peru',
        region: 'Sacred Valley and Machu Picchu',
        duration: '7 days',
        budget: '$2500-4000',
        season: 'dry season',
        activities: ['Inca Trail trekking', 'Machu Picchu', 'Cusco exploration'],
        groupType: 'small group',
        experience: 'moderate hiking experience'
      }
    }
  }
];

export const allExpertTestScenarios = [...inspireMeScenarios, ...iKnowWhereScenarios];