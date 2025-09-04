// УЛУЧШЕННАЯ СИСТЕМА ПОИСКА ЭКСПЕРТОВ
// Интегрированная версия improved_filtering_logic.js для N8N

const AIRTABLE_API_KEY = 'patt4GHq4ij1rNAdK.9b230d9e4002e265f7a89f6e208fd0d3145d1f495d66eb092252b8da7559da9d';
const NEW_BASE_ID = 'apptAJxE6IudBH8fW';
const NEW_TABLE_ID = 'tblgvgDuQm20rNVPV';

class ImprovedExpertMatcher {
  constructor() {
    this.experts = [];
  }

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

  findExperts(userRequest) {
    const {
      destination,
      specific_location,
      activities,
      traveler_type,
      experience_level,
      languages
    } = userRequest;

    console.log('🔍 ПОИСК ЭКСПЕРТОВ ПО ЗАПРОСУ:', userRequest);

    let candidates = [...this.experts];
    const filterSteps = [];

    // ГЕОГРАФИЯ
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
        remaining: candidates.length
      });
    }

    // АКТИВНОСТИ
    if (activities && activities.length > 0) {
      candidates = candidates.filter(expert => {
        return activities.some(activity => this.matchesActivity(expert, activity));
      });

      filterSteps.push({
        step: 'Активности',
        criteria: activities.join(', '),
        remaining: candidates.length
      });
    }

    // ТИП ПУТЕШЕСТВЕННИКА
    if (traveler_type) {
      candidates = candidates.filter(expert => {
        return this.matchesTravelerType(expert, traveler_type);
      });

      filterSteps.push({
        step: 'Тип путешественника',
        criteria: traveler_type,
        remaining: candidates.length
      });
    }

    // УРОВЕНЬ ОПЫТА
    if (experience_level) {
      candidates = candidates.filter(expert => {
        return this.matchesExperienceLevel(expert, experience_level);
      });

      filterSteps.push({
        step: 'Уровень опыта',
        criteria: experience_level,
        remaining: candidates.length
      });
    }

    // ЯЗЫКИ
    if (languages && languages.length > 0) {
      candidates = candidates.filter(expert => {
        return languages.some(lang => this.matchesLanguage(expert, lang));
      });

      filterSteps.push({
        step: 'Языки',
        criteria: languages.join(', '),
        remaining: candidates.length
      });
    }

    // РАНЖИРОВАНИЕ
    const rankedResults = this.rankExperts(candidates, userRequest);

    return {
      totalFound: rankedResults.length,
      experts: rankedResults.slice(0, 5),
      filterSteps: filterSteps
    };
  }

  createLocationFilter(location) {
    const synonyms = {
      'thailand': ['country_thailand', 'thai'],
      'bangkok': ['dest_bangkok', 'country_thailand'],
      'chiang mai': ['dest_chiang_mai', 'country_thailand'],
      'krabi': ['dest_krabi', 'country_thailand'],
      'koh lanta': ['dest_koh_lanta', 'country_thailand'],
      'utah': ['region_utah', 'country_us'],
      'colorado': ['region_colorado', 'country_us'],
      'norway': ['country_norway'],
      'patagonia': ['dest_patagonia']
    };

    const locationLower = location.toLowerCase();
    return synonyms[locationLower] || [locationLower];
  }

  matchesLocationFilter(expert, filter) {
    const locationTags = expert.fields.Location_Tags || [];
    const allTags = expert.fields.All_Tags || [];
    
    return filter.some(term => {
      return locationTags.some(tag => tag.toLowerCase().includes(term.toLowerCase())) ||
             allTags.some(tag => tag.toLowerCase().includes(term.toLowerCase())) ||
             this.textContains(expert.fields.Geographic_areas_raw, term);
    });
  }

  matchesActivity(expert, activity) {
    const activitySynonyms = {
      'hiking': ['activity_hiking', 'hiking', 'backpacking'],
      'walking tours': ['activity_walking', 'walking', 'city tours'],
      'water activities': ['activity_diving', 'activity_kayaking', 'snorkel', 'water'],
      'snorkel': ['activity_diving', 'snorkel', 'water'],
      'kayak': ['activity_kayaking', 'kayak', 'water'],
      'art': ['activity_cultural', 'art', 'museums'],
      'museums': ['activity_cultural', 'museums', 'culture'],
      'food tours': ['activity_culinary', 'food', 'culinary']
    };

    const activityLower = activity.toLowerCase();
    const synonymsToCheck = activitySynonyms[activityLower] || [activityLower];

    const activityTags = expert.fields.Activity_Tags || [];
    const allTags = expert.fields.All_Tags || [];

    return synonymsToCheck.some(term => {
      return activityTags.some(tag => tag.toLowerCase().includes(term.toLowerCase())) ||
             allTags.some(tag => tag.toLowerCase().includes(term.toLowerCase())) ||
             this.textContains(expert.fields.Professional_expertise_raw, term);
    });
  }

  matchesTravelerType(expert, type) {
    const typeSynonyms = {
      'solo': ['traveler_solo', 'solo', 'independent'],
      'couple': ['traveler_couples', 'couple', 'romantic'],
      'families': ['traveler_families', 'family', 'kids'],
      'groups': ['traveler_groups', 'group']
    };

    const typeLower = type.toLowerCase();
    const synonymsToCheck = typeSynonyms[typeLower] || [typeLower];

    const travelerTags = expert.fields.Traveler_Tags || [];
    const allTags = expert.fields.All_Tags || [];

    return synonymsToCheck.some(term => {
      return travelerTags.some(tag => tag.toLowerCase().includes(term.toLowerCase())) ||
             allTags.some(tag => tag.toLowerCase().includes(term.toLowerCase())) ||
             this.textContains(expert.fields.Travel_types_experience, term);
    });
  }

  matchesExperienceLevel(expert, level) {
    const levelSynonyms = {
      'moderate': ['level_beginner', 'level_intermediate', 'moderate'],
      'beginner': ['level_beginner', 'beginner', 'first-time'],
      'advanced': ['level_advanced', 'advanced', 'experienced'],
      'active explorer': ['level_advanced', 'active', 'explorer']
    };

    const levelLower = level.toLowerCase();
    const synonymsToCheck = levelSynonyms[levelLower] || [levelLower];

    const expertiseTags = expert.fields.Expertise_Tags || [];
    const allTags = expert.fields.All_Tags || [];

    return synonymsToCheck.some(term => {
      return expertiseTags.some(tag => tag.toLowerCase().includes(term.toLowerCase())) ||
             allTags.some(tag => tag.toLowerCase().includes(term.toLowerCase()));
    });
  }

  matchesLanguage(expert, language) {
    const languageTags = expert.fields.Language_Tags || [];
    const allTags = expert.fields.All_Tags || [];

    return languageTags.some(tag => tag.toLowerCase().includes(language.toLowerCase())) ||
           allTags.some(tag => tag.toLowerCase().includes(language.toLowerCase())) ||
           this.textContains(expert.fields.Languages_raw, language);
  }

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

    return score;
  }

  explainMatch(expert, userRequest) {
    const reasons = [];
    
    if (userRequest.destination && this.matchesLocationFilter(expert, this.createLocationFilter(userRequest.destination))) {
      reasons.push(`Expert in: ${userRequest.destination}`);
    }

    if (userRequest.activities) {
      userRequest.activities.forEach(activity => {
        if (this.matchesActivity(expert, activity)) {
          reasons.push(`Specializes in: ${activity}`);
        }
      });
    }

    if (userRequest.traveler_type && this.matchesTravelerType(expert, userRequest.traveler_type)) {
      reasons.push(`Experience with: ${userRequest.traveler_type}`);
    }

    return reasons;
  }

  textContains(text, term) {
    if (!text || !term) return false;
    return text.toLowerCase().includes(term.toLowerCase());
  }
}

// ГЛАВНАЯ ФУНКЦИЯ ДЛЯ N8N
async function findMatchingExperts() {
  const userTrip = $input.first().json;
  
  // Парсим пользовательские данные
  const searchRequest = {
    destination: extractDestination(userTrip),
    specific_location: extractSpecificLocation(userTrip),
    activities: extractActivities(userTrip),
    traveler_type: extractTravelerType(userTrip),
    experience_level: extractExperienceLevel(userTrip)
  };

  console.log('🎯 Extracted search parameters:', searchRequest);

  // Создаем matcher и ищем экспертов
  const matcher = new ImprovedExpertMatcher();
  await matcher.getAllExperts();
  
  const results = matcher.findExperts(searchRequest);
  
  console.log(`✅ Found ${results.totalFound} matching experts`);
  
  // Возвращаем в формате, ожидаемом следующими нодами
  return results.experts.map(result => ({
    json: {
      id: result.expert.id,
      fields: {
        ...result.expert.fields,
        relevance_score: result.score,
        match_reasons: result.reasons.join(', '),
        why_recommended: result.reasons
      }
    }
  }));
}

// ФУНКЦИИ ИЗВЛЕЧЕНИЯ ПАРАМЕТРОВ
function extractDestination(trip) {
  const stops = trip.branch_multi_destination?.stops || [];
  if (stops.length > 0) {
    const mainStop = stops[0].name;
    const cityToCountry = {
      'Bangkok': 'Thailand',
      'Chiang Mai': 'Thailand', 
      'Krabi': 'Thailand',
      'Koh Lanta': 'Thailand'
    };
    return cityToCountry[mainStop] || mainStop;
  }
  return null;
}

function extractSpecificLocation(trip) {
  const stops = trip.branch_multi_destination?.stops || [];
  return stops.map(stop => stop.name).join(', ');
}

function extractActivities(trip) {
  const activities = trip.activities || [];
  return activities.map(activity => {
    return activity.replace(/🥾|🚶|🌊|🎨|🍷/g, '').trim();
  });
}

function extractTravelerType(trip) {
  return trip.party_type?.toLowerCase() || 'general';
}

function extractExperienceLevel(trip) {
  return trip.travel_style?.toLowerCase() || trip.fitness_level?.toLowerCase() || 'moderate';
}

// Запускаем поиск экспертов
return await findMatchingExperts();