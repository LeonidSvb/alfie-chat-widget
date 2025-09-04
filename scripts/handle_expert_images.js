// Скрипт для обработки изображений экспертов
// Скачивает изображения с Google Drive и создает заглушки для остальных

const fs = require('fs');
const path = require('path');

const AIRTABLE_API_KEY = 'patt4GHq4ij1rNAdK.9b230d9e4002e265f7a89f6e208fd0d3145d1f495d66eb092252b8da7559da9d';
const NEW_BASE_ID = 'apptAJxE6IudBH8fW';
const NEW_TABLE_ID = 'tblgvgDuQm20rNVPV';

class ExpertImagesHandler {
  constructor() {
    this.expertsWithImages = [];
    this.expertsWithoutImages = [];
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

    return allRecords.filter(record => record.fields.Name);
  }

  // Конвертация Google Drive ссылки в ссылку для скачивания
  convertGoogleDriveUrl(driveUrl) {
    if (!driveUrl || !driveUrl.includes('drive.google.com')) {
      return null;
    }

    // Извлекаем ID файла из ссылки
    const match = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    return null;
  }

  // Анализ изображений экспертов
  async analyzeExpertImages() {
    console.log('🔍 АНАЛИЗ ИЗОБРАЖЕНИЙ ЭКСПЕРТОВ...\n');

    const experts = await this.getAllExperts();
    console.log(`📊 Всего экспертов: ${experts.length}\n`);

    experts.forEach(expert => {
      const googleDriveUrl = expert.fields.Google_Drive_Image_URL;
      
      if (googleDriveUrl && googleDriveUrl.trim()) {
        const downloadUrl = this.convertGoogleDriveUrl(googleDriveUrl);
        this.expertsWithImages.push({
          name: expert.fields.Name,
          expertId: expert.id,
          originalUrl: googleDriveUrl,
          downloadUrl: downloadUrl
        });
      } else {
        this.expertsWithoutImages.push({
          name: expert.fields.Name,
          expertId: expert.id,
          email: expert.fields.Email || ''
        });
      }
    });

    console.log(`🖼️ Экспертов с изображениями: ${this.expertsWithImages.length}`);
    this.expertsWithImages.forEach((expert, index) => {
      console.log(`${index + 1}. ${expert.name} - ${expert.originalUrl}`);
    });

    console.log(`\n👤 Экспертов без изображений: ${this.expertsWithoutImages.length}`);
    this.expertsWithoutImages.slice(0, 5).forEach((expert, index) => {
      console.log(`${index + 1}. ${expert.name}`);
    });
    if (this.expertsWithoutImages.length > 5) {
      console.log(`... и еще ${this.expertsWithoutImages.length - 5}`);
    }

    return {
      withImages: this.expertsWithImages,
      withoutImages: this.expertsWithoutImages
    };
  }

  // Создание аватаров-заглушек
  generateAvatarPlaceholders() {
    console.log('\n🎨 СОЗДАНИЕ АВАТАРОВ-ЗАГЛУШЕК...\n');

    const avatarOptions = [
      // Варианты аватаров для разных типов экспертов
      {
        style: 'initials',
        description: 'Инициалы на цветном фоне',
        generator: (name) => {
          const initials = name.split(' ').map(word => word.charAt(0)).join('').slice(0, 2);
          const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
          const color = colors[name.length % colors.length];
          return {
            type: 'initials',
            initials: initials.toUpperCase(),
            backgroundColor: color,
            textColor: '#FFFFFF'
          };
        }
      },
      {
        style: 'gravatar',
        description: 'Gravatar по email',
        generator: (name, email) => {
          if (!email) return null;
          const hash = require('crypto').createHash('md5').update(email.toLowerCase()).hexdigest();
          return {
            type: 'gravatar',
            url: `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`
          };
        }
      },
      {
        style: 'dicebear',
        description: 'Сгенерированные аватары DiceBear',
        generator: (name) => {
          const seed = encodeURIComponent(name.toLowerCase().replace(/\s+/g, ''));
          return {
            type: 'dicebear',
            url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
          };
        }
      }
    ];

    const placeholders = [];

    this.expertsWithoutImages.forEach(expert => {
      const expertPlaceholders = avatarOptions.map(option => ({
        expert: expert.name,
        expertId: expert.expertId,
        ...option.generator(expert.name, expert.email)
      })).filter(Boolean);

      placeholders.push({
        expertName: expert.name,
        expertId: expert.expertId,
        options: expertPlaceholders
      });
    });

    console.log(`✅ Сгенерировано ${placeholders.length} вариантов аватаров`);

    return placeholders;
  }

  // Создание отчета по изображениям
  saveImageReport() {
    const report = {
      generated_at: new Date().toISOString(),
      summary: {
        total_experts: this.expertsWithImages.length + this.expertsWithoutImages.length,
        with_images: this.expertsWithImages.length,
        without_images: this.expertsWithoutImages.length,
        image_coverage: `${Math.round(this.expertsWithImages.length / (this.expertsWithImages.length + this.expertsWithoutImages.length) * 100)}%`
      },
      experts_with_images: this.expertsWithImages,
      experts_without_images: this.expertsWithoutImages.map(e => ({ 
        name: e.name, 
        expertId: e.expertId,
        suggested_placeholder: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(e.name.toLowerCase().replace(/\s+/g, ''))}`
      }))
    };

    // Сохраняем отчет
    const reportPath = path.join(process.cwd(), 'expert_images_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

    // Создаем инструкцию
    let instructions = `# ИНСТРУКЦИЯ ПО ИЗОБРАЖЕНИЯМ ЭКСПЕРТОВ\n\n`;
    instructions += `Дата: ${new Date().toLocaleString()}\n\n`;
    instructions += `## СТАТИСТИКА\n\n`;
    instructions += `- Всего экспертов: ${report.summary.total_experts}\n`;
    instructions += `- С изображениями: ${report.summary.with_images}\n`;
    instructions += `- Без изображений: ${report.summary.without_images}\n`;
    instructions += `- Покрытие изображениями: ${report.summary.image_coverage}\n\n`;

    instructions += `## ВАРИАНТЫ РЕШЕНИЯ\n\n`;
    instructions += `### Для экспертов с Google Drive изображениями:\n`;
    this.expertsWithImages.forEach((expert, index) => {
      instructions += `${index + 1}. **${expert.name}**\n`;
      instructions += `   - Оригинал: ${expert.originalUrl}\n`;
      instructions += `   - Для скачивания: ${expert.downloadUrl}\n\n`;
    });

    instructions += `### Для экспертов без изображений - используй заглушки:\n\n`;
    instructions += `**Вариант 1: DiceBear (Рекомендуется)**\n`;
    instructions += `\`\`\`\nhttps://api.dicebear.com/7.x/adventurer/svg?seed=EXPERT_NAME\n\`\`\`\n\n`;
    
    instructions += `**Вариант 2: Инициалы на цветном фоне**\n`;
    instructions += `Создать SVG с инициалами эксперта\n\n`;

    instructions += `**Вариант 3: Gravatar**\n`;
    instructions += `Использовать Gravatar по email (где доступен)\n\n`;

    const instructionsPath = path.join(process.cwd(), 'expert_images_instructions.md');
    fs.writeFileSync(instructionsPath, instructions, 'utf-8');

    console.log(`💾 Отчет сохранен: ${reportPath}`);
    console.log(`📋 Инструкция: ${instructionsPath}`);

    return report;
  }
}

// Запуск
async function main() {
  console.log('🎯 АНАЛИЗ И ОБРАБОТКА ИЗОБРАЖЕНИЙ ЭКСПЕРТОВ\n');
  
  const handler = new ExpertImagesHandler();
  
  try {
    await handler.analyzeExpertImages();
    const placeholders = handler.generateAvatarPlaceholders();
    const report = handler.saveImageReport();

    console.log('\n🎉 РЕКОМЕНДАЦИИ ПО ИЗОБРАЖЕНИЯМ:');
    console.log('1. Для экспертов с Google Drive - используй прямые ссылки в чате');
    console.log('2. Для остальных - используй DiceBear аватары: https://api.dicebear.com/7.x/adventurer/svg?seed=EXPERT_NAME');
    console.log('3. В N8N можно легко генерировать аватары на лету');

  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = ExpertImagesHandler;