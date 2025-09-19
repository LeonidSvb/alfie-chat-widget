export type FlowType = 'inspire-me' | 'i-know-where';

export type QuestionType = 'single-choice' | 'multiple-choice' | 'text' | 'range' | 'multi-with-other';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  required: boolean;
  placeholder?: string;
  hasOtherOption?: boolean; // for multi-select with "Other..." text input
  conditionalLogic?: {
    showIf: string; // question ID
    values: string[]; // show this question if previous question has these values
  };
  min?: number;
  max?: number;
}

export interface QuestionnaireData {
  flowType: FlowType;
  answers: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
}

// Question definitions for Inspire Me flow (16 questions)
export const INSPIRE_ME_QUESTIONS: Question[] = [
  {
    id: 'home_base',
    type: 'text',
    text: 'Where are you starting from? Helps me know what\'s realistic.',
    placeholder: 'Based in Chicago',
    required: true,
  },
  {
    id: 'travel_radius',
    type: 'single-choice',
    text: 'How far are you open to going?',
    options: [
      'Within driving distance',
      'Short flight (2–4 hrs)', 
      'Medium flight (5–8 hrs)',
      'Long haul — anywhere goes'
    ],
    required: true,
  },
  {
    id: 'regions_interest',
    type: 'multi-with-other',
    text: 'Which parts of the world sound most interesting right now?',
    options: [
      'USA',
      'Canada', 
      'Europe',
      'Latin America (incl. Mexico / Central America)',
      'South America',
      'Asia',
      'Africa',
      'Middle East',
      'Open to anywhere'
    ],
    hasOtherOption: true,
    required: true,
  },
  {
    id: 'specific_regions',
    type: 'text',
    text: 'Any specific countries, cities, or areas you\'re leaning toward?',
    placeholder: 'Portugal, Kyoto, Kenya...',
    required: true,
  },
  {
    id: 'terrain_prefs',
    type: 'multi-with-other',
    text: 'What kinds of terrain sound most appealing?',
    options: [
      'Mountains',
      'Forest',
      'Ocean / Coastline',
      'Lake',
      'Beach',
      'Desert',
      'Winter / Snow'
    ],
    hasOtherOption: true,
    required: true,
  },
  {
    id: 'setting_pref',
    type: 'single-choice',
    text: 'What kind of setting are you most drawn to?',
    options: [
      'Big city',
      'Small town / village',
      'Rural countryside',
      'Off the grid / remote',
      '❓ Open to a mix'
    ],
    required: true,
  },
  {
    id: 'trip_structure',
    type: 'single-choice',
    text: 'Do you see this trip as…',
    options: [
      'Single destination (one home base, can include day trips)',
      'Multi-destination (changing locations/lodging)',
      'Roadtrip (on the move every day or two)',
      'Not sure yet — open to ideas'
    ],
    required: true,
  },
  {
    id: 'budget_style',
    type: 'single-choice',
    text: 'What\'s your style?',
    options: [
      '💎 Luxe',
      '✨ Comfortable / Mid-range',
      '🛶 Budget / Simple',
      '❓ Not sure yet'
    ],
    required: true,
  },
  {
    id: 'season_window',
    type: 'single-choice',
    text: 'When are you hoping to travel?',
    options: [
      'Winter (Dec–Feb)',
      'Spring (Mar–May)',
      'Summer (Jun–Aug)',
      'Fall (Sep–Nov)',
      'Not sure yet'
    ],
    required: true,
  },
  {
    id: 'trip_length_days',
    type: 'single-choice',
    text: 'How much time do you have?',
    options: [
      'Short trip: 2–4 days',
      '1 week',
      '2 weeks+',
      '3 weeks+'
    ],
    required: true,
  },
  {
    id: 'lodging_style',
    type: 'multi-with-other',
    text: 'What kind of stay are you leaning toward?',
    options: [
      'Camping / Rustic',
      'Chain hotel or resort',
      'Boutique / Guesthouse',
      'Airbnb / Apartment rental',
      'B&B / Farm stay',
      'RV / Campervan',
      'Not sure yet'
    ],
    hasOtherOption: true,
    required: true,
  },
  {
    id: 'transport_pref',
    type: 'single-choice',
    text: 'How do you picture getting around?',
    options: [
      '🚆 Trains',
      '🚗 Rental car / self-drive',
      '🚌 Public transit',
      '🚐 Private transfers / guided transport',
      'A mix'
    ],
    required: true,
  },
  {
    id: 'party_type',
    type: 'single-choice',
    text: 'Who\'s going?',
    options: [
      'Friends',
      'Couple',
      'Solo',
      'Family with young kids (under 12)',
      'Family with kids 12–18',
      'Multi-gen family',
      'Work trip / Colleagues'
    ],
    required: true,
  },
  {
    id: 'fitness_level',
    type: 'single-choice',
    text: 'How intense are you willing to go on outdoor activities?',
    options: [
      'Low-key (short walks, light activity)',
      'Moderate (day hikes, biking, city walking)',
      'High (long hikes, skiing, multi-day treks)'
    ],
    required: true,
  },
  {
    id: 'balance_ratio',
    type: 'single-choice',
    text: 'Set the mix — nature vs culture.',
    options: [
      '70% Outdoors / 30% Culture',
      '50% Outdoors / 50% Culture',
      '30% Outdoors / 70% Culture'
    ],
    required: true,
  },
  {
    id: 'outdoor_activities',
    type: 'multi-with-other',
    text: 'Which outdoor activities are most important to you?',
    options: [
      'Hiking',
      'Biking',
      'Beaches & swimming',
      'Surfing',
      'Water activities (kayak, paddle, snorkel)',
      'Skiing / Snowboarding',
      'Scenic drives',
      'Wildlife viewing',
      'Family-friendly outdoor activities'
    ],
    hasOtherOption: true,
    required: true,
  },
  {
    id: 'non_outdoor_interests',
    type: 'multi-with-other',
    text: 'What about cultural or non-outdoorsy interests?',
    options: [
      'Historic & archaeological sites',
      'Art & museums',
      'Live music / Nightlife',
      'Markets',
      'Spa / Wellness',
      'Food experiences (cooking classes, food tours, wine/beer tastings)'
    ],
    hasOtherOption: true,
    required: true,
  },
  {
    id: 'guided_experiences',
    type: 'multiple-choice',
    text: 'Are you interested in guided experiences, or would you rather explore fully on your own?',
    options: [
      'Guided outdoor activities (hikes, climbs, paddles)',
      'Guided day trips',
      'Guided city/cultural tours',
      'Food/wine tours, cooking classes',
      'No thanks — fully independent'
    ],
    required: true,
  },
  {
    id: 'food_prefs',
    type: 'multiple-choice',
    text: 'What kind of food experiences are you into?',
    options: [
      'Adventurous eats',
      'Super local / traditional spots',
      'Fine dining',
      'Cooking classes',
      'Food tours',
      'Markets'
    ],
    required: true,
  }
];

// I Know Where questions (complex branching structure)
export const I_KNOW_WHERE_QUESTIONS: Question[] = [
  // Branch question first
  {
    id: 'trip_structure',
    type: 'single-choice',
    text: 'What kind of trip is this?',
    options: [
      '🏠 Single destination (one home base, can include day trips)',
      '🧳 Multi‑destination (changing locations/lodging)',
      '🚙 Roadtrip'
    ],
    required: true,
  },
  // Single destination branch (12A-16A)
  {
    id: 'destination_main',
    type: 'text',
    text: 'Where will your home base be?',
    placeholder: 'Kyoto',
    required: true,
    conditionalLogic: {
      showIf: 'trip_structure',
      values: ['🏠 Single destination (one home base, can include day trips)']
    },
  },
  {
    id: 'transport_mode',
    type: 'single-choice',
    text: 'How will you get around?',
    options: [
      'Walking / Public transit',
      'Rental car / Self‑drive',
      'Tours & transfers',
      'Mix',
      'Not sure — open to whatever\'s best'
    ],
    required: true,
    conditionalLogic: {
      showIf: 'trip_structure',
      values: ['🏠 Single destination (one home base, can include day trips)']
    },
  },
  {
    id: 'day_trips_interest',
    type: 'single-choice',
    text: 'Want me to suggest day trips out from your base?',
    options: [
      'Yes',
      'No, I want to stay in my home base'
    ],
    required: true,
    conditionalLogic: {
      showIf: 'trip_structure',
      values: ['🏠 Single destination (one home base, can include day trips)']
    },
  },
  {
    id: 'anchors_single',
    type: 'text',
    text: 'Got anything set in stone — flights, tours, hotels?',
    placeholder: 'Dinner reso night 2; food tour day 3',
    required: true,
    conditionalLogic: {
      showIf: 'trip_structure',
      values: ['🏠 Single destination (one home base, can include day trips)']
    },
  },
  // Multi-destination branch (12B-16B)
  {
    id: 'stops',
    type: 'text',
    text: 'List your stops or places you\'re interested in.',
    placeholder: 'Florence, Siena, Rome...',
    required: true,
    conditionalLogic: {
      showIf: 'trip_structure',
      values: ['🧳 Multi‑destination (changing locations/lodging)']
    },
  },
  {
    id: 'intercity_transport',
    type: 'single-choice',
    text: 'What\'s your preferred mode of transport?',
    options: [
      'Train / Public transport',
      'Rental car / Self‑drive',
      'Mix',
      'Not sure yet'
    ],
    required: true,
    conditionalLogic: {
      showIf: 'trip_structure',
      values: ['🧳 Multi‑destination (changing locations/lodging)']
    },
  },
  {
    id: 'stops_order_flex',
    type: 'single-choice',
    text: 'Is that order locked, or can I shuffle to save time or flow better?',
    options: [
      'Fixed',
      'Flexible'
    ],
    required: true,
    conditionalLogic: {
      showIf: 'trip_structure',
      values: ['🧳 Multi‑destination (changing locations/lodging)']
    },
  },
  // Roadtrip branch (12C-16C)
  {
    id: 'roadtrip_region',
    type: 'text',
    text: 'Paint me the broad strokes — what region are we driving?',
    placeholder: 'Southwest loop: Vegas to the parks',
    required: true,
    conditionalLogic: {
      showIf: 'trip_structure',
      values: ['🚙 Roadtrip']
    },
  },
  {
    id: 'roadtrip_start_end',
    type: 'text',
    text: 'Same start and end, or one‑way?',
    placeholder: 'Start Vegas, end Phoenix',
    required: true,
    conditionalLogic: {
      showIf: 'trip_structure',
      values: ['🚙 Roadtrip']
    },
  },
  {
    id: 'max_drive_hours',
    type: 'text',
    text: 'What\'s your comfortable max drive time in a single day?',
    placeholder: '4 hours/day',
    required: true,
    conditionalLogic: {
      showIf: 'trip_structure',
      values: ['🚙 Roadtrip']
    },
  },
  {
    id: 'roadtrip_musts',
    type: 'text',
    text: 'Any towns, parks, or sights you want locked in along the way?',
    placeholder: 'Horseshoe Bend, Monument Valley',
    required: true,
    conditionalLogic: {
      showIf: 'trip_structure',
      values: ['🚙 Roadtrip']
    },
  },
  {
    id: 'overnight_rhythm',
    type: 'single-choice',
    text: 'How do you like to split nights?',
    options: [
      '2–3 nights minimum in each stop',
      'Okay with 1‑night stays where it makes sense'
    ],
    required: true,
    conditionalLogic: {
      showIf: 'trip_structure',
      values: ['🚙 Roadtrip']
    },
  },
  // Shared core questions (Q1-Q9) - shown for ALL paths
  {
    id: 'season_window_shared',
    type: 'text',
    text: 'Got dates, or even just a season?',
    placeholder: 'Late May 2025',
    required: true,
  },
  {
    id: 'trip_length_days_shared',
    type: 'text',
    text: 'So I know how to pace things — how many days do you have start to finish?',
    placeholder: '7 days',
    required: true,
  },
  {
    id: 'lodging_booked',
    type: 'single-choice',
    text: 'Have you already booked your accommodation?',
    options: [
      'Yes',
      'No, I need recommendations'
    ],
    required: true,
  },
  {
    id: 'lodging_type',
    type: 'single-choice',
    text: 'What type of stay are you leaning toward?',
    options: [
      'Camping',
      'Chain hotel / Resort',
      'Boutique hotel / Guesthouse',
      'Airbnb / Apartment rental',
      'B&B / Farm stay',
      'RV / Campervan'
    ],
    required: true,
    conditionalLogic: {
      showIf: 'lodging_booked',
      values: ['No, I need recommendations']
    },
  },
  {
    id: 'lodging_budget',
    type: 'text',
    text: 'What\'s your ballpark budget per night?',
    placeholder: '$150–200/night',
    required: true,
    conditionalLogic: {
      showIf: 'lodging_booked',
      values: ['No, I need recommendations']
    },
  },
  {
    id: 'party_type_shared',
    type: 'single-choice',
    text: 'Who is going?',
    options: [
      'Friends',
      'Couple',
      'Solo',
      'Family with young kids (under 12)',
      'Family with kids 12–18',
      'Multi‑gen family',
      'Work trip / Colleagues'
    ],
    required: true,
  },
  {
    id: 'fitness_level_shared',
    type: 'single-choice',
    text: 'How intense do you want your outdoor activity recommendations to be?',
    options: [
      'Low‑key (short walks, light activity)',
      'Moderate (day hikes, biking, city walking)',
      'High (long hikes, big days, steeps)'
    ],
    required: true,
  },
  {
    id: 'balance_ratio_shared',
    type: 'single-choice',
    text: 'Let\'s set the mix. Outdoors vs culture — what feels right? (By culture I mean museums, local tours, city wandering, historic or archeological sites.)',
    options: [
      '70% Outdoors / 30% Culture',
      '50% Outdoors / 50% Culture',
      '30% Outdoors / 70% Culture'
    ],
    required: true,
  },
  {
    id: 'travel_style',
    type: 'single-choice',
    text: 'Would you say your vibe is more…',
    options: [
      'Luxe & Leisure',
      'Balanced Mix',
      'Active Explorer'
    ],
    required: true,
  },
  {
    id: 'activities',
    type: 'multi-with-other',
    text: 'What kinds of things light you up on trips? Pick all that fit.',
    options: [
      '🥾 Hiking',
      '🚴 Biking',
      '🚶 Walking tours',
      '🏊 Beaches & swimming',
      '🌊 Water activities (kayak, paddle, snorkel)',
      '🎿 Skiing / Snowboarding',
      '🛣️ Scenic drives',
      '🎨 Art & museums',
      '🏛️ Historic & archeological sites',
      '🍷 Wine / Breweries',
      '🎶 Live music / Nightlife',
      '🐾 Wildlife viewing',
      '👨‍👩‍👧 Family‑friendly activities',
      '💆 Spa / Wellness'
    ],
    hasOtherOption: true,
    required: true,
  },
  {
    id: 'food_prefs_shared',
    type: 'multiple-choice',
    text: 'Food\'s half the fun. What sounds good?',
    options: [
      'Adventurous eats',
      'Super local / traditional spots',
      'Fine dining',
      'Cooking classes',
      'Food tours',
      'Markets'
    ],
    required: true,
  },
  {
    id: 'guided_prefs',
    type: 'multiple-choice',
    text: 'Do you like having a guide for certain activities — or are you all about going fully independent?',
    options: [
      'Guided outdoor activities',
      'Guided day trips',
      'Guided city tours',
      'Food tours',
      'Wine tours',
      'Cooking classes',
      '❌ Prefer to be fully independent'
    ],
    required: true,
  }
];