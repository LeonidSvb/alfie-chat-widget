// Полный аудит и исправление тегов для каждого эксперта
// Проходит по каждому эксперту, анализирует теги, исправляет ошибки

const fs = require('fs');
const path = require('path');

const AIRTABLE_API_KEY = 'patt4GHq4ij1rNAdK.9b230d9e4002e265f7a89f6e208fd0d3145d1f495d66eb092252b8da7559da9d';
const NEW_BASE_ID = 'apptAJxE6IudBH8fW';
const NEW_TABLE_ID = 'tblgvgDuQm20rNVPV';

// Импортируем генератор тегов
const CategorizedTagsGenerator = require('./create_categorized_tags.js');

class ExpertTagsAuditor {
  constructor() {
    this.tagsGenerator = new CategorizedTagsGenerator();
    this.auditReport = {
      processed: 0,
      fixed: 0,
      no_changes: 0,
      errors: 0,
      experts: []
    };
  }

  // Получение всех экспертов
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

    return allRecords.filter(record => record.fields.Name); // Только с именами
  }

  // Сравнение массивов тегов
  compareTagArrays(currentTags, expectedTags) {
    const current = new Set(Array.isArray(currentTags) ? currentTags : []);
    const expected = new Set(expectedTags ? expectedTags.split(', ').filter(t => t.trim()) : []);

    const missing = [...expected].filter(tag => !current.has(tag));
    const extra = [...current].filter(tag => !expected.has(tag));
    const same = missing.length === 0 && extra.length === 0;

    return { missing, extra, same, expected: [...expected].sort() };
  }

  // Анализ тегов одного эксперта
  analyzeExpertTags(expert) {
    console.log(`🔍 Анализ: ${expert.fields.Name}`);

    // Генерируем ожидаемые теги на основе текста
    const expectedTags = this.tagsGenerator.generateCategorizedTags(expert);

    const analysis = {
      expertId: expert.id,
      expertName: expert.fields.Name,
      issues: [],
      changes: {},
      needsUpdate: false
    };

    // Проверяем каждую категорию тегов
    const tagCategories = [
      { field: 'Location_Tags', expected: expectedTags.locationTags, name: 'Location' },
      { field: 'Activity_Tags', expected: expectedTags.activityTags, name: 'Activity' },
      { field: 'Traveler_Tags', expected: expectedTags.travelerTags, name: 'Traveler' },
      { field: 'Expertise_Tags', expected: expectedTags.expertiseTags, name: 'Expertise' },
      { field: 'Language_Tags', expected: expectedTags.languageTags, name: 'Language' }
    ];

    tagCategories.forEach(category => {
      const currentTags = expert.fields[category.field];
      const comparison = this.compareTagArrays(currentTags, category.expected);

      if (!comparison.same) {
        analysis.needsUpdate = true;
        analysis.changes[category.field] = comparison.expected;

        const issueDescription = [];
        if (comparison.missing.length > 0) {
          issueDescription.push(`отсутствуют: [${comparison.missing.join(', ')}]`);
        }
        if (comparison.extra.length > 0) {
          issueDescription.push(`лишние: [${comparison.extra.join(', ')}]`);
        }

        analysis.issues.push({
          category: category.name,
          field: category.field,
          current: Array.isArray(currentTags) ? currentTags : [],
          expected: comparison.expected,
          missing: comparison.missing,
          extra: comparison.extra,
          description: `${category.name}: ${issueDescription.join(', ')}`
        });

        console.log(`   ⚠️ ${category.name}: ${issueDescription.join(', ')}`);
      } else {
        console.log(`   ✅ ${category.name}: OK`);
      }
    });

    // Обновляем All_Tags
    const allExpectedTags = [];
    if (expectedTags.locationTags) allExpectedTags.push(...expectedTags.locationTags.split(', ').filter(t => t));
    if (expectedTags.activityTags) allExpectedTags.push(...expectedTags.activityTags.split(', ').filter(t => t));
    if (expectedTags.travelerTags) allExpectedTags.push(...expectedTags.travelerTags.split(', ').filter(t => t));
    if (expectedTags.expertiseTags) allExpectedTags.push(...expectedTags.expertiseTags.split(', ').filter(t => t));
    if (expectedTags.languageTags) allExpectedTags.push(...expectedTags.languageTags.split(', ').filter(t => t));

    const allTagsExpected = [...new Set(allExpectedTags)].sort();
    const currentAllTags = expert.fields.All_Tags || [];
    
    if (JSON.stringify(currentAllTags.sort()) !== JSON.stringify(allTagsExpected)) {
      analysis.needsUpdate = true;
      analysis.changes['All_Tags'] = allTagsExpected;
      console.log(`   🔄 All_Tags: обновление требуется`);
    } else {
      console.log(`   ✅ All_Tags: OK`);
    }

    if (analysis.issues.length === 0 && !analysis.needsUpdate) {
      console.log(`   🎉 ${expert.fields.Name}: Все теги корректны`);
    } else {
      console.log(`   🔧 ${expert.fields.Name}: Требуется исправление (${analysis.issues.length} проблем)`);
    }

    console.log(''); // Пустая строка для разделения

    return analysis;
  }

  // Обновление тегов эксперта в Airtable
  async updateExpertTags(analysis) {
    if (!analysis.needsUpdate) {
      return { success: true, message: 'No updates needed' };
    }

    try {
      const updateData = {
        fields: analysis.changes
      };

      const response = await fetch(`https://api.airtable.com/v0/${NEW_BASE_ID}/${NEW_TABLE_ID}/${analysis.expertId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        return { success: true, message: 'Updated successfully' };
      } else {
        const errorText = await response.text();
        return { success: false, error: `${response.status}: ${errorText}` };
      }

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Основная функция аудита и исправления
  async auditAndFixAllExperts() {
    try {
      console.log('🚀 ЗАПУСК ПОЛНОГО АУДИТА ТЕГОВ ЭКСПЕРТОВ\n');
      
      // Получаем всех экспертов
      console.log('📥 Получение всех экспертов...');
      const experts = await this.getAllExperts();
      console.log(`✅ Получено ${experts.length} экспертов\n`);

      console.log('🔍 НАЧИНАЕМ АНАЛИЗ КАЖДОГО ЭКСПЕРТА:\n');

      // Проходим по каждому эксперту
      for (const [index, expert] of experts.entries()) {
        console.log(`📋 [${index + 1}/${experts.length}] ================================`);
        
        this.auditReport.processed++;

        try {
          // Анализируем теги
          const analysis = this.analyzeExpertTags(expert);

          // Обновляем в Airtable если нужно
          if (analysis.needsUpdate) {
            console.log(`🔧 Обновление тегов для ${analysis.expertName}...`);
            const updateResult = await this.updateExpertTags(analysis);

            if (updateResult.success) {
              console.log(`✅ ${analysis.expertName}: Теги обновлены`);
              this.auditReport.fixed++;
              analysis.updateStatus = 'success';
            } else {
              console.log(`❌ ${analysis.expertName}: Ошибка обновления - ${updateResult.error}`);
              this.auditReport.errors++;
              analysis.updateStatus = 'error';
              analysis.updateError = updateResult.error;
            }
          } else {
            console.log(`✅ ${analysis.expertName}: Изменения не требуются`);
            this.auditReport.no_changes++;
            analysis.updateStatus = 'no_changes';
          }

          // Добавляем в отчет
          this.auditReport.experts.push({
            name: analysis.expertName,
            expertId: analysis.expertId,
            issues_count: analysis.issues.length,
            issues: analysis.issues,
            changes_made: analysis.changes,
            update_status: analysis.updateStatus,
            update_error: analysis.updateError
          });

          // Пауза между запросами
          if (analysis.needsUpdate) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }

        } catch (error) {
          console.error(`❌ Критическая ошибка для ${expert.fields.Name}:`, error);
          this.auditReport.errors++;
          
          this.auditReport.experts.push({
            name: expert.fields.Name,
            expertId: expert.id,
            issues_count: 0,
            issues: [],
            changes_made: {},
            update_status: 'critical_error',
            update_error: error.message
          });
        }

        console.log(''); // Разделитель между экспертами
      }

      // Сохраняем отчет
      await this.saveAuditReport();

      console.log('🎉 АУДИТ ЗАВЕРШЕН!\n');
      this.printSummary();

      return this.auditReport;

    } catch (error) {
      console.error('❌ Критическая ошибка аудита:', error);
      throw error;
    }
  }

  // Сохранение отчета об аудите
  async saveAuditReport() {
    const reportData = {
      audit_date: new Date().toISOString(),
      summary: {
        total_processed: this.auditReport.processed,
        fixed: this.auditReport.fixed,
        no_changes: this.auditReport.no_changes,
        errors: this.auditReport.errors,
        success_rate: `${Math.round((this.auditReport.fixed + this.auditReport.no_changes) / this.auditReport.processed * 100)}%`
      },
      experts: this.auditReport.experts
    };

    // JSON отчет
    const jsonPath = path.join(process.cwd(), 'expert_tags_audit_report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(reportData, null, 2), 'utf-8');

    // Читабельный отчет
    let readableReport = `# ОТЧЕТ ОБ АУДИТЕ ТЕГОВ ЭКСПЕРТОВ\n\n`;
    readableReport += `Дата: ${new Date().toLocaleString()}\n\n`;
    
    readableReport += `## ИТОГОВАЯ СТАТИСТИКА\n\n`;
    readableReport += `- 📊 Всего обработано: ${this.auditReport.processed}\n`;
    readableReport += `- 🔧 Исправлено: ${this.auditReport.fixed}\n`;
    readableReport += `- ✅ Без изменений: ${this.auditReport.no_changes}\n`;
    readableReport += `- ❌ Ошибок: ${this.auditReport.errors}\n`;
    readableReport += `- 📈 Успешность: ${reportData.summary.success_rate}\n\n`;

    // Детали по экспертам
    if (this.auditReport.fixed > 0) {
      readableReport += `## ЭКСПЕРТЫ С ИСПРАВЛЕНИЯМИ (${this.auditReport.fixed})\n\n`;
      this.auditReport.experts
        .filter(e => e.update_status === 'success')
        .forEach(expert => {
          readableReport += `### ${expert.name}\n`;
          readableReport += `- Проблем найдено: ${expert.issues_count}\n`;
          expert.issues.forEach(issue => {
            readableReport += `  - ${issue.description}\n`;
          });
          readableReport += '\n';
        });
    }

    if (this.auditReport.errors > 0) {
      readableReport += `## ОШИБКИ (${this.auditReport.errors})\n\n`;
      this.auditReport.experts
        .filter(e => e.update_status === 'error' || e.update_status === 'critical_error')
        .forEach(expert => {
          readableReport += `### ${expert.name}\n`;
          readableReport += `- Ошибка: ${expert.update_error}\n\n`;
        });
    }

    const mdPath = path.join(process.cwd(), 'expert_tags_audit_report.md');
    fs.writeFileSync(mdPath, readableReport, 'utf-8');

    console.log(`💾 Отчет сохранен:`);
    console.log(`   📄 JSON: ${jsonPath}`);
    console.log(`   📖 Markdown: ${mdPath}\n`);
  }

  // Печать итоговой статистики
  printSummary() {
    console.log('📊 ИТОГОВАЯ СТАТИСТИКА АУДИТА:');
    console.log(`   📋 Всего обработано: ${this.auditReport.processed}`);
    console.log(`   🔧 Исправлено: ${this.auditReport.fixed}`);
    console.log(`   ✅ Без изменений: ${this.auditReport.no_changes}`);
    console.log(`   ❌ Ошибок: ${this.auditReport.errors}`);
    
    const successRate = Math.round((this.auditReport.fixed + this.auditReport.no_changes) / this.auditReport.processed * 100);
    console.log(`   📈 Успешность: ${successRate}%`);

    if (this.auditReport.fixed > 0) {
      console.log(`\n🎉 Исправлено ${this.auditReport.fixed} экспертов с проблемами в тегах!`);
    }
    if (this.auditReport.no_changes > 0) {
      console.log(`✨ ${this.auditReport.no_changes} экспертов уже имели корректные теги!`);
    }
  }
}

// Запуск
async function main() {
  console.log('🎯 ПОЛНЫЙ АУДИТ И ИСПРАВЛЕНИЕ ТЕГОВ ЭКСПЕРТОВ\n');
  
  const auditor = new ExpertTagsAuditor();
  
  try {
    await auditor.auditAndFixAllExperts();
  } catch (error) {
    console.error('❌ Ошибка выполнения:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = ExpertTagsAuditor;