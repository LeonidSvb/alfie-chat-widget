import Airtable from 'airtable';

// Простая функция для получения экспертов из Airtable
// Возвращает только ID, profession и one line bio
export interface SimpleExpert {
  id: string;
  profession: string;
  oneline_bio: string;
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
      fields: ['Profession(s)', 'One line bio'] // Только нужные поля
    }).all();

    const experts: SimpleExpert[] = records.map(record => ({
      id: record.id,
      profession: (record.get('Profession(s)') as string) || '',
      oneline_bio: (record.get('One line bio') as string) || ''
    }));

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