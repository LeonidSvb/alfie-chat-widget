import { TripGuide } from '@/types/tripGuide';

export interface TestTripGuide extends TripGuide {
  expertIds: string[];
}

// Inspire Me Trip Guides (3 adventure ideas each, 3 experts total)
export const inspireMeTestGuides: TestTripGuide[] = [
  {
    id: 'test-inspire-mountains',
    title: 'Your Personalized Adventure Inspiration',
    flowType: 'inspire-me',
    questionnaireSummary: 'Adventure seeker looking for mountain experiences, solo travel, 10-14 days, summer season, with camping accommodation.',
    content: `Trip Type: Multi-Country Adventure
Trip Length: 10-14 days
Season: Summer
Group: Solo
Style: Adventure

🏞️ Adventure Idea 1: Alpine Peaks Challenge - Switzerland & Austria

Experience the ultimate mountain adventure across two Alpine countries. Start in Interlaken, Switzerland, where towering peaks surround pristine lakes. Tackle the famous Via Ferrata routes on the Mürren cliffs, offering breathtaking views of the Jungfrau massif. Your days will be filled with challenging climbs, scenic cable car rides, and cozy mountain huts.

Cross into Austria's Tirol region for glacier hiking on the Stubai Glacier. The contrast between Swiss precision and Austrian gemütlichkeit adds cultural depth to your mountain quest. End each day in traditional alpine lodges, sharing stories with fellow adventurers over hearty local cuisine.

🏞️ Adventure Idea 2: Dolomites Multi-Peak Circuit - Northern Italy

The Dolomites offer some of Europe's most dramatic limestone spires and challenging via ferrata routes. This UNESCO World Heritage region combines Italian passion with Austrian alpine tradition. Your circuit includes the famous Tre Cime di Lavaredo, where you'll tackle both technical climbing routes and scenic hiking trails.

Stay in rifugios (mountain huts) perched dramatically on cliff edges, waking up to sunrise illuminating pink limestone towers. The Alta Via 1 section provides daily challenges with spectacular rewards - each day reveals new geological wonders and panoramic vistas that will redefine your understanding of mountain beauty.

🏞️ Adventure Idea 3: Patagonia Wilderness Expedition - Chile & Argentina

For the ultimate solo adventure, Patagonia offers untamed wilderness where few have ventured. Your expedition centers on Torres del Paine National Park in Chile and Los Glaciares in Argentina. Multi-day treks through pristine landscapes where condors soar overhead and glacial lakes reflect granite spires.

Technical challenges include glacier crossings, river fords, and camping in extreme weather conditions. The reward? Absolute solitude in one of Earth's last wild frontiers. Your self-reliance will be tested and rewarded with experiences that connect you deeply with raw, untouched nature.`,
    expertIds: ['rec46ZI9ekmZp1ft7', 'recCBT3lbU6rShiYI', 'recALYUkEIAE0qWjU']
  },
  
  {
    id: 'test-inspire-cultural',
    title: 'Your Personalized Cultural Journey',
    flowType: 'inspire-me',
    questionnaireSummary: 'Cultural traveler interested in Asian destinations, couple travel, 7-10 days, spring season, boutique hotels.',
    content: `Trip Type: Cultural Immersion
Trip Length: 7-10 days
Season: Spring
Group: Couple
Style: Cultural

🏞️ Adventure Idea 1: Japan Cherry Blossom Cultural Deep Dive

Experience Japan during sakura season through the lens of ancient traditions and modern artistry. Begin in Kyoto's historic Gion district, where geishas still grace cobblestone streets. Participate in traditional tea ceremonies in centuries-old temples, learning the meditative art of chanoyu from master practitioners.

Your cultural journey includes private workshops with local artisans - try your hand at pottery in traditional kilns, learn calligraphy from accomplished masters, and discover the intricate art of kimono weaving. Cherry blossoms frame each experience, creating a magical backdrop for deep cultural immersion.

🏞️ Adventure Idea 2: Rajasthan Royal Heritage Trail - India

Step into the opulent world of Indian maharajas through Rajasthan's magnificent palace cities. Your journey through Jaipur, Udaipur, and Jodhpur reveals layers of history through architecture, cuisine, and living traditions. Stay in converted palaces where royal families still reside, dining with descendants of kings while learning about courtly life.

Engage with master craftsmen in their workshops - watch intricate miniature paintings come to life, learn traditional block printing techniques, and understand the complex art of jewelry making. Each city reveals different facets of Rajasthani culture, from desert fortresses to lakeside palaces.

🏞️ Adventure Idea 3: Moroccan Imperial Cities Discovery

Morocco's four imperial cities - Fez, Meknes, Rabat, and Marrakech - each tell unique stories of Islamic civilization. Your cultural adventure begins in Fez's ancient medina, where traditional crafts continue unchanged for centuries. Learn Arabic calligraphy, understand Islamic geometric patterns, and explore the intellectual heritage of ancient universities.

In Marrakech, the modern meets the traditional in vibrant souks and contemporary art galleries. Your journey includes cooking classes with Berber families, learning traditional carpet weaving, and understanding the complex social structures that maintain Morocco's rich cultural tapestry.`,
    expertIds: ['rec9n8kBuri9AEmFQ', 'recDBRfjTWNPhBjxc', 'recDGxA7pZx6tP7IS']
  },

  {
    id: 'test-inspire-beach',
    title: 'Your Personalized Tropical Paradise',
    flowType: 'inspire-me',
    questionnaireSummary: 'Beach enthusiast looking for tropical paradise, family travel, 7-10 days, winter season, resort accommodation.',
    content: `Trip Type: Tropical Relaxation
Trip Length: 7-10 days
Season: Winter
Group: Family
Style: Relaxation

🏞️ Adventure Idea 1: Maldives Private Island Sanctuary

Escape to your own slice of paradise on a private Maldivian atoll. Crystal-clear waters lap at your overwater villa's doorstep, where tropical fish swim beneath glass floor panels. Days blend seamlessly between snorkeling in house reefs, sunset fishing expeditions, and spa treatments with ocean views.

Your family villa includes dedicated kids' areas and shallow lagoons perfect for safe swimming. Evening brings traditional Maldivian entertainment and dining experiences featuring fresh seafood caught that morning. The resort's marine biologist leads educational tours, teaching children about coral reef ecosystems.

🏞️ Adventure Idea 2: Hawaiian Multi-Island Family Adventure

Explore Hawaii's diverse landscapes across multiple islands, each offering unique experiences for every family member. Begin on Oahu with iconic Waikiki Beach and Pearl Harbor's historical significance. Your inter-island journey includes Maui's scenic Road to Hana, Big Island's active volcanoes, and Kauai's dramatic Na Pali Coast.

Family-friendly activities include snorkeling at Hanauma Bay, helicopter tours over volcanic landscapes, and traditional luaus with authentic Polynesian entertainment. Each island offers different adventures - from swimming with sea turtles to exploring lava tubes and learning about Hawaiian culture through hands-on experiences.

🏞️ Adventure Idea 3: Costa Rica Beach & Wildlife Paradise

Combine tropical beaches with incredible wildlife encounters along Costa Rica's Pacific coast. Your base in Manuel Antonio offers pristine beaches where scarlet macaws fly overhead and sloths move slowly through beachfront trees. Family adventures include guided nature walks where children spot colorful frogs, butterflies, and tropical birds.

Adventure options include zip-lining through rainforest canopies, gentle white-water rafting suitable for families, and turtle nesting tours on protected beaches. Your eco-lodge promotes conservation education, teaching children about biodiversity while providing luxurious comfort for parents.`,
    expertIds: ['recqlgQ8LuAsj17K6', 'recPQr4G7oMfZY2kL', 'recUvXYZ123ABC456']
  }
];

// I Know Where Trip Guides (1 expert at the end)
export const iKnowWhereTestGuides: TestTripGuide[] = [
  {
    id: 'test-know-japan',
    title: 'Your Complete Japan Adventure Guide',
    flowType: 'i-know-where',
    questionnaireSummary: 'Japan cultural journey during cherry blossom season, couple travel, 10 days, traditional and modern experiences.',
    content: `Trip Type: Cultural Journey
Trip Length: 10 days
Season: Spring
Group: Couple
Style: Traditional & Modern

🌄 Why This Route Works

Japan during cherry blossom season offers an unparalleled blend of natural beauty and cultural depth. This carefully crafted route maximizes your sakura viewing opportunities while providing authentic cultural experiences that go beyond typical tourist attractions. The timing coincides with perfect weather and numerous festivals celebrating spring's arrival.

Your 10-day journey balances must-see destinations with hidden gems, allowing deep cultural immersion without the exhaustion of rushed sightseeing. Each location builds upon the previous, creating a narrative arc that tells Japan's story from ancient traditions to cutting-edge modernity.

✈️ Travel Snapshot

**When**: Early April for peak cherry blossoms
**Duration**: 10 days, 9 nights
**Base Cities**: Tokyo (4 nights) + Kyoto (3 nights) + Osaka (2 nights)
**Travel Style**: Mix of luxury ryokans and modern hotels
**Weather**: Mild springs days (15-20°C), perfect for walking
**Crowd Level**: High but manageable with early starts

🚗 Recommended Transportation

**JR Pass**: Essential for all inter-city travel (7-day pass covers your needs)
**Tokyo**: Metro day passes for efficient city exploration
**Kyoto**: Bicycle rentals for temple district navigation
**Airport**: Narita Express or Skyliner from Tokyo airports
**Local**: Walking emphasized - most attractions are pedestrian-friendly

🧳 What to Book Now

**Priority Bookings (Book Immediately)**:
- Luxury ryokan in Kyoto (Tawaraya or Gion Hatanaka)
- Kikunoi or Hyotei for kaiseki dining experience
- TeamLab Borderless tickets (often sell out weeks ahead)
- Ghibli Museum reservations

**One Month Before**:
- JR Pass (order physical pass delivery)
- Sumo tournament tickets if visiting during tournament season
- Cooking class reservations

🥾 Outdoor Activities to Prioritize

**Cherry Blossom Viewing**: Philosopher's Path (Kyoto), Ueno Park (Tokyo), Osaka Castle grounds
**Nature Immersion**: Bamboo Forest walks in Arashiyama, Mount Inari hiking trails
**Garden Meditation**: Ryoan-ji zen garden, Kinkaku-ji temple grounds
**Scenic Walks**: Traditional neighborhoods of Gion, historic Asakusa district

🏛️ Top Cultural Experiences

**Traditional Arts**: Tea ceremony with certified master, calligraphy workshop, pottery class in historic kiln
**Spiritual Journey**: Early morning meditation at Kiyomizu Temple, private shrine visit with priest explanation
**Culinary Deep Dive**: Tsukiji fish market tour with sushi breakfast, sake tasting in traditional brewery
**Local Life**: Stay overnight in traditional ryokan with multi-course kaiseki dining

🧠 Things You Maybe Haven't Thought Of

**Shoe Strategy**: Slip-on shoes essential for temple visits and ryokan stays
**Cash Preparation**: Japan remains largely cash-based; bring more than you think you'll need
**Seasonal Timing**: Cherry blossom predictions change weekly; build flexibility into your plans
**Cultural Etiquette**: Bow slightly when greeting, never stick chopsticks upright in rice
**Language Prep**: Download offline translation app; many signs aren't in English

🧭 The Approach: Flexible Itinerary Flow

**Days 1-4 Tokyo**: Modern Japan foundation - technology, cuisine, urban culture
**Days 5-7 Kyoto**: Traditional heart - temples, gardens, cultural practices
**Days 8-10 Osaka**: Culinary capital - street food, sake culture, final cultural synthesis

This structure allows you to understand Japan's evolution while providing rest days between intensive cultural learning. Each city reveals different facets of Japanese identity, creating a comprehensive understanding that single-destination trips cannot achieve.`,
    expertIds: ['recLCBhqZuAclpkQj']
  },

  {
    id: 'test-know-iceland',
    title: 'Your Complete Iceland Winter Adventure',
    flowType: 'i-know-where',
    questionnaireSummary: 'Iceland winter adventure with northern lights, couple travel, 10 days, ice caves and geothermal experiences.',
    content: `Trip Type: Winter Nature Adventure
Trip Length: 10 days
Season: Winter
Group: Couple
Style: Adventure & Comfort

🌄 Why This Route Works

Iceland's winter landscape transforms the country into an otherworldly realm of ice, fire, and northern lights. This route maximizes your chances of witnessing the aurora borealis while exploring ice caves, frozen waterfalls, and geothermal wonders that are uniquely accessible during winter months.

The Ring Road circuit ensures you experience Iceland's diverse geography - from black sand beaches covered in diamond ice to massive glaciers and volcanic landscapes. Winter's long nights create perfect conditions for northern lights viewing, while shorter daylight hours make every sunrise and sunset spectacular.

✈️ Travel Snapshot

**When**: February-March for best ice caves and aurora activity
**Duration**: 10 days, 9 nights
**Route**: Ring Road clockwise starting/ending in Reykjavik
**Accommodation**: Mix of countryside hotels and Reykjavik luxury
**Weather**: Cold (-5 to 5°C) but manageable with proper gear
**Daylight**: 6-8 hours, perfect for photography and aurora viewing

🚗 Recommended Transportation

**4WD Rental**: Essential for winter Ring Road travel - book early
**GPS Navigation**: Offline maps crucial for remote areas
**Winter Tires**: Studded tires included with winter rentals
**Fuel Strategy**: Fill up at every opportunity - stations are sparse
**Emergency Kit**: Provided with rental - shovel, blankets, emergency phone

🧳 What to Book Now

**Critical Reservations**:
- Ice cave tours (limited winter availability)
- Northern lights boat tours from Reykjavik
- Blue Lagoon premium packages
- Countryside accommodations (very limited options)

**One Month Before**:
- Glacier hiking tours
- Snowmobile excursions
- Fine dining reservations in Reykjavik

🥾 Outdoor Activities to Prioritize

**Ice Adventures**: Crystal ice cave exploration, glacier hiking with crampons
**Aurora Hunting**: Multiple northern lights tours to maximize viewing chances
**Geothermal Experiences**: Blue Lagoon, natural hot springs, geysir observation
**Winter Hiking**: Frozen waterfall approaches, volcanic crater walks
**Unique Experiences**: Snowmobiling on glaciers, ice climbing for adventurous couples

🏛️ Top Cultural Experiences

**Reykjavik Culture**: Contemporary art museums, traditional Icelandic cuisine
**Historical Sites**: Viking settlement museums, ancient parliament grounds at Thingvellir
**Local Traditions**: Traditional wool workshops, storytelling sessions about Icelandic sagas
**Modern Iceland**: Renewable energy tours, innovative architecture exploration

🧠 Things You Maybe Haven't Thought Of

**Aurora Preparation**: Download aurora forecasting apps; cloudy nights make viewing impossible
**Clothing Strategy**: Layering system more important than single heavy coats
**Food Planning**: Stock up in Reykjavik; remote areas have very limited dining options
**Photography Gear**: Extra batteries (cold drains them fast), tripod for aurora shots
**Weather Flexibility**: Build buffer days; storms can close roads and cancel tours

🧭 The Approach: Flexible Itinerary Flow

**Days 1-2 Reykjavik**: Urban acclimatization, gear acquisition, cultural foundation
**Days 3-8 Ring Road Circuit**: Clockwise journey hitting major natural attractions
**Days 9-10 Reykjavik**: Rest, final tours, aurora backup opportunities

This approach front-loads your Ring Road adventure when you're most energetic, while maintaining Reykjavik as a comfortable base for weather-dependent activities. The circular route ensures backup opportunities for must-see experiences if weather disrupts initial plans.`,
    expertIds: ['recXSNj8DWRdwHAtH']
  },

  {
    id: 'test-know-patagonia',
    title: 'Your Complete Patagonia Trekking Guide', 
    flowType: 'i-know-where',
    questionnaireSummary: 'Patagonia multi-day trekking expedition, small group travel, 14 days, summer season, adventure camping.',
    content: `Trip Type: Multi-Day Trekking
Trip Length: 14 days
Season: Summer
Group: Small Group
Style: Adventure Expedition

🌄 Why This Route Works

Patagonia's summer season (December-March) offers the only reliable trekking weather in this notoriously challenging region. This route combines Torres del Paine's iconic granite spires with Argentina's Fitz Roy massif, providing the complete Patagonian experience while maximizing your chances of clear weather for the classic money shots.

The bi-national approach allows you to experience both Chilean and Argentine Patagonia's distinct characters - Chile's organized infrastructure versus Argentina's rugged frontier spirit. Your 14-day timeline permits proper acclimatization and includes weather buffer days essential for this unpredictable region.

✈️ Travel Snapshot

**When**: December-February for best weather and longest days
**Duration**: 14 days, 13 nights
**Base Towns**: El Calafate (Argentina) + Puerto Natales (Chile)
**Activity Level**: Strenuous multi-day treks with full backpacks
**Weather**: Highly variable (5-20°C), wind constant companion
**Daylight**: 16+ hours in peak summer - maximize your hiking time

🚗 Recommended Transportation

**International Flights**: Fly into Calafate, depart from Punta Arenas
**Ground Transport**: Pre-arranged shuttles for border crossings and park access
**Local Buses**: Regular service between El Calafate and Puerto Natales
**Park Shuttles**: Las Torres and El Chalten have reliable park transport
**Emergency**: Helicopter evacuation insurance strongly recommended

🧳 What to Book Now

**Essential Reservations**:
- Torres del Paine camping permits (book 6+ months ahead)
- Refugio beds along trekking routes
- El Calafate accommodation during peak season
- International flights (limited routes, high demand)

**One Month Before**:
- Glacier boat tours
- Local mountain guides for technical sections
- Equipment rentals if not bringing own gear

🥾 Outdoor Activities to Prioritize

**Classic Treks**: Torres del Paine W Circuit (4-5 days), Fitz Roy approach (3-4 days)
**Glacier Experiences**: Perito Moreno up-close, ice trekking with crampons
**Technical Challenges**: Laguna de los Tres sunrise hike, Base Torres approach
**Wildlife Encounters**: Condor spotting, guanaco herds, possible puma sightings
**Photography Goals**: Classic granite spire shots, glacier calving, dramatic weather

🏛️ Top Cultural Experiences

**Gaucho Culture**: Traditional estancia visits, horseback riding with local guides
**Regional History**: Early explorer stories, indigenous Tehuelche culture
**Local Cuisine**: Patagonian lamb asado, regional wines, artisanal foods
**Small Town Life**: El Chalten's climbing culture, Puerto Natales' frontier spirit

🧠 Things You Maybe Haven't Thought Of

**Wind Factor**: Patagonian winds are legendary; stakes and guy-lines are crucial
**Gear Testing**: Test all equipment before departure; gear failure can be dangerous
**Food Strategy**: Bring high-calorie options; park food is expensive and limited
**Weather Apps**: Multiple forecasting sources; weather changes rapidly
**Fitness Preparation**: Train with full pack; Patagonian terrain is unforgiving

🧭 The Approach: Flexible Itinerary Flow

**Days 1-3 El Calafate**: Acclimatization, gear check, Perito Moreno glacier
**Days 4-8 Fitz Roy Circuit**: Argentine side trekking based from El Chalten
**Days 9-13 Torres del Paine**: Chilean side W Circuit with mountain refugios
**Day 14 Puerto Natales**: Rest, travel preparation, gear drying

This progression builds your fitness and confidence on the Argentine side before tackling Chile's more challenging Torres del Paine. The schedule includes strategic rest days and allows for weather-related delays without missing international flights.`,
    expertIds: ['recpOZjZJfZubsbkd']
  }
];

export const allTestTripGuides = [...inspireMeTestGuides, ...iKnowWhereTestGuides];