// Автоматическая генерация тегов для экспертов Outdoorable
// Usage: node generate_expert_tags.js

const AIRTABLE_API_KEY = 'patt4GHq4ij1rNAdK.9b230d9e4002e265f7a89f6e208fd0d3145d1f495d66eb092252b8da7559da9d';
const AIRTABLE_BASE_ID = 'appO1KtZMgg8P4IiR';
const AIRTABLE_TABLE = 'Experts';

class ExpertTagGenerator {
  constructor() {
    this.countryMap = {
      'US': 'country_us', 'United States': 'country_us',
      'Canada': 'country_canada', 'BC': 'country_canada',
      'Indonesia': 'country_indonesia', 'Philippines': 'country_philippines',
      'Norway': 'country_norway', 'New Zealand': 'country_new_zealand',
      'Australia': 'country_australia', 'Peru': 'country_peru'
    };

    this.activityMap = {
      'scuba': 'activity_diving', 'dive': 'activity_diving', 'diving': 'activity_diving',
      'mountaineering': 'activity_mountaineering', 'climbing': 'activity_climbing',
      'skiing': 'activity_skiing', 'ski': 'activity_skiing',
      'hiking': 'activity_hiking', 'backpacking': 'activity_hiking',
      'canyon': 'activity_canyoning', 'desert': 'activity_desert'
    };

    this.travelerTypeMap = {
      'Solo travelers': 'traveler_solo',
      'Families with young kids': 'traveler_families',
      'Multi-generational groups': 'traveler_multigenerational', 
      'Travelers aged 60+': 'traveler_60plus',
      'First-time adventurers': 'traveler_beginners',
      'Extreme atheletes': 'traveler_extreme',
      'Extreme athletes': 'traveler_extreme'
    };

    this.languageMap = {
      'spanish': 'lang_spanish',
      'german': 'lang_german',
      'conversational spanish': 'lang_spanish'
    };

    this.levelMap = {
      'extreme': 'level_extreme', 'record': 'level_extreme',
      'beginner': 'level_beginner', 'first-time': 'level_beginner',
      'advanced': 'level_advanced', 'professional': 'level_advanced'
    };
  }

  // Извлечение тегов географии
  extractLocationTags(geoText) {
    if (!geoText) return [];
    
    const tags = new Set();
    const text = geoText.toLowerCase();

    // Теги стран
    Object.entries(this.countryMap).forEach(([key, tag]) => {
      if (text.includes(key.toLowerCase())) {
        tags.add(tag);
      }
    });

    // Специфические места
    const locations = [
      'grand canyon', 'mt rainier', 'yellowstone', 'yosemite',
      'utah', 'colorado', 'washington', 'california', 'alaska',
      'bali', 'lofoten', 'andes', 'patagonia'
    ];

    locations.forEach(location => {
      if (text.includes(location)) {
        tags.add(`dest_${location.replace(/\s+/g, '_')}`);
      }
    });

    return Array.from(tags);
  }

  // Извлечение тегов активностей и экспертизы
  extractActivityTags(expertiseText, bioText) {
    const tags = new Set();
    const combinedText = `${expertiseText || ''} ${bioText || ''}`.toLowerCase();

    // Теги активностей
    Object.entries(this.activityMap).forEach(([key, tag]) => {
      if (combinedText.includes(key)) {
        tags.add(tag);
      }
    });

    // Теги уровня сложности  
    Object.entries(this.levelMap).forEach(([key, tag]) => {
      if (combinedText.includes(key)) {
        tags.add(tag);
      }
    });

    // Теги специализации
    if (combinedText.includes('backcountry')) tags.add('expert_backcountry');
    if (combinedText.includes('underwater') || combinedText.includes('marine')) tags.add('expert_underwater');
    if (combinedText.includes('desert')) tags.add('expert_desert');
    if (combinedText.includes('guide')) tags.add('expert_guide');
    if (combinedText.includes('instructor') || combinedText.includes('educator')) tags.add('expert_instructor');

    return Array.from(tags);
  }

  // Извлечение тегов типов путешественников
  extractTravelerTags(travelerTypes) {
    if (!travelerTypes) return [];
    
    const tags = new Set();
    const types = Array.isArray(travelerTypes) ? travelerTypes : travelerTypes.split(',');

    types.forEach(type => {
      const cleanType = type.trim();
      if (this.travelerTypeMap[cleanType]) {
        tags.add(this.travelerTypeMap[cleanType]);
      }
    });

    return Array.from(tags);
  }

  // Извлечение тегов языков
  extractLanguageTags(languagesText) {
    if (!languagesText) return ['lang_english']; // По умолчанию английский
    
    const tags = new Set(['lang_english']); // Английский по умолчанию
    const text = languagesText.toLowerCase();

    Object.entries(this.languageMap).forEach(([key, tag]) => {
      if (text.includes(key)) {
        tags.add(tag);
      }
    });

    return Array.from(tags);
  }

  // Генерация всех тегов для одного эксперта
  generateTagsForExpert(expertRecord) {
    const fields = expertRecord.fields;
    
    const locationTags = this.extractLocationTags(fields.Geographic_areas_raw);
    const activityTags = this.extractActivityTags(fields.Professional_expertise_raw, fields.Short_Bio);
    const travelerTags = this.extractTravelerTags(fields.Traveler_types);
    const languageTags = this.extractLanguageTags(fields.Languages_raw);

    const allTags = [
      ...locationTags,
      ...activityTags, 
      ...travelerTags,
      ...languageTags
    ];

    return {
      expertId: expertRecord.id,
      expertName: fields.Name,
      tags: [...new Set(allTags)], // Убираем дубликаты
      tagString: [...new Set(allTags)].join(', ')
    };
  }

  // Основная функция для обработки всех экспертов
  async processAllExperts() {
    try {
      console.log('🚀 Запуск генерации тегов...');
      
      // Получаем всех экспертов
      const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}`, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`📊 Найдено ${data.records.length} экспертов`);

      // Генерируем теги для каждого эксперта
      const results = [];
      for (const record of data.records) {
        const expertTags = this.generateTagsForExpert(record);
        results.push(expertTags);
        
        console.log(`✅ ${expertTags.expertName}: ${expertTags.tags.length} тегов`);
        console.log(`   Tags: ${expertTags.tagString}`);
      }

      return results;

    } catch (error) {
      console.error('❌ Ошибка:', error);
      throw error;
    }
  }

  // Обновление записей в Airtable с тегами
  async updateExpertsWithTags(tagResults) {
    console.log('\n🔄 Обновление записей в Airtable...');

    for (const result of tagResults) {
      try {
        const updateData = {
          fields: {
            'Auto_Generated_Tags': result.tagString
          }
        };

        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}/${result.expertId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        if (response.ok) {
          console.log(`✅ Обновлен: ${result.expertName}`);
        } else {
          console.log(`❌ Ошибка обновления: ${result.expertName} (${response.status})`);
        }

        // Небольшая пауза между запросами
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`❌ Ошибка для ${result.expertName}:`, error);
      }
    }
  }
}

// Запуск генератора
async function main() {
  const generator = new ExpertTagGenerator();
  
  try {
    const results = await generator.processAllExperts();
    
    console.log('\n📋 СВОДКА ПО ТЕГАМ:');
    const allTags = [...new Set(results.flatMap(r => r.tags))].sort();
    console.log(`Всего уникальных тегов: ${allTags.length}`);
    console.log('Теги:', allTags.join(', '));

    // Раскомментировать для обновления Airtable:
    // await generator.updateExpertsWithTags(results);

  } catch (error) {
    console.error('Ошибка выполнения:', error);
  }
}

// Запуск только если файл выполняется напрямую
if (require.main === module) {
  main();
}

module.exports = ExpertTagGenerator;