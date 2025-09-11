import Airtable from 'airtable';

// Полная функция для получения экспертов из Airtable
// Возвращает все необходимые поля для отображения
export interface SimpleExpert {
  id: string;
  name: string;
  profession: string;
  oneline_bio: string;
  avatar?: string;
  link?: string;
  bio?: string;
}

// Кэшированные данные экспертов
let cachedExperts: SimpleExpert[] | null = null;

export async function fetchAllExperts(): Promise<SimpleExpert[]> {
  // Возвращаем кэшированные данные если есть
  if (cachedExperts) {
    console.log(`Используем кэшированные данные: ${cachedExperts.length} экспертов`);
    return cachedExperts;
  }

  try {
    const airtable = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(process.env.AIRTABLE_BASE_ID!);

    const EXPERTS_TABLE = 'tblsSB9gBBFhH2qci';

    const records = await airtable(EXPERTS_TABLE).select({
      maxRecords: 100,
      fields: ['Author Name', 'Profession(s)', 'One line bio', 'Profile Picture 600 x 600', 'Profile Link']
    }).all();

    const experts: SimpleExpert[] = records.map(record => {
      // Получаем URL фото из массива объектов Airtable
      const photoArray = record.get('Profile Picture 600 x 600') as any[];
      const avatarUrl = photoArray && photoArray.length > 0 ? photoArray[0].url : undefined;
      
      return {
        id: record.id,
        name: (record.get('Author Name') as string) || 'Expert',
        profession: (record.get('Profession(s)') as string) || 'Professional Guide',
        oneline_bio: (record.get('One line bio') as string) || '',
        avatar: avatarUrl,
        link: (record.get('Profile Link') as string) || undefined,
        bio: (record.get('One line bio') as string) || '' // используем oneline_bio как bio
      };
    });

    // Кэшируем результат
    cachedExperts = experts;
    console.log(`Загружено и кэшировано экспертов: ${experts.length}`);
    return experts;

  } catch (error) {
    console.error('Ошибка при получении экспертов из Airtable:', error);
    throw error;
  }
}

// Функция для получения кэшированных экспертов (без запроса к API)
export function getCachedExperts(): SimpleExpert[] | null {
  return cachedExperts;
}

// Функция для очистки кэша
export function clearExpertsCache(): void {
  cachedExperts = null;
}