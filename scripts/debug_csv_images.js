// Отладка поиска изображений в CSV файле
const fs = require('fs');

function parseCSVLine(line) {
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

function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = parseCSVLine(lines[0]);
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    
    const values = parseCSVLine(lines[i]);
    const record = {};
    
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    
    if (record['What is your full name?'] && record['What is your full name?'].trim() !== '') {
      data.push(record);
    }
  }

  return { headers, data };
}

// Анализ CSV файла
const csvPath = 'C:\\Users\\79818\\Downloads\\Copy of Alfie Expert Master - Experts import.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const { headers, data } = parseCSV(csvContent);

console.log('📋 АНАЛИЗ CSV ФАЙЛА С GOOGLE DRIVE');
console.log(`📊 Всего записей с именами: ${data.length}`);
console.log(`📂 Заголовки: ${headers.join(', ')}\n`);

// Найти записи с Google Drive URL
const expertsWithImages = data.filter(record => {
  const url = record['URL'] || '';
  return url.includes('drive.google.com');
});

console.log(`🖼️ Записей с Google Drive URL: ${expertsWithImages.length}\n`);

if (expertsWithImages.length > 0) {
  console.log('📋 ЭКСПЕРТЫ С ИЗОБРАЖЕНИЯМИ:');
  expertsWithImages.forEach((expert, index) => {
    console.log(`${index + 1}. "${expert['What is your full name?']}" -> ${expert['URL']}`);
  });
} else {
  console.log('❌ Не найдено записей с Google Drive URL');
  
  // Показать первые несколько записей для отладки
  console.log('\n🔍 ПЕРВЫЕ 5 ЗАПИСЕЙ ДЛЯ ОТЛАДКИ:');
  data.slice(0, 5).forEach((record, index) => {
    console.log(`${index + 1}. Name: "${record['What is your full name?']}"`);
    console.log(`   URL: "${record['URL']}"`);
    console.log('');
  });
}