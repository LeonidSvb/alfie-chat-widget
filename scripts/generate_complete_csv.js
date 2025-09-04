// Генерация полного CSV файла со всеми экспертами и тегами
// Использует данные из Airtable + CSV файл с Google Drive ссылками

const fs = require('fs');
const path = require('path');

const AIRTABLE_API_KEY = 'patt4GHq4ij1rNAdK.9b230d9e4002e265f7a89f6e208fd0d3145d1f495d66eb092252b8da7559da9d';
const AIRTABLE_BASE_ID = 'appO1KtZMgg8P4IiR';
const AIRTABLE_TABLE = 'Experts';

// Импортируем генератор тегов
const CategorizedTagsGenerator = require('./create_categorized_tags.js');

class CompleteCSVGenerator {
  constructor() {
    this.tagsGenerator = new CategorizedTagsGenerator();
    this.googleDriveData = null;
  }

  // Чтение CSV файла с Google Drive ссылками
  parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    const headers = this.parseCSVLine(lines[0]);
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = this.parseCSVLine(lines[i]);
      const record = {};
      
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      
      data.push(record);
    }

    return data;
  }

  // Простой парсер CSV строк (учитывает кавычки)
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  // Загрузка данных из CSV файла
  async loadGoogleDriveData() {
    try {
      const csvPath = 'C:\\Users\\79818\\Downloads\\Copy of Alfie Expert Master - Experts import.csv';
      console.log('📥 Читаем CSV файл с Google Drive ссылками...');
      
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      this.googleDriveData = this.parseCSV(csvContent);
      
      console.log(`✅ Загружено ${this.googleDriveData.length} записей из CSV`);
      
      // Показать первые несколько записей для проверки
      console.log('\n📋 Первые 3 записи из CSV:');
      this.googleDriveData.slice(0, 3).forEach((record, index) => {
        const name = record['What is your full name?'] || '';
        const url = record['URL'] || '';
        if (name) { // Показывать только записи с именами
          console.log(`${index + 1}. Name: "${name}", URL: "${url}"`);
        }
      });
      
      return true;
    } catch (error) {
      console.error('❌ Ошибка чтения CSV файла:', error.message);
      return false;
    }
  }

  // Поиск Google Drive URL по имени эксперта
  findGoogleDriveURL(expertName) {
    if (!this.googleDriveData || !expertName) return '';
    
    // Очищаем имя эксперта
    const cleanExpertName = expertName.trim();
    
    for (const record of this.googleDriveData) {
      const csvName = (record['What is your full name?'] || '').trim();
      
      // Пропускаем пустые записи
      if (!csvName) continue;
      
      // Точное совпадение
      if (csvName === cleanExpertName) {
        return record['URL'] || '';
      }
      
      // Совпадение без учета регистра
      if (csvName.toLowerCase() === cleanExpertName.toLowerCase()) {
        return record['URL'] || '';
      }
      
      // Частичное совпадение для случаев типа "John Smith" vs "John D. Smith"
      const csvParts = csvName.toLowerCase().split(' ');
      const expertParts = cleanExpertName.toLowerCase().split(' ');
      
      // Проверяем, что первое и последнее имена совпадают
      if (csvParts.length >= 2 && expertParts.length >= 2) {
        const csvFirst = csvParts[0];
        const csvLast = csvParts[csvParts.length - 1];
        const expertFirst = expertParts[0];
        const expertLast = expertParts[expertParts.length - 1];
        
        if (csvFirst === expertFirst && csvLast === expertLast) {
          return record['URL'] || '';
        }
      }
    }
    
    return '';
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

  // Экранирование значений для CSV
  escapeCSVValue(value) {
    if (value === null || value === undefined) return '';
    
    const stringValue = String(value);
    
    // Если содержит запятые, кавычки или переносы строк - оборачиваем в кавычки
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      // Дублируем кавычки внутри значения
      const escapedValue = stringValue.replace(/"/g, '""');
      return `"${escapedValue}"`;
    }
    
    return stringValue;
  }

  // Генерация полного CSV файла
  async generateCompleteCSV() {
    try {
      console.log('🚀 Запуск генерации полного CSV файла...\n');
      
      // Загружаем данные из CSV файла с Google Drive ссылками
      const csvLoaded = await this.loadGoogleDriveData();
      if (!csvLoaded) {
        throw new Error('Не удалось загрузить CSV файл');
      }

      // Получаем всех экспертов из Airtable
      console.log('📥 Получение экспертов из Airtable...');
      const allExperts = await this.getAllExperts();
      console.log(`✅ Получено ${allExperts.length} экспертов из Airtable\n`);

      // Генерируем теги для каждого эксперта
      console.log('🏷️ Генерация тегов для всех экспертов...');
      const expertTagsResults = [];
      
      for (const [index, expert] of allExperts.entries()) {
        const expertTags = this.tagsGenerator.generateCategorizedTags(expert);
        expertTagsResults.push(expertTags);
        
        if ((index + 1) % 10 === 0) {
          console.log(`   ✅ Обработано ${index + 1}/${allExperts.length} экспертов`);
        }
      }
      
      console.log(`✅ Теги сгенерированы для всех ${expertTagsResults.length} экспертов\n`);

      // Создаем CSV контент
      console.log('📝 Создание CSV файла...');
      
      const headers = [
        'Name', 'Profession', 'Email', 'Short_Bio', 'Profile_URL',
        'What_drew_you_to_outdoors', 'Professional_expertise_raw', 
        'Travel_types_experience', 'Geographic_areas_raw',
        'Fav_outdoor_experiences', 'Other_hobbies_interests', 
        'Languages_raw', 'Traveler_types', 'Describe_you_select_all',
        'Google_Drive_Image_URL', 'Location_Tags', 'Activity_Tags',
        'Traveler_Tags', 'Expertise_Tags', 'Language_Tags', 'All_Tags'
      ];

      let csvContent = headers.join(',') + '\n';

      let processedCount = 0;
      let foundImageUrls = 0;

      for (const expertTags of expertTagsResults) {
        const expert = allExperts.find(e => e.id === expertTags.expertId);
        if (!expert) continue;

        const fields = expert.fields;
        const googleDriveURL = this.findGoogleDriveURL(fields.Name);
        
        if (googleDriveURL) {
          foundImageUrls++;
        }

        // Объединяем все теги в одну строку для All_Tags
        const allTagsArray = [];
        if (expertTags.locationTags) allTagsArray.push(...expertTags.locationTags.split(', ').filter(t => t));
        if (expertTags.activityTags) allTagsArray.push(...expertTags.activityTags.split(', ').filter(t => t));
        if (expertTags.travelerTags) allTagsArray.push(...expertTags.travelerTags.split(', ').filter(t => t));
        if (expertTags.expertiseTags) allTagsArray.push(...expertTags.expertiseTags.split(', ').filter(t => t));
        if (expertTags.languageTags) allTagsArray.push(...expertTags.languageTags.split(', ').filter(t => t));
        
        const allTags = [...new Set(allTagsArray)].sort().join(',');

        const row = [
          fields.Name || '',
          fields.Profession || '',
          fields.Email || '',
          fields.Short_Bio || '',
          fields.Profile_URL || '',
          fields.What_drew_you_to_outdoors || '',
          fields.Professional_expertise_raw || '',
          fields.Travel_types_experience || '',
          fields.Geographic_areas_raw || '',
          fields.Fav_outdoor_experiences || '',
          fields.Other_hobbies_interests || '',
          fields.Languages_raw || '',
          fields.Traveler_types || '',
          fields.Describe_you_select_all || '',
          googleDriveURL,
          expertTags.locationTags || '',
          expertTags.activityTags || '',
          expertTags.travelerTags || '',
          expertTags.expertiseTags || '',
          expertTags.languageTags || '',
          allTags
        ].map(value => this.escapeCSVValue(value));

        csvContent += row.join(',') + '\n';
        processedCount++;
      }

      // Сохраняем CSV файл
      const outputPath = path.join(process.cwd(), 'complete_experts_with_tags.csv');
      fs.writeFileSync(outputPath, csvContent, 'utf-8');

      console.log('✅ CSV файл успешно создан!\n');
      console.log('📊 СТАТИСТИКА:');
      console.log(`📋 Всего экспертов: ${processedCount}`);
      console.log(`🖼️ Найдено изображений: ${foundImageUrls}`);
      console.log(`📂 Файл сохранен: ${outputPath}`);
      
      // Показываем несколько примеров экспертов без изображений
      const expertsWithoutImages = expertTagsResults
        .map(expertTags => {
          const expert = allExperts.find(e => e.id === expertTags.expertId);
          return {
            name: expert?.fields?.Name || 'Unknown',
            hasImage: !!this.findGoogleDriveURL(expert?.fields?.Name)
          };
        })
        .filter(e => !e.hasImage)
        .slice(0, 5);

      if (expertsWithoutImages.length > 0) {
        console.log('\n⚠️ Примеры экспертов без найденных изображений:');
        expertsWithoutImages.forEach((expert, index) => {
          console.log(`${index + 1}. ${expert.name}`);
        });
      }

      return outputPath;

    } catch (error) {
      console.error('❌ Критическая ошибка:', error);
      throw error;
    }
  }
}

// Запуск генератора
async function main() {
  console.log('🎯 ГЕНЕРАЦИЯ ПОЛНОГО CSV С ТЕГАМИ И ИЗОБРАЖЕНИЯМИ\n');
  
  const generator = new CompleteCSVGenerator();
  
  try {
    const outputPath = await generator.generateCompleteCSV();
    console.log(`\n🎉 Готово! Файл создан: ${outputPath}`);
    console.log('\n📋 СЛЕДУЮЩИЕ ШАГИ:');
    console.log('1. Открой созданный CSV файл для проверки');
    console.log('2. Создай новую таблицу в Airtable');
    console.log('3. Импортируй CSV в новую таблицу');
    console.log('4. Настрой типы полей (Multiple select для тегов)');
  } catch (error) {
    console.error('❌ Ошибка выполнения:', error);
  }
}

// Запуск только если файл выполняется напрямую
if (require.main === module) {
  main();
}

module.exports = CompleteCSVGenerator;