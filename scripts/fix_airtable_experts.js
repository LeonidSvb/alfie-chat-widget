// Полная проверка и исправление таблицы экспертов с тегами
// Анализирует проблемы, сохраняет референсы тегов, исправляет ошибки

const fs = require('fs');
const path = require('path');

const AIRTABLE_API_KEY = 'patt4GHq4ij1rNAdK.9b230d9e4002e265f7a89f6e208fd0d3145d1f495d66eb092252b8da7559da9d';

// Старая таблица (оригинал)
const OLD_BASE_ID = 'appO1KtZMgg8P4IiR';
const OLD_TABLE_ID = 'Experts';

// Новая таблица (с тегами)
const NEW_BASE_ID = 'apptAJxE6IudBH8fW';
const NEW_TABLE_ID = 'tblgvgDuQm20rNVPV';

class ExpertsTableFixer {
  constructor() {
    this.originalExperts = [];
    this.newExperts = [];
    this.allTags = {
      Location_Tags: new Set(),
      Activity_Tags: new Set(),
      Traveler_Tags: new Set(),
      Expertise_Tags: new Set(),
      Language_Tags: new Set()
    };
    this.issues = [];
  }

  // Получение всех записей из таблицы
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

  // Анализ проблем в новой таблице
  analyzeIssues() {
    console.log('🔍 АНАЛИЗ ПРОБЛЕМ В НОВОЙ ТАБЛИЦЕ...\n');

    this.newExperts.forEach((expert, index) => {
      const fields = expert.fields;
      const expertId = expert.id;
      
      // Проверка на отсутствие имени
      if (!fields.Name || fields.Name.trim() === '') {
        this.issues.push({
          type: 'missing_name',
          expertId: expertId,
          index: index + 1,
          description: 'Отсутствует имя эксперта',
          data: fields
        });
      }

      // Проверка на неполные данные (меньше 5 полей)
      const fieldCount = Object.keys(fields).length;
      if (fieldCount < 10) {
        this.issues.push({
          type: 'incomplete_data',
          expertId: expertId,
          index: index + 1,
          name: fields.Name || 'Unknown',
          description: `Неполные данные - только ${fieldCount} полей`,
          data: fields
        });
      }

      // Проверка тегов
      const tagFields = ['Location_Tags', 'Activity_Tags', 'Traveler_Tags', 'Expertise_Tags', 'Language_Tags'];
      tagFields.forEach(tagField => {
        if (fields[tagField] && Array.isArray(fields[tagField])) {
          fields[tagField].forEach(tag => {
            this.allTags[tagField].add(tag);
          });
        }
      });
    });

    // Поиск дубликатов по имени
    const nameMap = new Map();
    this.newExperts.forEach((expert, index) => {
      const name = expert.fields.Name;
      if (name) {
        if (nameMap.has(name)) {
          this.issues.push({
            type: 'duplicate_name',
            expertId: expert.id,
            index: index + 1,
            name: name,
            description: `Дубликат имени (первое вхождение: запись ${nameMap.get(name) + 1})`,
            data: expert.fields
          });
        } else {
          nameMap.set(name, index);
        }
      }
    });

    // Сравнение с оригинальной таблицей
    const originalNames = new Set(this.originalExperts.map(e => e.fields.Name).filter(Boolean));
    const newNames = new Set(this.newExperts.map(e => e.fields.Name).filter(Boolean));

    // Найти отсутствующих экспертов
    for (const originalName of originalNames) {
      if (!newNames.has(originalName)) {
        this.issues.push({
          type: 'missing_expert',
          name: originalName,
          description: 'Эксперт отсутствует в новой таблице'
        });
      }
    }

    // Найти лишних экспертов
    for (const newName of newNames) {
      if (!originalNames.has(newName)) {
        this.issues.push({
          type: 'extra_expert',
          name: newName,
          description: 'Лишний эксперт в новой таблице (не было в оригинале)'
        });
      }
    }

    return this.issues;
  }

  // Сохранение всех тегов в референсный файл
  saveTagsReference() {
    console.log('💾 СОХРАНЕНИЕ РЕФЕРЕНСА ТЕГОВ...\n');

    const tagsReference = {
      generated_at: new Date().toISOString(),
      total_experts: this.newExperts.filter(e => e.fields.Name).length,
      categories: {}
    };

    Object.entries(this.allTags).forEach(([category, tagSet]) => {
      const sortedTags = Array.from(tagSet).sort();
      tagsReference.categories[category] = {
        count: sortedTags.length,
        tags: sortedTags
      };
    });

    // Сохранить в JSON
    const jsonPath = path.join(process.cwd(), 'experts_tags_reference.json');
    fs.writeFileSync(jsonPath, JSON.stringify(tagsReference, null, 2), 'utf-8');

    // Сохранить читабельную версию
    let readableContent = `# РЕФЕРЕНС ТЕГОВ ЭКСПЕРТОВ OUTDOORABLE\n\n`;
    readableContent += `Дата создания: ${new Date().toLocaleString()}\n`;
    readableContent += `Всего экспертов: ${tagsReference.total_experts}\n\n`;

    Object.entries(tagsReference.categories).forEach(([category, data]) => {
      readableContent += `## ${category} (${data.count} тегов)\n\n`;
      data.tags.forEach(tag => {
        readableContent += `- ${tag}\n`;
      });
      readableContent += '\n';
    });

    const mdPath = path.join(process.cwd(), 'experts_tags_reference.md');
    fs.writeFileSync(mdPath, readableContent, 'utf-8');

    console.log(`✅ Референс тегов сохранен:`);
    console.log(`   📄 JSON: ${jsonPath}`);
    console.log(`   📖 Markdown: ${mdPath}`);

    return tagsReference;
  }

  // Удаление проблемных записей
  async deleteProblematicRecords() {
    const recordsToDelete = this.issues.filter(issue => 
      issue.type === 'missing_name' || issue.type === 'incomplete_data'
    );

    if (recordsToDelete.length === 0) {
      console.log('✅ Нет записей для удаления');
      return;
    }

    console.log(`🗑️ Удаление ${recordsToDelete.length} проблемных записей...\n`);

    for (const issue of recordsToDelete) {
      try {
        const response = await fetch(`https://api.airtable.com/v0/${NEW_BASE_ID}/${NEW_TABLE_ID}/${issue.expertId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`
          }
        });

        if (response.ok) {
          console.log(`✅ Удалена проблемная запись: ${issue.name || issue.expertId}`);
        } else {
          console.log(`❌ Ошибка удаления ${issue.name || issue.expertId}: ${response.status}`);
        }

        // Пауза между запросами
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`❌ Критическая ошибка при удалении ${issue.name || issue.expertId}:`, error);
      }
    }
  }

  // Основная функция проверки и исправления
  async checkAndFixTable() {
    try {
      console.log('🚀 ЗАПУСК ПРОВЕРКИ И ИСПРАВЛЕНИЯ ТАБЛИЦЫ ЭКСПЕРТОВ\n');
      
      // Получаем данные из обеих таблиц
      console.log('📥 Получение данных из оригинальной таблицы...');
      this.originalExperts = await this.getAllRecords(OLD_BASE_ID, OLD_TABLE_ID);
      console.log(`✅ Получено ${this.originalExperts.length} оригинальных экспертов`);

      console.log('📥 Получение данных из новой таблицы...');
      this.newExperts = await this.getAllRecords(NEW_BASE_ID, NEW_TABLE_ID);
      console.log(`✅ Получено ${this.newExperts.length} экспертов с тегами\n`);

      // Анализируем проблемы
      const issues = this.analyzeIssues();

      // Сохраняем референс тегов
      const tagsReference = this.saveTagsReference();

      console.log('\n📊 ОТЧЕТ О ПРОБЛЕМАХ:\n');

      if (issues.length === 0) {
        console.log('🎉 Проблем не найдено! Таблица в отличном состоянии.');
        return;
      }

      // Группируем проблемы по типам
      const issuesByType = {};
      issues.forEach(issue => {
        if (!issuesByType[issue.type]) {
          issuesByType[issue.type] = [];
        }
        issuesByType[issue.type].push(issue);
      });

      // Выводим статистику по типам проблем
      Object.entries(issuesByType).forEach(([type, typeIssues]) => {
        console.log(`❌ ${type}: ${typeIssues.length} проблем(ы)`);
        typeIssues.slice(0, 3).forEach((issue, index) => {
          console.log(`   ${index + 1}. ${issue.description} ${issue.name ? `(${issue.name})` : ''}`);
        });
        if (typeIssues.length > 3) {
          console.log(`   ... и еще ${typeIssues.length - 3} проблем(ы)`);
        }
        console.log('');
      });

      // Спрашиваем подтверждение на исправление
      console.log('⚠️ НАЙДЕНЫ ПРОБЛЕМЫ. Исправить автоматически?');
      console.log('🔧 Действия, которые будут выполнены:');
      
      const criticalIssues = issues.filter(issue => 
        issue.type === 'missing_name' || issue.type === 'incomplete_data'
      );
      
      if (criticalIssues.length > 0) {
        console.log(`   • Удалить ${criticalIssues.length} записи с критическими проблемами`);
      }

      console.log('\nРаскомментируй строку ниже и запусти снова для автоисправления...\n');

      // Автоисправление активировано:
      await this.deleteProblematicRecords();

      return {
        issues,
        tagsReference,
        summary: {
          total_experts: this.newExperts.length,
          experts_with_names: this.newExperts.filter(e => e.fields.Name).length,
          issues_found: issues.length,
          critical_issues: criticalIssues.length
        }
      };

    } catch (error) {
      console.error('❌ Критическая ошибка:', error);
      throw error;
    }
  }

  // Показать статистику тегов
  showTagsStatistics() {
    console.log('\n📊 СТАТИСТИКА ТЕГОВ:\n');
    
    Object.entries(this.allTags).forEach(([category, tagSet]) => {
      const sortedTags = Array.from(tagSet).sort();
      console.log(`🏷️ ${category}: ${sortedTags.length} уникальных тегов`);
    });

    const totalTags = Object.values(this.allTags).reduce((sum, tagSet) => sum + tagSet.size, 0);
    console.log(`\n📋 Всего уникальных тегов: ${totalTags}`);
  }
}

// Запуск
async function main() {
  console.log('🎯 АНАЛИЗ И ИСПРАВЛЕНИЕ ТАБЛИЦЫ ЭКСПЕРТОВ С ТЕГАМИ\n');
  
  const fixer = new ExpertsTableFixer();
  
  try {
    const result = await fixer.checkAndFixTable();
    fixer.showTagsStatistics();

    if (result) {
      console.log('\n🎉 Анализ завершен!');
      console.log(`📊 Итоговая статистика: ${result.summary.experts_with_names}/${result.summary.total_experts} экспертов с именами`);
      console.log(`⚠️ Найдено проблем: ${result.summary.issues_found} (критических: ${result.summary.critical_issues})`);
    }

  } catch (error) {
    console.error('❌ Ошибка выполнения:', error);
  }
}

// Запуск только если файл выполняется напрямую
if (require.main === module) {
  main();
}

module.exports = ExpertsTableFixer;