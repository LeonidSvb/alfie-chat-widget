// Заполнение Multiple Select полей тегами для всех экспертов
// Используй после создания Multiple Select полей в Airtable

const AIRTABLE_API_KEY = 'patt4GHq4ij1rNAdK.9b230d9e4002e265f7a89f6e208fd0d3145d1f495d66eb092252b8da7559da9d';
const AIRTABLE_BASE_ID = 'appO1KtZMgg8P4IiR';
const AIRTABLE_TABLE = 'Experts';

// Импортируем класс генератора тегов
const CategorizedTagsGenerator = require('./create_categorized_tags.js');

class MultiSelectTagsPopulator {
  constructor() {
    this.categorizedGenerator = new CategorizedTagsGenerator();
  }

  // Преобразование строки тегов в массив для Multiple Select
  convertTagsToMultiSelectArray(tagString) {
    if (!tagString || tagString.trim() === '' || tagString === 'none') {
      return [];
    }
    
    return tagString.split(', ').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }

  // Обновление записи в Airtable с Multiple Select тегами
  async updateExpertWithMultiSelectTags(expertTags) {
    const updateData = {
      fields: {
        'Location_Tags': this.convertTagsToMultiSelectArray(expertTags.locationTags),
        'Activity_Tags': this.convertTagsToMultiSelectArray(expertTags.activityTags),
        'Traveler_Tags': this.convertTagsToMultiSelectArray(expertTags.travelerTags),
        'Expertise_Tags': this.convertTagsToMultiSelectArray(expertTags.expertiseTags),
        'Language_Tags': this.convertTagsToMultiSelectArray(expertTags.languageTags)
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
        const errorData = await response.json();
        return { 
          success: false, 
          expert: expertTags.expertName, 
          error: response.status,
          details: errorData
        };
      }

    } catch (error) {
      return { 
        success: false, 
        expert: expertTags.expertName, 
        error: 'Network Error',
        details: error.message 
      };
    }
  }

  // Основная функция заполнения
  async populateAllMultiSelectTags() {
    try {
      console.log('🚀 Заполнение Multiple Select тегов для всех экспертов...\n');
      
      // Генерируем теги для всех экспертов
      const categorizedResults = await this.categorizedGenerator.processAllExperts();
      
      console.log('🔄 Начинаем обновление Multiple Select полей...\n');

      let successCount = 0;
      let errorCount = 0;

      for (const [index, expertTags] of categorizedResults.entries()) {
        console.log(`[${index + 1}/${categorizedResults.length}] ${expertTags.expertName}`);
        
        // Показываем что будем записывать
        console.log(`   🌍 Locations: [${this.convertTagsToMultiSelectArray(expertTags.locationTags).length}] ${expertTags.locationTags || 'none'}`);
        console.log(`   🎯 Activities: [${this.convertTagsToMultiSelectArray(expertTags.activityTags).length}] ${expertTags.activityTags || 'none'}`);
        console.log(`   👥 Travelers: [${this.convertTagsToMultiSelectArray(expertTags.travelerTags).length}] ${expertTags.travelerTags || 'none'}`);
        console.log(`   🎓 Expertise: [${this.convertTagsToMultiSelectArray(expertTags.expertiseTags).length}] ${expertTags.expertiseTags || 'none'}`);
        console.log(`   🗣️ Languages: [${this.convertTagsToMultiSelectArray(expertTags.languageTags).length}] ${expertTags.languageTags || 'none'}`);
        
        const updateResult = await this.updateExpertWithMultiSelectTags(expertTags);
        
        if (updateResult.success) {
          successCount++;
          console.log(`   ✅ Успешно обновлен\n`);
        } else {
          errorCount++;
          console.log(`   ❌ Ошибка: ${updateResult.error}`);
          if (updateResult.details) {
            console.log(`   📝 Детали: ${JSON.stringify(updateResult.details, null, 2)}`);
          }
          console.log('');
        }
        
        // Пауза между запросами для избежания rate limiting
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      console.log('📋 ИТОГОВАЯ СТАТИСТИКА:');
      console.log(`✅ Успешно обновлено: ${successCount}`);
      console.log(`❌ Ошибок: ${errorCount}`);
      console.log(`📊 Всего экспертов: ${categorizedResults.length}`);

      if (errorCount > 0) {
        console.log('\n🔍 ВОЗМОЖНЫЕ ПРИЧИНЫ ОШИБОК:');
        console.log('1. Multiple Select поля не созданы в Airtable');
        console.log('2. Неправильные названия полей (должны быть: Location_Tags, Activity_Tags, etc.)');
        console.log('3. Не все опции добавлены в Multiple Select поля');
        console.log('4. Проблемы с правами доступа к API');
      }

      return { successCount, errorCount, total: categorizedResults.length };

    } catch (error) {
      console.error('❌ Критическая ошибка:', error);
      throw error;
    }
  }

  // Показ всех уникальных тегов для создания опций в Airtable
  async showAllUniqueTagsForSetup() {
    console.log('📋 ВСЕ УНИКАЛЬНЫЕ ТЕГИ ДЛЯ НАСТРОЙКИ MULTIPLE SELECT ПОЛЕЙ\n');
    
    const categorizedResults = await this.categorizedGenerator.processAllExperts();
    
    const categories = {
      'Location_Tags': new Set(),
      'Activity_Tags': new Set(),
      'Traveler_Tags': new Set(),
      'Expertise_Tags': new Set(),
      'Language_Tags': new Set()
    };

    // Собираем все уникальные теги
    categorizedResults.forEach(result => {
      if (result.locationTags && result.locationTags !== 'none') {
        result.locationTags.split(', ').forEach(tag => categories['Location_Tags'].add(tag.trim()));
      }
      if (result.activityTags && result.activityTags !== 'none') {
        result.activityTags.split(', ').forEach(tag => categories['Activity_Tags'].add(tag.trim()));
      }
      if (result.travelerTags && result.travelerTags !== 'none') {
        result.travelerTags.split(', ').forEach(tag => categories['Traveler_Tags'].add(tag.trim()));
      }
      if (result.expertiseTags && result.expertiseTags !== 'none') {
        result.expertiseTags.split(', ').forEach(tag => categories['Expertise_Tags'].add(tag.trim()));
      }
      if (result.languageTags && result.languageTags !== 'none') {
        result.languageTags.split(', ').forEach(tag => categories['Language_Tags'].add(tag.trim()));
      }
    });

    // Выводим списки для каждой категории
    Object.entries(categories).forEach(([category, tagSet]) => {
      const sortedTags = Array.from(tagSet).sort();
      console.log(`🏷️ ${category}: ${sortedTags.length} опций`);
      console.log(`${sortedTags.join('\n')}\n`);
    });

    console.log('📋 Скопируй эти списки для создания опций в Multiple Select полях Airtable');
  }
}

// Запуск
async function main() {
  console.log('🎯 ЗАПОЛНЕНИЕ MULTIPLE SELECT ТЕГОВ\n');
  
  const populator = new MultiSelectTagsPopulator();
  
  // Проверяем аргументы командной строки
  const args = process.argv.slice(2);
  
  if (args.includes('--show-tags')) {
    // Показать все уникальные теги для создания опций
    try {
      await populator.showAllUniqueTagsForSetup();
    } catch (error) {
      console.error('❌ Ошибка при показе тегов:', error);
    }
  } else {
    // Заполнить теги
    console.log('⚠️  УБЕДИСЬ, ЧТО В AIRTABLE:');
    console.log('1. Созданы 5 Multiple Select полей: Location_Tags, Activity_Tags, Traveler_Tags, Expertise_Tags, Language_Tags');
    console.log('2. Во всех полях добавлены соответствующие опции');
    console.log('3. Запусти с флагом --show-tags чтобы увидеть все нужные опции\n');
    console.log('📝 Команда для показа тегов: node scripts/populate_multiselect_tags.js --show-tags\n');

    try {
      await populator.populateAllMultiSelectTags();
    } catch (error) {
      console.error('❌ Ошибка выполнения:', error);
    }
  }
}

// Запуск только если файл выполняется напрямую
if (require.main === module) {
  main();
}

module.exports = MultiSelectTagsPopulator;