// N8N Code Node - Центральная логика обработки
// Этот код вставляется в N8N Code Node

const message = $input.first().json.body.message;
const sessionId = $input.first().json.body.sessionId || 'default';

// Загружаем конфигурацию (в реальном N8N это будет через HTTP запрос или переменные)
const FLOW_LOGIC = {
  // Конфигурация из flow-logic.json будет здесь
};

const EXPERT_QUOTES = {
  // Конфигурация из expert-quotes.json будет здесь  
};

// Получаем или создаем контекст сессии
let sessionContext = getSessionContext(sessionId);

// Определяем тип сообщения и текущий шаг
const messageType = determineMessageType(message, sessionContext);
const currentStep = sessionContext.currentStep || 1;
const currentFlow = sessionContext.currentFlow;

let response = {
  message: '',
  buttons: [],
  showExpert: false,
  expertCard: null,
  needsPerplexity: false,
  needsChatGPT: false,
  perplexityQuery: '',
  chatGPTPrompt: ''
};

// Главная логика маршрутизации
switch(messageType) {
  case 'FLOW_DESTINATION_DISCOVERY':
    response = handleDestinationFlow(message, sessionContext, currentStep);
    break;
    
  case 'FLOW_TRIP_PLANNING':
    response = handleTripPlanningFlow(message, sessionContext, currentStep);
    break;
    
  case 'FLOW_EXPERT_ADVICE':
    response = handleExpertAdviceFlow(message, sessionContext, currentStep);
    break;
    
  case 'CONTINUATION':
    response = handleContinuation(message, sessionContext);
    break;
    
  default:
    response = handleGeneral(message);
}

// Обновляем контекст сессии
updateSessionContext(sessionId, sessionContext);

// Формируем финальный ответ
function handleDestinationFlow(message, context, step) {
  const flowConfig = FLOW_LOGIC.destination_discovery;
  
  switch(step) {
    case 1:
      // Первый шаг - выбор активности
      context.currentFlow = 'destination_discovery';
      context.currentStep = 2;
      
      return {
        message: flowConfig.step1.message,
        buttons: flowConfig.step1.buttons,
        showExpert: false,
        needsPerplexity: false,
        needsChatGPT: false
      };
      
    case 2:
      // Второй шаг - пользователь выбрал активность
      context.selectedActivity = extractActivity(message);
      context.currentStep = 3;
      
      return {
        message: `Отлично! Вы выбрали ${context.selectedActivity}. Ищу лучшие места...`,
        showExpert: false,
        needsPerplexity: true,
        needsChatGPT: true,
        perplexityQuery: flowConfig.step2.perplexity_query.replace('{activity}', context.selectedActivity),
        chatGPTPrompt: flowConfig.step2.chatgpt_prompt.replace('{activity}', context.selectedActivity)
      };
      
    case 3:
      // Третий шаг - пользователь ответил на уточнения
      const userDetails = extractUserDetails(message);
      context.selectedRegion = userDetails.region;
      context.selectedSeason = userDetails.season;
      context.experienceLevel = userDetails.experience;
      
      const expertKey = `${context.selectedActivity}_${context.selectedRegion}`.toLowerCase();
      const expert = EXPERT_QUOTES[expertKey];
      
      return {
        message: 'Готовлю персональные рекомендации...',
        showExpert: !!expert,
        expertCard: expert,
        needsPerplexity: true,
        needsChatGPT: true,
        perplexityQuery: flowConfig.step3.perplexity_query
          .replace('{activity}', context.selectedActivity)
          .replace('{region}', context.selectedRegion)
          .replace('{season}', context.selectedSeason),
        chatGPTPrompt: flowConfig.step3.chatgpt_prompt
          .replace('{activity}', context.selectedActivity)
          .replace('{region}', context.selectedRegion)
          .replace('{season}', context.selectedSeason)
          .replace('{experience}', context.experienceLevel)
      };
  }
}

function handleTripPlanningFlow(message, context, step) {
  // Аналогичная логика для планирования поездок
  // ...
}

function handleExpertAdviceFlow(message, context, step) {
  // Аналогичная логика для экспертных советов
  // ...
}

// Вспомогательные функции
function determineMessageType(message, context) {
  if (message.includes('FLOW_')) {
    return message;
  }
  if (context.currentFlow) {
    return 'CONTINUATION';
  }
  return 'GENERAL';
}

function extractActivity(message) {
  const activityMap = {
    'hiking': 'хайкинг',
    'climbing': 'скалолазание', 
    'kayaking': 'каякинг',
    'mountaineering': 'альпинизм',
    'cycling': 'велотуризм'
  };
  
  for (const [key, value] of Object.entries(activityMap)) {
    if (message.toLowerCase().includes(key)) {
      return value;
    }
  }
  return 'outdoor активность';
}

function extractUserDetails(message) {
  // Простой парсер ответов пользователя
  const details = {
    region: null,
    season: null,
    experience: null
  };
  
  const text = message.toLowerCase();
  
  // Определяем регион
  if (text.includes('америк')) details.region = 'south_america';
  if (text.includes('европ')) details.region = 'europe';
  if (text.includes('ази')) details.region = 'asia';
  
  // Определяем сезон
  if (text.includes('март') || text.includes('апрел') || text.includes('май')) details.season = 'весна';
  if (text.includes('июн') || text.includes('июл') || text.includes('август')) details.season = 'лето';
  
  // Определяем опыт
  if (text.includes('начин')) details.experience = 'начинающий';
  if (text.includes('средн')) details.experience = 'средний';
  if (text.includes('опытн') || text.includes('продвин')) details.experience = 'опытный';
  
  return details;
}

function getSessionContext(sessionId) {
  // В реальном N8N это будет работать с базой данных или переменными
  return global.sessions?.[sessionId] || {
    currentFlow: null,
    currentStep: 1,
    selectedActivity: null,
    selectedRegion: null,
    selectedSeason: null,
    experienceLevel: null
  };
}

function updateSessionContext(sessionId, context) {
  if (!global.sessions) global.sessions = {};
  global.sessions[sessionId] = context;
}

// Возвращаем результат
return response;