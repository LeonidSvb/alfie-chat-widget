// Альтернативный подход: все теги в одном поле "All_Tags"
// Используй этот скрипт, если не хочешь создавать 5 отдельных столбцов

const AIRTABLE_API_KEY = 'patt4GHq4ij1rNAdK.9b230d9e4002e265f7a89f6e208fd0d3145d1f495d66eb092252b8da7559da9d';
const AIRTABLE_BASE_ID = 'appO1KtZMgg8P4IiR';
const AIRTABLE_TABLE = 'Experts';

// Импортируем класс генератора тегов
const CategorizedTagsGenerator = require('./create_categorized_tags.js');

class SingleFieldTagsGenerator {
  constructor() {
    this.categorizedGenerator = new CategorizedTagsGenerator();
  }

  // Объединение всех тегов в одну строку с префиксами
  combineAllTags(expertTags) {
    const allTags = [];

    // Добавляем теги с префиксами для категорий
    if (expertTags.locationTags) {
      allTags.push(...expertTags.locationTags.split(', ').filter(t => t));
    }
    if (expertTags.activityTags) {
      allTags.push(...expertTags.activityTags.split(', ').filter(t => t));
    }
    if (expertTags.travelerTags) {
      allTags.push(...expertTags.travelerTags.split(', ').filter(t => t));
    }
    if (expertTags.expertiseTags) {
      allTags.push(...expertTags.expertiseTags.split(', ').filter(t => t));
    }
    if (expertTags.languageTags) {
      allTags.push(...expertTags.languageTags.split(', ').filter(t => t));
    }

    return [...new Set(allTags)].sort().join(', ');
  }

  // Обновление записи в Airtable с объединенными тегами
  async updateExpertWithAllTags(expertTags, allTagsString) {
    const updateData = {
      fields: {
        'All_Tags': allTagsString
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
        const errorText = await response.text();
        return { success: false, expert: expertTags.expertName, error: response.status, details: errorText };
      }

    } catch (error) {
      return { success: false, expert: expertTags.expertName, error: error.message };
    }
  }

  // Основная функция
  async processAllExpertsToSingleField() {
    try {
      console.log('🚀 Запуск генерации тегов в одно поле All_Tags...\n');
      
      // Используем логику из основного генератора
      const categorizedResults = await this.categorizedGenerator.processAllExperts();
      
      console.log('🔄 Объединение всех тегов в одно поле...\n');

      let successCount = 0;
      let errorCount = 0;

      for (const [index, expertTags] of categorizedResults.entries()) {
        const allTagsString = this.combineAllTags(expertTags);
        
        console.log(`[${index + 1}/${categorizedResults.length}] ${expertTags.expertName}`);
        console.log(`   📋 All Tags: ${allTagsString}\n`);
        
        const updateResult = await this.updateExpertWithAllTags(expertTags, allTagsString);
        
        if (updateResult.success) {
          successCount++;
          console.log(`   ✅ Обновлен успешно`);
        } else {
          errorCount++;
          console.log(`   ❌ Ошибка: ${updateResult.error}`);
          if (updateResult.details) {
            console.log(`   📝 Детали: ${updateResult.details}`);
          }
        }
        
        console.log('');
        
        // Пауза между запросами
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log('📋 ИТОГОВАЯ СТАТИСТИКА:');
      console.log(`✅ Успешно обновлено: ${successCount}`);
      console.log(`❌ Ошибок: ${errorCount}`);
      console.log(`📊 Всего экспертов: ${categorizedResults.length}`);

      return { successCount, errorCount, total: categorizedResults.length };

    } catch (error) {
      console.error('❌ Критическая ошибка:', error);
      throw error;
    }
  }
}

// Запуск
async function main() {
  console.log('🎯 АЛЬТЕРНАТИВНЫЙ ПОДХОД: Все теги в одном поле "All_Tags"\n');
  console.log('📝 Инструкция:');
  console.log('1. Открой Airtable: https://airtable.com/appO1KtZMgg8P4IiR');
  console.log('2. Добавь новый столбец "All_Tags" (тип: Single line text)');
  console.log('3. Запусти этот скрипт\n');
  console.log('⚠️  Если столбец "All_Tags" не существует, будет ошибка 422.\n');

  const generator = new SingleFieldTagsGenerator();
  
  try {
    await generator.processAllExpertsToSingleField();
  } catch (error) {
    console.error('❌ Ошибка выполнения:', error);
  }
}

// Запуск только если файл выполняется напрямую
if (require.main === module) {
  main();
}

module.exports = SingleFieldTagsGenerator;