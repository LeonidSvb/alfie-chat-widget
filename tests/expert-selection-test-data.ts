// Тестовые данные для проверки системы выбора экспертов
import { TripGuide } from '@/types/tripGuide';

export const testTripGuides: TripGuide[] = [
  // === I KNOW WHERE TO GO TESTS (5) ===
  
  // Тест 1: Конкретное место - Непал треккинг
  {
    id: 'test-1-nepal',
    flowType: 'i-know-where',
    title: 'Nepal Himalayan Trek Guide',
    content: `🗺️ Your Personal Trip Guide
Trip Type: Mountain Trekking
Trip Length: 14 Days
Season: October (peak season)
Group: Solo traveler, experienced hiker
Style: Adventure trekking + cultural immersion

🌄 Why This Route Works
This classic Everest Base Camp trek balances challenging high-altitude hiking with cultural immersion in Sherpa villages. Perfect timing for clear mountain views and stable weather.

🥾 Outdoor Activities to Prioritize
• Everest Base Camp Trek (12 days)
• Namche Bazaar acclimatization hikes
• Tengboche Monastery sunrise views
• Kala Patthar summit for Everest views

🏛️ Top Cultural Experiences
• Stay in traditional teahouses
• Visit Buddhist monasteries in Tengboche
• Experience Sherpa culture in mountain villages
• Local dal bhat meals with trekking groups`,
    generatedAt: new Date(),
    questionnaireSummary: { destination: 'Nepal', activity: 'trekking' },
    tags: ['nepal', 'trekking', 'himalayas', 'everest']
  },

  // Тест 2: Водные активности - Индонезия дайвинг
  {
    id: 'test-2-indonesia',
    flowType: 'i-know-where', 
    title: 'Indonesia Diving Adventure',
    content: `🗺️ Your Personal Trip Guide
Trip Type: Diving Expedition
Trip Length: 10 Days
Season: August (dry season)
Group: Couple, advanced divers
Style: Island hopping + underwater exploration

🌄 Why This Route Works
Raja Ampat offers world's best marine biodiversity. Perfect for experienced divers seeking pristine coral reefs and rare species encounters.

🥾 Outdoor Activities to Prioritize
• Manta ray diving at Arborek
• Coral reef exploration in Dampier Strait
• Cape Kri biodiversity diving
• Pianemo karst lagoons snorkeling

🏛️ Top Cultural Experiences
• Traditional Papuan village visits
• Local fishing boat excursions
• Sago palm processing demonstrations
• Bird of paradise watching in rainforest`,
    generatedAt: new Date(),
    questionnaireSummary: { destination: 'Indonesia', activity: 'diving' },
    tags: ['indonesia', 'diving', 'raja-ampat', 'marine']
  },

  // Тест 3: Европейский город - Берлин культурный
  {
    id: 'test-3-berlin',
    flowType: 'i-know-where',
    title: 'Berlin Cultural Deep Dive',
    content: `🗺️ Your Personal Trip Guide
Trip Type: Urban Cultural Exploration
Trip Length: 5 Days
Season: September (perfect weather)
Group: Solo female traveler, history enthusiast
Style: Museums + neighborhoods + local food scene

🌄 Why This Route Works
Berlin's layered history comes alive through walking tours, world-class museums, and vibrant neighborhoods. Perfect for solo exploration with excellent public transport.

🥾 Outdoor Activities to Prioritize
• Tiergarten park cycling
• Spree River walking paths
• Tempelhof Field urban exploration
• East Side Gallery street art walk

🏛️ Top Cultural Experiences
• Museum Island full day exploration
• Berlin Wall and Checkpoint Charlie
• Brandenburg Gate and Holocaust Memorial
• Kreuzberg food market tours
• Underground bunker historical tours`,
    generatedAt: new Date(),
    questionnaireSummary: { destination: 'Berlin', activity: 'culture' },
    tags: ['berlin', 'germany', 'culture', 'history', 'museums']
  },

  // Тест 4: Американские национальные парки
  {
    id: 'test-4-utah-parks',
    flowType: 'i-know-where',
    title: 'Utah National Parks Circuit',
    content: `🗺️ Your Personal Trip Guide
Trip Type: National Parks Road Trip
Trip Length: 12 Days
Season: April (mild weather)
Group: Family with teenagers
Style: Camping + day hikes + scenic drives

🌄 Why This Route Works
Utah's Big Five national parks offer diverse landscapes from red rock canyons to towering arches. Perfect for family adventures with varying difficulty levels.

🥾 Outdoor Activities to Prioritize
• Angels Landing hike in Zion (advanced teens only)
• Delicate Arch sunset hike in Arches
• Bryce Canyon sunrise point viewing
• Capitol Reef petroglyph trail
• Canyonlands Mesa Arch photography

🏛️ Top Cultural Experiences
• Petroglyphs and ancient ruins exploration
• Pioneer history in Capitol Reef
• Local Native American cultural centers
• Small town Mormon pioneer heritage sites`,
    generatedAt: new Date(),
    questionnaireSummary: { destination: 'Utah', activity: 'hiking' },
    tags: ['utah', 'national-parks', 'hiking', 'family', 'roadtrip']
  },

  // Тест 5: Японские горы - зимние активности
  {
    id: 'test-5-japan-skiing',
    flowType: 'i-know-where',
    title: 'Japan Powder Skiing Adventure', 
    content: `🗺️ Your Personal Trip Guide
Trip Type: Ski Resort + Cultural Immersion
Trip Length: 8 Days
Season: February (peak powder season)
Group: Advanced skiers couple
Style: Luxury resort + authentic cultural experiences

🌄 Why This Route Works
Niseko and Hakuba offer world's best powder snow combined with authentic Japanese mountain culture. Perfect for serious skiers seeking cultural depth.

🥾 Outdoor Activities to Prioritize
• Niseko backcountry powder skiing
• Hakuba Valley resort exploration
• Onsen hot spring relaxation after skiing
• Snow monkey park winter hiking

🏛️ Top Cultural Experiences
• Traditional ryokan stays with kaiseki meals
• Local sake brewery tours in mountain villages
• Soba noodle making workshops
• Buddhist temple visits in snowy settings
• Traditional Japanese bathing culture`,
    generatedAt: new Date(),
    questionnaireSummary: { destination: 'Japan', activity: 'skiing' },
    tags: ['japan', 'skiing', 'powder', 'onsen', 'culture']
  },

  // === INSPIRE ME TESTS (5) ===

  // Тест 6: Зимний побег в тепло
  {
    id: 'test-6-winter-escape',
    flowType: 'inspire-me',
    title: 'Winter Escape Ideas',
    content: `Here's what we recommend — 3 ideas based on your travel style, activity level, and winter escape timing.

🌄 Adventure Idea 1: Patagonia — Glaciers, Wind, and Wild Silence
✈️ Flight time from NYC: ~13–15 hrs to El Calafate
🚗 Max drive between stops: 3–4 hrs
🏞️ Terrain: Glacier fields, open steppe, jagged mountains
🏕️ Trip style: Remote roadtrip + rustic lodges

Why this works:
You wanted something wild and far away — Patagonia delivers enormous landscapes and meaningful travel between stunning stops. Summer season means long days without snow or crowds.

Key outdoor experiences:
• Day hikes in El Chaltén (Laguna Capri, Mirador Fitz Roy)
• Perito Moreno Glacier boardwalk exploration
• Guanaco and condor wildlife spotting

🐫 Adventure Idea 2: Southern Morocco — Sand Dunes, Atlas Peaks & Oases
✈️ Flight time from NYC: ~10 hrs to Marrakech  
🚗 Max drive between stops: 2–5 hrs
🏞️ Terrain: Desert, canyons, oases, mountain foothills
🏕️ Trip style: Desert camps + kasbahs + mountain villages

Why this works:
Dry warmth, soulful landscapes, and rich culture. Spice markets, hiking trails, canyon villages, and desert stars without needing winter gear.

Key outdoor experiences:
• Camel trekking in Erg Chebbi dunes
• Todra Gorge red rock valley hikes
• High Atlas mountain passes driving

🏝️ Adventure Idea 3: Thailand Islands — Tropical Adventures & Beach Culture  
✈️ Flight time from NYC: ~20 hrs via Bangkok
🚗 Max travel between islands: Ferry + longtail boats
🏞️ Terrain: Limestone karsts, tropical beaches, jungle
🏕️ Trip style: Island hopping + beach relaxation + cultural immersion

Why this works:
Perfect warm weather, incredible food, and mix of adventure with relaxation. Rock climbing, snorkeling, and cultural temples.

Key outdoor experiences:
• Rock climbing in Krabi limestone cliffs
• Snorkeling in crystal clear waters
• Jungle temple exploration`,
    generatedAt: new Date(),
    questionnaireSummary: { season: 'winter', preference: 'warm_escape' },
    tags: ['inspire-me', 'winter-escape', 'multiple-destinations']
  },

  // Тест 7: Активный летний отдых
  {
    id: 'test-7-summer-active',
    flowType: 'inspire-me',
    title: 'Summer Active Adventure Ideas',
    content: `Here's what we recommend — 3 ideas based on your high activity level and summer adventure preferences.

🏔️ Adventure Idea 1: Norwegian Fjords — Midnight Sun Hiking & Kayaking
✈️ Flight time from London: ~2 hrs to Bergen
🚗 Max drive between stops: 4–5 hrs through stunning scenery
🏞️ Terrain: Deep fjords, waterfalls, arctic mountains
🏕️ Trip style: Outdoor lodges + midnight sun adventures

Why this works:
24-hour daylight means endless outdoor time. World-class hiking with dramatic fjord views, plus kayaking between towering cliffs.

Key outdoor experiences:
• Preikestolen (Pulpit Rock) dramatic cliff hike
• Geirangerfjord kayaking between waterfalls
• Trolltunga challenging mountain ridge hike

🗻 Adventure Idea 2: Romanian Carpathians — Wilderness Hiking & Medieval Culture
✈️ Flight time from London: ~3 hrs to Bucharest
🚗 Max drive between stops: 2–3 hrs mountain roads
🏞️ Terrain: Pristine mountains, medieval towns, wild forests
🏕️ Trip style: Mountain huts + medieval towns + wilderness

Why this works:
Europe's last wilderness with brown bears, wolves, and medieval castles. Authentic mountain culture without crowds.

Key outdoor experiences:
• Fagaras Mountains multi-day trek
• Piatra Craiului limestone ridge hiking
• Wildlife spotting in Carpathian forests

🏝️ Adventure Idea 3: Scottish Highlands — Island Hopping & Wild Camping
✈️ Flight time from London: ~1.5 hrs to Edinburgh
🚗 Max travel: Ferries between islands + Highland drives
🏞️ Terrain: Rugged highlands, pristine lochs, remote islands
🏕️ Trip style: Wild camping + island exploration + Highland culture

Why this works:
Right to roam laws allow wild camping anywhere. Dramatic landscapes, whisky culture, and endless hiking opportunities.

Key outdoor experiences:
• Ben Nevis summit challenge
• Isle of Skye ridge walking
• Wild camping beside Highland lochs`,
    generatedAt: new Date(),
    questionnaireSummary: { season: 'summer', activity_level: 'high' },
    tags: ['inspire-me', 'summer', 'high-activity', 'europe']
  },

  // Тест 8: Семейные приключения
  {
    id: 'test-8-family-adventure',
    flowType: 'inspire-me',
    title: 'Family Adventure Ideas',
    content: `Here's what we recommend — 3 ideas based on your family travel style with teenagers seeking adventure.

🦘 Adventure Idea 1: Australian East Coast — Beaches, Reefs & Rainforest
✈️ Flight time from LA: ~15 hrs to Sydney
🚗 Max drive between stops: 3–4 hrs coastal drives
🏞️ Terrain: Beaches, coral reefs, tropical rainforest
🏕️ Trip style: Beach towns + reef adventures + rainforest exploration

Why this works:
Perfect for active families with snorkeling, surfing lessons, and wildlife encounters. Easy logistics with good infrastructure.

Key outdoor experiences:
• Great Barrier Reef snorkeling from Cairns
• Blue Mountains bushwalking near Sydney
• Daintree Rainforest canopy tours

🗻 Adventure Idea 2: Costa Rica — Volcanoes, Wildlife & Adventure Sports
✈️ Flight time from Miami: ~5 hrs to San José
🚗 Max drive between stops: 2–3 hrs through national parks
🏞️ Terrain: Active volcanoes, cloud forests, Pacific beaches
🏕️ Trip style: Eco-lodges + adventure activities + wildlife

Why this works:
World-class adventure activities suitable for teens, incredible wildlife, and strong eco-tourism infrastructure for families.

Key outdoor experiences:
• Arenal Volcano hiking and zip-lining
• Manuel Antonio beach and wildlife spotting
• Monteverde cloud forest canopy tours

🏔️ Adventure Idea 3: New Zealand South Island — Adventure Capital Family Style
✈️ Flight time from LA: ~13 hrs to Christchurch
🚗 Max drive between stops: 3–4 hrs scenic routes
🏞️ Terrain: Alps, glacial lakes, fiords
🏕️ Trip style: Adventure towns + family activities + stunning drives

Why this works:
Queenstown offers age-appropriate thrills for the whole family. Incredible scenery and well-developed adventure tourism.

Key outdoor experiences:
• Milford Sound cruise and hiking
• Queenstown adventure activities (bungee for brave teens)
• Franz Josef Glacier exploration`,
    generatedAt: new Date(),
    questionnaireSummary: { group: 'family_with_teens', activity: 'adventure' },
    tags: ['inspire-me', 'family', 'teenagers', 'adventure']
  },

  // Тест 9: Культурное погружение
  {
    id: 'test-9-cultural-immersion',
    flowType: 'inspire-me',
    title: 'Cultural Immersion Ideas',
    content: `Here's what we recommend — 3 ideas based on your desire for deep cultural experiences and meaningful travel.

🕌 Adventure Idea 1: Central Asia Silk Road — Uzbekistan & Kyrgyzstan
✈️ Flight time from Frankfurt: ~6 hrs to Tashkent
🚗 Max drive between stops: 4–5 hrs through ancient routes
🏞️ Terrain: Silk Road cities, mountain passes, nomadic landscapes
🏕️ Trip style: Historic cities + yurt stays + cultural immersion

Why this works:
Untouched by mass tourism, authentic cultural experiences with Silk Road history and nomadic traditions still alive today.

Key outdoor experiences:
• Tian Shan mountain trekking in Kyrgyzstan
• Fergana Valley traditional craft villages
• Song-Kul Lake nomadic yurt camping

🏛️ Adventure Idea 2: Ethiopian Highlands — Ancient Churches & Tribal Cultures
✈️ Flight time from London: ~7 hrs to Addis Ababa
🚗 Max drive between stops: 3–4 hrs mountain roads
🏞️ Terrain: High plateaus, rock churches, tribal territories
🏕️ Trip style: Historic sites + cultural immersion + highland trekking

Why this works:
One of Africa's most ancient civilizations with unchanged traditions. Rock-hewn churches, coffee ceremonies, and highland cultures.

Key outdoor experiences:
• Simien Mountains gelada monkey trekking
• Lalibela rock church exploration
• Danakil Depression geological wonders

🏺 Adventure Idea 3: Bhutan — Himalayan Buddhism & Pristine Culture
✈️ Flight time from Delhi: ~2 hrs to Paro
🚗 Max drive between stops: 2–3 hrs mountain valleys
🏞️ Terrain: Himalayan valleys, monasteries, pristine forests
🏕️ Trip style: Monastery stays + cultural festivals + mountain hiking

Why this works:
Last Himalayan Buddhist kingdom with preserved culture, sustainable tourism, and authentic spiritual experiences.

Key outdoor experiences:
• Tiger's Nest monastery dramatic hike
• Bumthang valley cultural trekking
• Traditional archery and festival participation`,
    generatedAt: new Date(),
    questionnaireSummary: { interest: 'culture', style: 'immersive' },
    tags: ['inspire-me', 'culture', 'immersion', 'authentic']
  },

  // Тест 10: Осенние приключения
  {
    id: 'test-10-autumn-colors',
    flowType: 'inspire-me',
    title: 'Autumn Color Adventures',
    content: `Here's what we recommend — 3 ideas based on your love of autumn colors and moderate hiking preferences.

🍁 Adventure Idea 1: Japanese Alps — Fall Foliage & Mountain Culture
✈️ Flight time from Seattle: ~10 hrs to Tokyo
🚗 Max drive between stops: 2–3 hrs through mountain valleys
🏞️ Terrain: Alpine peaks, valleys, hot springs, traditional villages
🏕️ Trip style: Mountain lodges + onsen + fall hiking

Why this works:
World's most spectacular autumn colors combined with incredible mountain culture, onsen relaxation, and perfect hiking weather.

Key outdoor experiences:
• Kamikochi alpine valley autumn hiking
• Takayama traditional village exploration
• Shirakawa-go World Heritage village walks

🗻 Adventure Idea 2: Canadian Rockies — Fall Colors & Wildlife
✈️ Flight time from Denver: ~3 hrs to Calgary
🚗 Max drive between stops: 2–4 hrs scenic mountain roads
🏞️ Terrain: Mountain peaks, alpine lakes, golden aspen forests
🏕️ Trip style: Mountain lodges + wildlife viewing + fall hiking

Why this works:
Golden aspen groves, snow-capped peaks, and elk bugling season. Perfect for photography and moderate mountain hiking.

Key outdoor experiences:
• Banff larch trees golden hiking trails
• Jasper elk watching in autumn meadows
• Lake Louise canoeing among fall colors

🏔️ Adventure Idea 3: European Alps — Harvest Season & Mountain Culture
✈️ Flight time from NYC: ~8 hrs to Zurich
🚗 Max drive between stops: 1–3 hrs Alpine passes
🏞️ Terrain: Alpine meadows, wine valleys, mountain peaks
🏕️ Trip style: Alpine villages + harvest festivals + moderate hiking

Why this works:
Autumn harvest season brings wine festivals, golden larch forests, and perfect hiking weather without summer crowds.

Key outdoor experiences:
• Dolomites golden larch forest hiking
• Swiss alpine meadow walks with autumn colors
• Austrian harvest festival participation`,
    generatedAt: new Date(),
    questionnaireSummary: { season: 'autumn', interest: 'colors' },
    tags: ['inspire-me', 'autumn', 'fall-colors', 'moderate-hiking']
  }
];

// Тестовые эксперты для сопоставления
export const testExperts = [
  {
    id: 'expert-nepal-1',
    profession: 'Himalayan Trekking Guide',
    oneline_bio: 'Local Sherpa guide with 15 years experience leading Everest Base Camp treks, born in Namche Bazaar'
  },
  {
    id: 'expert-diving-1', 
    profession: 'Marine Biology Diving Instructor',
    oneline_bio: 'Indonesian dive master specializing in Raja Ampat marine biodiversity, 10 years guiding underwater expeditions'
  },
  {
    id: 'expert-berlin-1',
    profession: 'Berlin History Tour Guide',
    oneline_bio: 'Former East Berlin resident, expert in Cold War history and underground culture, speaks 4 languages'
  },
  {
    id: 'expert-utah-1',
    profession: 'National Parks Adventure Guide',
    oneline_bio: 'Utah native specializing in Big Five national parks family adventures, certified wilderness first aid'
  },
  {
    id: 'expert-japan-ski-1',
    profession: 'Japan Powder Skiing Specialist',
    oneline_bio: 'Canadian expat living in Niseko 8 years, expert in Japanese powder skiing and mountain culture'
  },
  {
    id: 'expert-patagonia-1',
    profession: 'Patagonia Wilderness Guide',
    oneline_bio: 'Argentine guide specializing in El Chaltén and El Calafate regions, 12 years leading trekking expeditions'
  },
  {
    id: 'expert-morocco-1',
    profession: 'Morocco Desert Specialist',
    oneline_bio: 'Berber guide from Atlas Mountains, expert in Sahara expeditions and traditional nomadic culture'
  },
  {
    id: 'expert-thailand-1',
    profession: 'Thailand Adventure Travel Guide',
    oneline_bio: 'British expat in Thailand 15 years, specialist in southern islands rock climbing and cultural experiences'
  },
  {
    id: 'expert-norway-1',
    profession: 'Norwegian Fjords Hiking Guide',
    oneline_bio: 'Local Norwegian guide specializing in Lofoten and fjord region hiking, midnight sun expeditions'
  },
  {
    id: 'expert-romania-1',
    profession: 'Carpathian Mountains Specialist',
    oneline_bio: 'Romanian wilderness guide, expert in Fagaras Mountains and brown bear tracking, conservation focus'
  },
  {
    id: 'expert-scotland-1',
    profession: 'Scottish Highlands Walking Guide',
    oneline_bio: 'Highland native specializing in Isle of Skye and West Highland Way, wild camping expert'
  },
  {
    id: 'expert-australia-1',
    profession: 'Australian East Coast Guide',
    oneline_bio: 'Queensland specialist in Great Barrier Reef and Daintree experiences, marine biology background'
  },
  {
    id: 'expert-costarica-1',
    profession: 'Costa Rica Eco-Adventure Guide',
    oneline_bio: 'Tico guide specializing in family adventure tourism, volcano and wildlife expert, bilingual'
  },
  {
    id: 'expert-newzealand-1',
    profession: 'New Zealand Adventure Tourism Specialist',
    oneline_bio: 'Queenstown local with 10 years in adventure tourism, family-friendly activities expert'
  },
  {
    id: 'expert-uzbekistan-1',
    profession: 'Central Asia Cultural Guide',
    oneline_bio: 'Uzbek historian specializing in Silk Road cultural tours, fluent in multiple Central Asian languages'
  },
  {
    id: 'expert-ethiopia-1',
    profession: 'Ethiopian Cultural Specialist',
    oneline_bio: 'Addis Ababa based guide expert in highland cultures and ancient churches, anthropology background'
  },
  {
    id: 'expert-bhutan-1',
    profession: 'Bhutan Cultural Trekking Guide',
    oneline_bio: 'Licensed Bhutanese guide specializing in monastery visits and traditional festivals, Buddhist practitioner'
  },
  {
    id: 'expert-japanese-alps-1',
    profession: 'Japanese Alps Autumn Guide',
    oneline_bio: 'Japanese mountain guide specializing in fall foliage hiking and traditional mountain culture'
  },
  {
    id: 'expert-canadian-rockies-1',
    profession: 'Canadian Rockies Wildlife Guide',
    oneline_bio: 'Alberta guide specializing in autumn wildlife viewing and fall color photography tours'
  },
  {
    id: 'expert-european-alps-1',
    profession: 'European Alps Cultural Guide',
    oneline_bio: 'Austrian guide expert in Dolomites and alpine culture, harvest season and wine festival specialist'
  }
];