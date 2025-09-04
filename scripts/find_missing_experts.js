// Поиск отсутствующих экспертов и их добавление

const AIRTABLE_API_KEY = 'patt4GHq4ij1rNAdK.9b230d9e4002e265f7a89f6e208fd0d3145d1f495d66eb092252b8da7559da9d';
const OLD_BASE_ID = 'appO1KtZMgg8P4IiR';
const OLD_TABLE_ID = 'Experts';
const NEW_BASE_ID = 'apptAJxE6IudBH8fW';
const NEW_TABLE_ID = 'tblgvgDuQm20rNVPV';

// Импортируем генератор тегов
const CategorizedTagsGenerator = require('./create_categorized_tags.js');

class MissingExpertsHandler {
  constructor() {
    this.tagsGenerator = new CategorizedTagsGenerator();
  }

  async getAllRecords(baseId, tableId) {
    let allRecords = [];
    let offset = null;

    do {
      const url = `https://api.airtable.com/v0/${baseId}/${tableId}${offset ? `?offset=${offset}` : ''}`;
      
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

  async findMissingExperts() {
    console.log('🔍 ПОИСК ОТСУТСТВУЮЩИХ ЭКСПЕРТОВ...\n');

    // Получаем экспертов из обеих таблиц
    const originalExperts = await this.getAllRecords(OLD_BASE_ID, OLD_TABLE_ID);
    const newExperts = await this.getAllRecords(NEW_BASE_ID, NEW_TABLE_ID);

    console.log(`📊 Оригинальная таблица: ${originalExperts.length} экспертов`);
    console.log(`📊 Новая таблица: ${newExperts.length} записей`);

    // Создаем множества имен
    const originalNames = new Set();
    const validOriginalExperts = [];
    
    originalExperts.forEach(expert => {
      const name = expert.fields.Name;
      if (name && name.trim()) {
        originalNames.add(name.trim());
        validOriginalExperts.push(expert);
      }
    });

    const newNames = new Set();
    newExperts.forEach(expert => {
      const name = expert.fields.Name;
      if (name && name.trim()) {
        newNames.add(name.trim());
      }
    });

    console.log(`📊 Валидных оригинальных экспертов: ${validOriginalExperts.length}`);
    console.log(`📊 Экспертов с именами в новой таблице: ${newNames.size}\n`);

    // Находим отсутствующих
    const missingExperts = [];
    validOriginalExperts.forEach(expert => {
      const name = expert.fields.Name?.trim();
      if (name && !newNames.has(name)) {
        missingExperts.push(expert);
      }
    });

    console.log(`❌ ОТСУТСТВУЮЩИХ ЭКСПЕРТОВ: ${missingExperts.length}\n`);

    if (missingExperts.length > 0) {
      console.log('📋 СПИСОК ОТСУТСТВУЮЩИХ ЭКСПЕРТОВ:');
      missingExperts.forEach((expert, index) => {
        console.log(`${index + 1}. ${expert.fields.Name}`);
      });
      console.log('');
    }

    return { missingExperts, validOriginalExperts };
  }

  // Добавление отсутствующих экспертов с тегами
  async addMissingExperts(missingExperts) {
    if (missingExperts.length === 0) {
      console.log('✅ Нет отсутствующих экспертов для добавления');
      return;
    }

    console.log(`➕ ДОБАВЛЕНИЕ ${missingExperts.length} ОТСУТСТВУЮЩИХ ЭКСПЕРТОВ...\n`);

    for (const expert of missingExperts) {
      try {
        // Генерируем теги для эксперта
        const expertTags = this.tagsGenerator.generateCategorizedTags(expert);
        
        // Объединяем все теги в All_Tags
        const allTagsArray = [];
        if (expertTags.locationTags) allTagsArray.push(...expertTags.locationTags.split(', ').filter(t => t));
        if (expertTags.activityTags) allTagsArray.push(...expertTags.activityTags.split(', ').filter(t => t));
        if (expertTags.travelerTags) allTagsArray.push(...expertTags.travelerTags.split(', ').filter(t => t));
        if (expertTags.expertiseTags) allTagsArray.push(...expertTags.expertiseTags.split(', ').filter(t => t));
        if (expertTags.languageTags) allTagsArray.push(...expertTags.languageTags.split(', ').filter(t => t));
        
        const allTags = [...new Set(allTagsArray)].sort();

        const fields = expert.fields;

        // Подготавливаем данные для записи
        const newRecord = {
          fields: {
            'Name': fields.Name || '',
            'Profession': fields.Profession || '',
            'Email': fields.Email || '',
            'Short_Bio': fields.Short_Bio || '',
            'Profile_URL': fields.Profile_URL || '',
            'What_drew_you_to_outdoors': fields.What_drew_you_to_outdoors || '',
            'Professional_expertise_raw': fields.Professional_expertise_raw || '',
            'Travel_types_experience': fields.Travel_types_experience || '',
            'Geographic_areas_raw': fields.Geographic_areas_raw || '',
            'Fav_outdoor_experiences': fields.Fav_outdoor_experiences || '',
            'Other_hobbies_interests': fields.Other_hobbies_interests || '',
            'Languages_raw': fields.Languages_raw || '',
            'Traveler_types': fields.Traveler_types || '',
            'Describe_you_select_all': fields.Describe_you_select_all || '',
            'Google_Drive_Image_URL': '', // Пустое поле для Google Drive
            'Location_Tags': expertTags.locationTags ? expertTags.locationTags.split(', ').filter(t => t) : [],
            'Activity_Tags': expertTags.activityTags ? expertTags.activityTags.split(', ').filter(t => t) : [],
            'Traveler_Tags': expertTags.travelerTags ? expertTags.travelerTags.split(', ').filter(t => t) : [],
            'Expertise_Tags': expertTags.expertiseTags ? expertTags.expertiseTags.split(', ').filter(t => t) : [],
            'Language_Tags': expertTags.languageTags ? expertTags.languageTags.split(', ').filter(t => t) : [],
            'All_Tags': allTags
          }
        };

        // Отправляем запрос на создание записи
        const response = await fetch(`https://api.airtable.com/v0/${NEW_BASE_ID}/${NEW_TABLE_ID}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newRecord)
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Добавлен: ${fields.Name} (ID: ${result.id})`);
        } else {
          const error = await response.text();
          console.log(`❌ Ошибка добавления ${fields.Name}: ${response.status} - ${error}`);
        }

        // Пауза между запросами
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error(`❌ Критическая ошибка для ${expert.fields.Name}:`, error);
      }
    }
  }
}

// Главная функция
async function main() {
  console.log('🎯 ПОИСК И ДОБАВЛЕНИЕ ОТСУТСТВУЮЩИХ ЭКСПЕРТОВ\n');
  
  const handler = new MissingExpertsHandler();
  
  try {
    const { missingExperts } = await handler.findMissingExperts();
    
    if (missingExperts.length > 0) {
      console.log('⚠️ Добавить отсутствующих экспертов в новую таблицу?');
      console.log('Раскомментируй строку ниже и запусти снова...\n');
      
      // Раскомментируй эту строку для добавления:
      // await handler.addMissingExperts(missingExperts);
    } else {
      console.log('🎉 Все эксперты уже находятся в новой таблице!');
    }

  } catch (error) {
    console.error('❌ Ошибка выполнения:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = MissingExpertsHandler;