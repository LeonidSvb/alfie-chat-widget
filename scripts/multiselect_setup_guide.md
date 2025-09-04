# Настройка Multiple Select полей для тегов экспертов

## 🎯 СОЗДАНИЕ ПОЛЕЙ

В Airtable создай 5 полей типа **Multiple select**:

### 1. Location_Tags
**Опции для добавления:**
```
country_australia
country_canada  
country_indonesia
country_new_zealand
country_norway
country_peru
country_philippines
country_us
dest_andes
dest_bali
dest_cairns
dest_canyonlands
dest_cascades
dest_death_valley
dest_grand_canyon
dest_great_barrier_reef
dest_lofoten
dest_mt_rainier
dest_olympic
dest_patagonia
dest_sedona
dest_turks_caicos
dest_yellowstone
dest_yosemite
dest_zion
region_alaska
region_arizona
region_california
region_colorado
region_utah
region_washington
```

### 2. Activity_Tags
**Опции для добавления:**
```
activity_canyoning
activity_climbing
activity_diving
activity_hiking
activity_mountaineering
activity_photography
activity_skiing
activity_trail_running
activity_water_sports
activity_wildlife
```

### 3. Traveler_Tags
**Опции для добавления:**
```
traveler_60plus
traveler_beginners
traveler_extreme
traveler_families
traveler_solo
```

### 4. Expertise_Tags  
**Опции для добавления:**
```
cert_avalanche
cert_wfr
level_advanced
level_beginner
level_extreme
role_guide
role_instructor
role_photographer
spec_backcountry
spec_canyon
spec_desert
spec_family
spec_mountain
spec_underwater
```

### 5. Language_Tags
**Опции для добавления:**
```
lang_english
lang_french
lang_german
lang_japanese
lang_spanish
```

## 📋 ПОШАГОВАЯ ИНСТРУКЦИЯ

### Шаг 1: Создание поля
1. Нажми "+" для добавления нового поля
2. Выбери **"Multiple select"**
3. Назови поле (например, `Location_Tags`)

### Шаг 2: Добавление опций
1. В настройках поля нажми "Add option"
2. Вставь каждое значение из списка выше
3. Можешь назначить цвета для удобства:
   - 🌍 Страны - синий
   - 🏔️ Места - зеленый  
   - 📍 Регионы - оранжевый
   - 🎯 Активности - фиолетовый
   - 👥 Путешественники - красный
   - 🎓 Экспертиза - желтый
   - 🗣️ Языки - розовый

### Шаг 3: Повтори для всех 5 полей

## ⚠️ ВАЖНО
- Названия опций должны быть ТОЧНО как в списке
- Используй подчеркивания, а не пробелы
- Регистр важен (строчные буквы)

## 🚀 ПОСЛЕ СОЗДАНИЯ ПОЛЕЙ
Запусти специальный скрипт для заполнения Multiple Select полей:
```bash
node scripts/populate_multiselect_tags.js
```