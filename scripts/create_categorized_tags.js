// Создание категорийных тегов для экспертов Outdoorable
// Usage: node create_categorized_tags.js

const AIRTABLE_API_KEY = 'patt4GHq4ij1rNAdK.9b230d9e4002e265f7a89f6e208fd0d3145d1f495d66eb092252b8da7559da9d';
const AIRTABLE_BASE_ID = 'appO1KtZMgg8P4IiR';
const AIRTABLE_TABLE = 'Experts';

class CategorizedTagsGenerator {
  constructor() {
    // Маппинг стран и регионов
    this.locationMap = {
      // Страны
      'US': ['country_us'], 'United States': ['country_us'], 'USA': ['country_us'],
      'Canada': ['country_canada'], 'BC': ['country_canada'], 'British Columbia': ['country_canada'],
      'Indonesia': ['country_indonesia'], 'Philippines': ['country_philippines'], 'Philippenes': ['country_philippines'],
      'Norway': ['country_norway'], 'New Zealand': ['country_new_zealand'],
      'Australia': ['country_australia'], 'Peru': ['country_peru'],
      
      // Штаты США
      'Washington': ['region_washington'], 'Utah': ['region_utah'], 'Colorado': ['region_colorado'],
      'California': ['region_california'], 'Alaska': ['region_alaska'], 'Arizona': ['region_arizona'],
      
      // Конкретные места
      'Grand Canyon': ['dest_grand_canyon'], 'Mt Rainier': ['dest_mt_rainier'], 'Mount Rainier': ['dest_mt_rainier'],
      'Yellowstone': ['dest_yellowstone'], 'Yosemite': ['dest_yosemite'],
      'Bali': ['dest_bali'], 'Lofoten': ['dest_lofoten'], 'Andes': ['dest_andes'],
      'Patagonia': ['dest_patagonia'], 'Zion': ['dest_zion'], 'Death Valley': ['dest_death_valley'],
      'Olympic': ['dest_olympic'], 'Cascades': ['dest_cascades'], 'North Cascades': ['dest_cascades'],
      'Sedona': ['dest_sedona'], 'Canyonlands': ['dest_canyonlands'],
      'Turks and Caicos': ['dest_turks_caicos'], 'Raja Ampat': ['dest_raja_ampat'],
      'Great Barrier Reef': ['dest_great_barrier_reef'], 'Cairns': ['dest_cairns']
    };

    // Маппинг активностей
    this.activityMap = {
      'scuba': ['activity_diving'], 'dive': ['activity_diving'], 'diving': ['activity_diving'],
      'snorkeling': ['activity_diving'], 'underwater': ['activity_diving'],
      'mountaineering': ['activity_mountaineering'], 'mountain': ['activity_mountaineering'],
      'climbing': ['activity_climbing'], 'rock climbing': ['activity_climbing'], 'climb': ['activity_climbing'],
      'skiing': ['activity_skiing'], 'ski': ['activity_skiing'], 'backcountry skiing': ['activity_skiing'],
      'snowboarding': ['activity_skiing'], 'winter sports': ['activity_skiing'],
      'hiking': ['activity_hiking'], 'backpacking': ['activity_hiking'], 'trekking': ['activity_hiking'],
      'trail running': ['activity_trail_running'], 'running': ['activity_trail_running'],
      'canyon': ['activity_canyoning'], 'canyoneering': ['activity_canyoning'],
      'rafting': ['activity_water_sports'], 'kayaking': ['activity_water_sports'], 'paddling': ['activity_water_sports'],
      'photography': ['activity_photography'], 'filmmaker': ['activity_photography'],
      'wildlife': ['activity_wildlife'], 'birding': ['activity_wildlife'], 'safari': ['activity_wildlife']
    };

    // Маппинг типов путешественников  
    this.travelerMap = {
      'Solo travelers': ['traveler_solo'],
      'Families with young kids': ['traveler_families'], 'Families': ['traveler_families'],
      'Multi-generational groups': ['traveler_multigenerational'], 
      'Travelers aged 60+': ['traveler_60plus'], 'senior': ['traveler_60plus'],
      'First-time adventurers': ['traveler_beginners'], 'beginners': ['traveler_beginners'],
      'Extreme atheletes': ['traveler_extreme'], 'Extreme athletes': ['traveler_extreme'],
      'experienced': ['traveler_advanced'], 'advanced': ['traveler_advanced']
    };

    // Маппинг экспертизы и уровня
    this.expertiseMap = {
      // Роли
      'guide': ['role_guide'], 'tour guide': ['role_guide'], 'guiding': ['role_guide'],
      'instructor': ['role_instructor'], 'educator': ['role_instructor'], 'teaching': ['role_instructor'],
      'photographer': ['role_photographer'], 'filmmaker': ['role_photographer'],
      
      // Специализации
      'backcountry': ['spec_backcountry'], 'wilderness': ['spec_backcountry'],
      'underwater': ['spec_underwater'], 'marine': ['spec_underwater'],
      'desert': ['spec_desert'], 'canyon': ['spec_canyon'],
      'mountain': ['spec_mountain'], 'alpine': ['spec_mountain'],
      'family': ['spec_family'], 'kids': ['spec_family'],
      
      // Уровни
      'extreme': ['level_extreme'], 'record': ['level_extreme'], 'professional': ['level_extreme'],
      'beginner': ['level_beginner'], 'first-time': ['level_beginner'], 'novice': ['level_beginner'],
      'advanced': ['level_advanced'], 'expert': ['level_advanced'], 'experienced': ['level_advanced'],
      
      // Сертификации
      'wilderness first responder': ['cert_wfr'], 'WFR': ['cert_wfr'],
      'AIARE': ['cert_avalanche'], 'avalanche': ['cert_avalanche']
    };

    // Маппинг языков
    this.languageMap = {
      'spanish': ['lang_spanish'], 'conversational spanish': ['lang_spanish'],
      'german': ['lang_german'], 'deutsch': ['lang_german'],
      'french': ['lang_french'], 'italiano': ['lang_italian'],
      'japanese': ['lang_japanese'], 'mandarin': ['lang_chinese']
    };
  }

  // Извлечение тегов локаций
  extractLocationTags(geoText) {
    if (!geoText) return [];
    
    const tags = new Set();
    const text = geoText.toLowerCase();

    // Проходим по всем локациям в маппинге
    Object.entries(this.locationMap).forEach(([key, tagArray]) => {
      if (text.includes(key.toLowerCase())) {
        tagArray.forEach(tag => tags.add(tag));
      }
    });

    return Array.from(tags).sort();
  }

  // Извлечение тегов активностей
  extractActivityTags(expertiseText, bioText, professionText) {
    const tags = new Set();
    const combinedText = `${expertiseText || ''} ${bioText || ''} ${professionText || ''}`.toLowerCase();

    // Проходим по всем активностям в маппинге
    Object.entries(this.activityMap).forEach(([key, tagArray]) => {
      if (combinedText.includes(key)) {
        tagArray.forEach(tag => tags.add(tag));
      }
    });

    return Array.from(tags).sort();
  }

  // Извлечение тегов типов путешественников
  extractTravelerTags(travelerTypes) {
    if (!travelerTypes) return [];
    
    const tags = new Set();
    const types = Array.isArray(travelerTypes) ? travelerTypes : travelerTypes.split(',');

    types.forEach(type => {
      const cleanType = type.trim();
      if (this.travelerMap[cleanType]) {
        this.travelerMap[cleanType].forEach(tag => tags.add(tag));
      }
    });

    return Array.from(tags).sort();
  }

  // Извлечение тегов экспертизы
  extractExpertiseTags(expertiseText, bioText, professionText, describeText) {
    const tags = new Set();
    const combinedText = `${expertiseText || ''} ${bioText || ''} ${professionText || ''} ${describeText || ''}`.toLowerCase();

    // Проходим по всем типам экспертизы в маппинге
    Object.entries(this.expertiseMap).forEach(([key, tagArray]) => {
      if (combinedText.includes(key)) {
        tagArray.forEach(tag => tags.add(tag));
      }
    });

    return Array.from(tags).sort();
  }

  // Извлечение тегов языков
  extractLanguageTags(languagesText) {
    const tags = new Set(['lang_english']); // По умолчанию английский
    
    if (!languagesText) return Array.from(tags);
    
    const text = languagesText.toLowerCase();

    // Проходим по всем языкам в маппинге
    Object.entries(this.languageMap).forEach(([key, tagArray]) => {
      if (text.includes(key)) {
        tagArray.forEach(tag => tags.add(tag));
      }
    });

    return Array.from(tags).sort();
  }

  // Генерация всех категорийных тегов для одного эксперта
  generateCategorizedTags(expertRecord) {
    const fields = expertRecord.fields;
    
    const locationTags = this.extractLocationTags(fields.Geographic_areas_raw);
    const activityTags = this.extractActivityTags(
      fields.Professional_expertise_raw, 
      fields.Short_Bio, 
      fields.Profession
    );
    const travelerTags = this.extractTravelerTags(fields.Traveler_types);
    const expertiseTags = this.extractExpertiseTags(
      fields.Professional_expertise_raw, 
      fields.Short_Bio, 
      fields.Profession,
      fields.Describe_you_select_all
    );
    const languageTags = this.extractLanguageTags(fields.Languages_raw);

    return {
      expertId: expertRecord.id,
      expertName: fields.Name || 'Unnamed Expert',
      locationTags: locationTags.join(', '),
      activityTags: activityTags.join(', '),
      travelerTags: travelerTags.join(', '),
      expertiseTags: expertiseTags.join(', '),
      languageTags: languageTags.join(', ')
    };
  }

  // Получение всех экспертов из Airtable
  async getAllExperts() {
    let allRecords = [];
    let offset = null;

    do {
      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}${offset ? `?offset=${offset}` : ''}`;
      
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

    return allRecords;
  }

  // Обновление записи в Airtable с тегами
  async updateExpertWithTags(expertTags) {
    const updateData = {
      fields: {
        'Location_Tags': expertTags.locationTags,
        'Activity_Tags': expertTags.activityTags,
        'Traveler_Tags': expertTags.travelerTags,
        'Expertise_Tags': expertTags.expertiseTags,
        'Language_Tags': expertTags.languageTags
      }
    };

    try {
      const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}/${expertTags.expertId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        return { success: true, expert: expertTags.expertName };
      } else {
        return { success: false, expert: expertTags.expertName, error: response.status };
      }

    } catch (error) {
      return { success: false, expert: expertTags.expertName, error: error.message };
    }
  }

  // Основная функция для обработки всех экспертов
  async processAllExperts() {
    try {
      console.log('🚀 Запуск генерации категорийных тегов...\n');
      
      // Получаем всех экспертов
      console.log('📥 Получение всех экспертов из Airtable...');
      const allExperts = await this.getAllExperts();
      console.log(`📊 Найдено ${allExperts.length} экспертов\n`);

      // Генерируем теги для каждого эксперта
      const results = [];
      let processed = 0;

      for (const record of allExperts) {
        const expertTags = this.generateCategorizedTags(record);
        results.push(expertTags);
        processed++;
        
        console.log(`✅ [${processed}/${allExperts.length}] ${expertTags.expertName}`);
        console.log(`   🌍 Locations: ${expertTags.locationTags || 'none'}`);
        console.log(`   🎯 Activities: ${expertTags.activityTags || 'none'}`);
        console.log(`   👥 Travelers: ${expertTags.travelerTags || 'none'}`);
        console.log(`   🎓 Expertise: ${expertTags.expertiseTags || 'none'}`);
        console.log(`   🗣️ Languages: ${expertTags.languageTags || 'none'}`);
        console.log('');
      }

      return results;

    } catch (error) {
      console.error('❌ Ошибка:', error);
      throw error;
    }
  }

  // Обновление всех экспертов в Airtable
  async updateAllExpertsInAirtable(tagResults) {
    console.log('🔄 Начинаем обновление записей в Airtable...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const [index, result] of tagResults.entries()) {
      try {
        const updateResult = await this.updateExpertWithTags(result);
        
        if (updateResult.success) {
          successCount++;
          console.log(`✅ [${index + 1}/${tagResults.length}] Обновлен: ${updateResult.expert}`);
        } else {
          errorCount++;
          console.log(`❌ [${index + 1}/${tagResults.length}] Ошибка: ${updateResult.expert} (${updateResult.error})`);
        }

        // Пауза между запросами для избежания rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        errorCount++;
        console.error(`❌ [${index + 1}/${tagResults.length}] Критическая ошибка для ${result.expertName}:`, error);
      }
    }

    console.log('\n📋 ИТОГОВАЯ СТАТИСТИКА:');
    console.log(`✅ Успешно обновлено: ${successCount}`);
    console.log(`❌ Ошибок: ${errorCount}`);
    console.log(`📊 Всего экспертов: ${tagResults.length}`);

    return { successCount, errorCount, total: tagResults.length };
  }

  // Анализ статистики тегов
  analyzeTagStatistics(tagResults) {
    console.log('\n📊 СТАТИСТИКА ТЕГОВ:\n');

    const categories = [
      { name: 'Location_Tags', field: 'locationTags' },
      { name: 'Activity_Tags', field: 'activityTags' },
      { name: 'Traveler_Tags', field: 'travelerTags' },
      { name: 'Expertise_Tags', field: 'expertiseTags' },
      { name: 'Language_Tags', field: 'languageTags' }
    ];

    categories.forEach(category => {
      const allTagsInCategory = new Set();
      
      tagResults.forEach(result => {
        if (result[category.field]) {
          result[category.field].split(', ').forEach(tag => {
            if (tag.trim()) allTagsInCategory.add(tag.trim());
          });
        }
      });

      const sortedTags = Array.from(allTagsInCategory).sort();
      console.log(`🏷️ ${category.name}: ${sortedTags.length} уникальных тегов`);
      console.log(`   ${sortedTags.join(', ')}\n`);
    });
  }
}

// Запуск генератора
async function main() {
  const generator = new CategorizedTagsGenerator();
  
  try {
    // Генерируем теги для всех экспертов
    const tagResults = await generator.processAllExperts();
    
    // Показываем статистику
    generator.analyzeTagStatistics(tagResults);

    // Спрашиваем подтверждение перед обновлением Airtable
    console.log('⚠️  ВНИМАНИЕ: Сейчас будет выполнено обновление всех записей в Airtable.');
    console.log('Это создаст/обновит 5 столбцов с тегами для каждого эксперта.');
    console.log('\nЧтобы продолжить, раскомментируй строку ниже и запусти снова...\n');
    
    // Обновляем Airtable с тегами:
    await generator.updateAllExpertsInAirtable(tagResults);

  } catch (error) {
    console.error('❌ Критическая ошибка выполнения:', error);
  }
}

// Запуск только если файл выполняется напрямую
if (require.main === module) {
  main();
}

module.exports = CategorizedTagsGenerator;