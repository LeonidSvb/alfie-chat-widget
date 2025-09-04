// Улучшенная логика фильтрации экспертов с использованием тегов
// Более точная и гибкая система поиска

const AIRTABLE_API_KEY = 'patt4GHq4ij1rNAdK.9b230d9e4002e265f7a89f6e208fd0d3145d1f495d66eb092252b8da7559da9d';
const NEW_BASE_ID = 'apptAJxE6IudBH8fW';
const NEW_TABLE_ID = 'tblgvgDuQm20rNVPV';

class ImprovedExpertMatcher {
  constructor() {
    this.experts = [];
    this.tagsReference = this.loadTagsReference();
  }

  // Загружаем референс тегов
  loadTagsReference() {
    const fs = require('fs');
    const path = require('path');
    
    try {
      const refPath = path.join(process.cwd(), 'experts_tags_reference.json');
      const data = fs.readFileSync(refPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.warn('Не удалось загрузить референс тегов:', error.message);
      return null;
    }
  }

  // Получение всех экспертов с тегами
  async getAllExperts() {
    let allRecords = [];
    let offset = null;

    do {
      const url = `https://api.airtable.com/v0/${NEW_BASE_ID}/${NEW_TABLE_ID}${offset ? `?offset=${offset}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status}`);
      }

      const data = await response.json();
      allRecords = allRecords.concat(data.records);
      offset = data.offset;

    } while (offset);

    this.experts = allRecords.filter(record => record.fields.Name);
    return this.experts;
  }

  // УЛУЧШЕННАЯ ЛОГИКА ФИЛЬТРАЦИИ
  // Более умная и гибкая система поиска

  findExperts(userRequest) {
    const {
      destination,        // "Utah", "Grand Canyon", "Norway"
      specific_location,  // "Zion National Park", "Lofoten"  
      activities,         // ["hiking", "photography"]
      traveler_type,      // "families", "solo", "beginners"
      experience_level,   // "beginner", "advanced", "extreme"
      languages,          // ["spanish", "german"]
      group_size,         // "solo", "small_group", "large_group"
      special_needs       // ["accessibility", "kids_under_5"]
    } = userRequest;

    console.log('🔍 ПОИСК ЭКСПЕРТОВ ПО ЗАПРОСУ:');
    console.log(JSON.stringify(userRequest, null, 2));
    console.log('');

    let candidates = [...this.experts];
    const filterSteps = [];

    // ШАГИ ФИЛЬТРАЦИИ (УЛУЧШЕННЫЕ)

    // ШАГ 1: ГЕОГРАФИЯ (Более умная)
    if (destination || specific_location) {
      const locationFilters = [];
      
      if (destination) locationFilters.push(this.createLocationFilter(destination));
      if (specific_location) locationFilters.push(this.createLocationFilter(specific_location));

      candidates = candidates.filter(expert => {
        return locationFilters.some(filter => this.matchesLocationFilter(expert, filter));
      });

      filterSteps.push({
        step: 'География',
        criteria: `${destination || ''} ${specific_location || ''}`.trim(),
        remaining: candidates.length,
        logic: 'Поиск по Location_Tags с умными синонимами'
      });

      console.log(`📍 География: ${candidates.length} экспертов найдено`);
    }

    // ШАГ 2: АКТИВНОСТИ (Более гибкий)
    if (activities && activities.length > 0) {
      candidates = candidates.filter(expert => {
        return activities.some(activity => this.matchesActivity(expert, activity));
      });

      filterSteps.push({
        step: 'Активности',
        criteria: activities.join(', '),
        remaining: candidates.length,
        logic: 'Поиск по Activity_Tags + синонимы'
      });

      console.log(`🎯 Активности: ${candidates.length} экспертов найдено`);
    }

    // ШАГ 3: ТИП ПУТЕШЕСТВЕННИКА (Более точный)
    if (traveler_type) {
      candidates = candidates.filter(expert => {
        return this.matchesTravelerType(expert, traveler_type);
      });

      filterSteps.push({
        step: 'Тип путешественника',
        criteria: traveler_type,
        remaining: candidates.length,
        logic: 'Поиск по Traveler_Tags'
      });

      console.log(`👥 Тип путешественника: ${candidates.length} экспертов найдено`);
    }

    // ШАГ 4: УРОВЕНЬ ОПЫТА И ЭКСПЕРТИЗА
    if (experience_level) {
      candidates = candidates.filter(expert => {
        return this.matchesExperienceLevel(expert, experience_level);
      });

      filterSteps.push({
        step: 'Уровень опыта',
        criteria: experience_level,
        remaining: candidates.length,
        logic: 'Поиск по Expertise_Tags (level_*)'
      });

      console.log(`🎓 Уровень опыта: ${candidates.length} экспертов найдено`);
    }

    // ШАГ 5: ЯЗЫКИ (Новый!)
    if (languages && languages.length > 0) {
      candidates = candidates.filter(expert => {
        return languages.some(lang => this.matchesLanguage(expert, lang));
      });

      filterSteps.push({
        step: 'Языки',
        criteria: languages.join(', '),
        remaining: candidates.length,
        logic: 'Поиск по Language_Tags'
      });

      console.log(`🗣️ Языки: ${candidates.length} экспертов найдено`);
    }

    // РАНЖИРОВАНИЕ РЕЗУЛЬТАТОВ
    const rankedResults = this.rankExperts(candidates, userRequest);

    return {
      totalFound: rankedResults.length,
      experts: rankedResults,
      filterSteps: filterSteps,
      fallbackSuggestions: this.generateFallbacks(userRequest, rankedResults)
    };
  }

  // УМНЫЕ ПОМОЩНИКИ ДЛЯ ФИЛЬТРАЦИИ

  createLocationFilter(location) {
    const synonyms = {
      // Страны
      'usa': ['country_us', 'united states', 'america'],
      'utah': ['region_utah', 'country_us'],
      'colorado': ['region_colorado', 'country_us'],
      'norway': ['country_norway', 'scandinavian'],
      'canada': ['country_canada'],

      // Конкретные места
      'grand canyon': ['dest_grand_canyon'],
      'yellowstone': ['dest_yellowstone'], 
      'zion': ['dest_zion'],
      'yosemite': ['dest_yosemite'],
      'mount rainier': ['dest_mt_rainier'],
      'lofoten': ['dest_lofoten'],
      'patagonia': ['dest_patagonia'],

      // Регионы
      'pacific northwest': ['region_washington', 'dest_cascades', 'dest_mt_rainier'],
      'california': ['region_california'],
      'alaska': ['region_alaska'],
    };

    const locationLower = location.toLowerCase();
    return synonyms[locationLower] || [locationLower];
  }

  matchesLocationFilter(expert, filter) {
    const locationTags = expert.fields.Location_Tags || [];
    const allTags = expert.fields.All_Tags || [];
    
    return filter.some(term => {
      return locationTags.some(tag => tag.includes(term)) ||
             allTags.some(tag => tag.includes(term)) ||
             this.textContains(expert.fields.Geographic_areas_raw, term);
    });
  }

  matchesActivity(expert, activity) {
    const activitySynonyms = {
      'hiking': ['activity_hiking', 'activity_mountaineering', 'hiking', 'backpacking'],
      'photography': ['activity_photography', 'photographer', 'filming'],
      'diving': ['activity_diving', 'scuba', 'snorkeling'],
      'skiing': ['activity_skiing', 'ski', 'snowboarding'],
      'climbing': ['activity_climbing', 'mountaineering', 'rock climbing'],
      'canyoning': ['activity_canyoning', 'canyoneering', 'canyon'],
      'wildlife': ['activity_wildlife', 'safari', 'birding']
    };

    const activityLower = activity.toLowerCase();
    const synonymsToCheck = activitySynonyms[activityLower] || [activityLower];

    const activityTags = expert.fields.Activity_Tags || [];
    const allTags = expert.fields.All_Tags || [];

    return synonymsToCheck.some(term => {
      return activityTags.some(tag => tag.includes(term)) ||
             allTags.some(tag => tag.includes(term)) ||
             this.textContains(expert.fields.Professional_expertise_raw, term);
    });
  }

  matchesTravelerType(expert, type) {
    const typeSynonyms = {
      'families': ['traveler_families', 'family', 'kids', 'children'],
      'solo': ['traveler_solo', 'solo'],
      'beginners': ['traveler_beginners', 'first-time', 'novice'],
      'extreme': ['traveler_extreme', 'advanced', 'expert'],
      'seniors': ['traveler_60plus', 'senior', 'elderly']
    };

    const typeLower = type.toLowerCase();
    const synonymsToCheck = typeSynonyms[typeLower] || [typeLower];

    const travelerTags = expert.fields.Traveler_Tags || [];
    const allTags = expert.fields.All_Tags || [];

    return synonymsToCheck.some(term => {
      return travelerTags.some(tag => tag.includes(term)) ||
             allTags.some(tag => tag.includes(term)) ||
             this.textContains(expert.fields.Travel_types_experience, term);
    });
  }

  matchesExperienceLevel(expert, level) {
    const levelSynonyms = {
      'beginner': ['level_beginner', 'first-time', 'novice'],
      'advanced': ['level_advanced', 'experienced'],
      'extreme': ['level_extreme', 'professional', 'expert']
    };

    const levelLower = level.toLowerCase();
    const synonymsToCheck = levelSynonyms[levelLower] || [levelLower];

    const expertiseTags = expert.fields.Expertise_Tags || [];
    const allTags = expert.fields.All_Tags || [];

    return synonymsToCheck.some(term => {
      return expertiseTags.some(tag => tag.includes(term)) ||
             allTags.some(tag => tag.includes(term));
    });
  }

  matchesLanguage(expert, language) {
    const languageSynonyms = {
      'spanish': ['lang_spanish', 'spanish'],
      'german': ['lang_german', 'german', 'deutsch'],
      'french': ['lang_french', 'french'],
      'japanese': ['lang_japanese', 'japanese']
    };

    const langLower = language.toLowerCase();
    const synonymsToCheck = languageSynonyms[langLower] || [`lang_${langLower}`];

    const languageTags = expert.fields.Language_Tags || [];
    const allTags = expert.fields.All_Tags || [];

    return synonymsToCheck.some(term => {
      return languageTags.some(tag => tag.includes(term)) ||
             allTags.some(tag => tag.includes(term)) ||
             this.textContains(expert.fields.Languages_raw, term);
    });
  }

  // РАНЖИРОВАНИЕ ЭКСПЕРТОВ ПО РЕЛЕВАНТНОСТИ
  rankExperts(experts, userRequest) {
    return experts.map(expert => {
      const score = this.calculateRelevanceScore(expert, userRequest);
      return {
        expert: expert,
        score: score,
        reasons: this.explainMatch(expert, userRequest)
      };
    }).sort((a, b) => b.score - a.score);
  }

  calculateRelevanceScore(expert, userRequest) {
    let score = 0;

    // Бонусы за точные совпадения
    if (userRequest.destination && this.matchesLocationFilter(expert, this.createLocationFilter(userRequest.destination))) {
      score += 10;
    }

    if (userRequest.activities) {
      userRequest.activities.forEach(activity => {
        if (this.matchesActivity(expert, activity)) score += 8;
      });
    }

    if (userRequest.traveler_type && this.matchesTravelerType(expert, userRequest.traveler_type)) {
      score += 6;
    }

    if (userRequest.experience_level && this.matchesExperienceLevel(expert, userRequest.experience_level)) {
      score += 5;
    }

    if (userRequest.languages) {
      userRequest.languages.forEach(lang => {
        if (this.matchesLanguage(expert, lang)) score += 7;
      });
    }

    // Бонус за количество отзывов/опыт (если поле есть)
    const expertiseTags = expert.fields.Expertise_Tags || [];
    if (expertiseTags.includes('role_guide')) score += 3;
    if (expertiseTags.includes('cert_wfr')) score += 2;
    
    return score;
  }

  explainMatch(expert, userRequest) {
    const reasons = [];
    
    if (userRequest.destination) {
      if (this.matchesLocationFilter(expert, this.createLocationFilter(userRequest.destination))) {
        reasons.push(`Эксперт по региону: ${userRequest.destination}`);
      }
    }

    if (userRequest.activities) {
      userRequest.activities.forEach(activity => {
        if (this.matchesActivity(expert, activity)) {
          reasons.push(`Специализация: ${activity}`);
        }
      });
    }

    if (userRequest.traveler_type) {
      if (this.matchesTravelerType(expert, userRequest.traveler_type)) {
        reasons.push(`Опыт работы с: ${userRequest.traveler_type}`);
      }
    }

    return reasons;
  }

  // FALLBACK стратегии (улучшенные)
  generateFallbacks(userRequest, foundExperts) {
    if (foundExperts.length === 0) {
      return {
        geographic_expansion: this.expandGeographicSearch(userRequest),
        activity_alternatives: this.findActivityAlternatives(userRequest),
        experience_adjustment: this.adjustExperienceLevel(userRequest)
      };
    }

    return null;
  }

  expandGeographicSearch(userRequest) {
    // Если не нашли в конкретном месте, ищем в более широком регионе
    if (userRequest.specific_location && !userRequest.destination) {
      return `Попробуем поиск в более широком регионе для ${userRequest.specific_location}`;
    }
    return null;
  }

  findActivityAlternatives(userRequest) {
    // Предлагаем похожие активности
    const alternatives = {
      'ice_climbing': ['rock_climbing', 'mountaineering'],
      'mushroom_foraging': ['hiking', 'nature_photography'],
      'base_jumping': ['skydiving', 'extreme_sports']
    };

    if (userRequest.activities) {
      return userRequest.activities.map(activity => {
        return alternatives[activity] || [`general_${activity}`, 'adventure_guide'];
      });
    }
    return null;
  }

  adjustExperienceLevel(userRequest) {
    // Предлагаем экспертов другого уровня, если точного нет
    const adjustments = {
      'extreme': ['advanced', 'professional'],
      'beginner': ['intermediate', 'general']
    };

    return adjustments[userRequest.experience_level] || null;
  }

  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  textContains(text, term) {
    if (!text || !term) return false;
    return text.toLowerCase().includes(term.toLowerCase());
  }
}

// ДЕМОНСТРАЦИЯ УЛУЧШЕННОЙ СИСТЕМЫ
async function demonstrateImprovedFiltering() {
  console.log('🎯 ДЕМОНСТРАЦИЯ УЛУЧШЕННОЙ СИСТЕМЫ ФИЛЬТРАЦИИ\n');
  
  const matcher = new ImprovedExpertMatcher();
  await matcher.getAllExperts();

  console.log(`📊 Загружено ${matcher.experts.length} экспертов\n`);

  // ТЕСТОВЫЕ СЦЕНАРИИ
  const testScenarios = [
    {
      name: 'Семейный поход в Utah',
      request: {
        destination: 'Utah',
        specific_location: 'Zion National Park',
        activities: ['hiking'],
        traveler_type: 'families',
        experience_level: 'beginner'
      }
    },
    {
      name: 'Solo фотография в Norway',
      request: {
        destination: 'Norway',
        specific_location: 'Lofoten',
        activities: ['photography', 'hiking'],
        traveler_type: 'solo',
        experience_level: 'advanced'
      }
    },
    {
      name: 'Extreme mountaineering',
      request: {
        activities: ['mountaineering', 'climbing'],
        traveler_type: 'extreme',
        experience_level: 'extreme',
        languages: ['spanish']
      }
    }
  ];

  testScenarios.forEach((scenario, index) => {
    console.log(`\n🧪 ТЕСТ ${index + 1}: ${scenario.name}`);
    console.log('==========================================');
    
    const results = matcher.findExperts(scenario.request);
    
    console.log(`✅ Найдено экспертов: ${results.totalFound}`);
    
    if (results.totalFound > 0) {
      console.log('\n🏆 ТОП-3 СОВПАДЕНИЯ:');
      results.experts.slice(0, 3).forEach((result, idx) => {
        console.log(`${idx + 1}. ${result.expert.fields.Name} (score: ${result.score})`);
        console.log(`   Почему подходит: ${result.reasons.join(', ')}`);
      });
    } else {
      console.log('❌ Экспертов не найдено');
      if (results.fallbackSuggestions) {
        console.log('💡 Предложения: ', results.fallbackSuggestions);
      }
    }
    
    console.log('\n📋 ЭТАПЫ ФИЛЬТРАЦИИ:');
    results.filterSteps.forEach(step => {
      console.log(`   ${step.step}: ${step.remaining} экспертов (${step.criteria})`);
    });
  });
}

// Запуск демонстрации
if (require.main === module) {
  demonstrateImprovedFiltering();
}

module.exports = ImprovedExpertMatcher;