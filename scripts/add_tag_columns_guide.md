# Инструкция: Добавление столбцов тегов в Airtable

## 🎯 ЧТО НУЖНО СДЕЛАТЬ

Добавить 5 новых столбцов в таблицу "Experts" в Airtable:

1. **Location_Tags** - теги локаций
2. **Activity_Tags** - теги активностей  
3. **Traveler_Tags** - теги типов путешественников
4. **Expertise_Tags** - теги экспертизы
5. **Language_Tags** - теги языков

## 🔧 КАК ДОБАВИТЬ СТОЛБЦЫ

### Шаг 1: Открой Airtable
1. Перейди к https://airtable.com/appO1KtZMgg8P4IiR/tblUxVoMSLwS8cFMR
2. Войди в аккаунт

### Шаг 2: Добавь столбцы
Для каждого из 5 столбцов:

1. Нажми **"+"** справа от последнего столбца
2. Выбери тип поля: **"Single line text"**
3. Назови поле точно так:
   - `Location_Tags`
   - `Activity_Tags` 
   - `Traveler_Tags`
   - `Expertise_Tags`
   - `Language_Tags`
4. Нажми **"Save"**

## 📋 ТОЧНЫЕ НАЗВАНИЯ ПОЛЕЙ

Важно использовать ТОЧНО эти названия (с подчеркиванием и заглавными буквами):

```
Location_Tags
Activity_Tags
Traveler_Tags  
Expertise_Tags
Language_Tags
```

## ✅ ПОСЛЕ СОЗДАНИЯ СТОЛБЦОВ

Когда добавишь все 5 столбцов, запусти:

```bash
cd "C:\Users\79818\Desktop\Outdoorable"
node scripts/create_categorized_tags.js
```

Скрипт автоматически заполнит все теги для 54 экспертов.

## 🎯 ЧТО ПОЛУЧИТСЯ

После выполнения у каждого эксперта будут заполнены теги, например:

**Danielle Backman:**
- **Location_Tags**: `country_us, dest_mt_rainier, region_washington`
- **Activity_Tags**: `activity_diving, activity_skiing, activity_hiking`  
- **Traveler_Tags**: `traveler_solo, traveler_beginners`
- **Expertise_Tags**: `role_guide, level_extreme, spec_underwater`
- **Language_Tags**: `lang_english, lang_spanish`

## 🚀 ИСПОЛЬЗОВАНИЕ В N8N

После создания тегов, в N8N можно легко фильтровать экспертов:

```javascript
// Найти экспертов для Grand Canyon hiking с семьями
AND(
  FIND("dest_grand_canyon", {Location_Tags}),
  FIND("activity_hiking", {Activity_Tags}),
  FIND("traveler_families", {Traveler_Tags})
)
```