'use client';

import React, { useState, useEffect } from 'react';
import { testRegistry } from '../registry.js';
import randomAnswersData from '../data/randomAnswers.json';
// import { allExpertTestScenarios } from '@/data/expertTestScenarios'; // Removed - using inline data

interface SimpleTestPanelState {
  isRunning: boolean;
  generatedAnswers?: any;
  logs: any[];
}

// Функция для случайного выбора элемента из массива
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Генерация случайных ответов для указанного flow
function generateRandomAnswers(flowType: 'inspire-me' | 'i-know-where') {
  const flowData = randomAnswersData[flowType];
  const answers: Record<string, any> = {};
  
  if (flowType === 'inspire-me') {
    // Для inspire-me просто выбираем все поля
    Object.keys(flowData).forEach(questionId => {
      const possibleAnswers = flowData[questionId];
      answers[questionId] = getRandomItem(possibleAnswers);
    });
  } else {
    // Для i-know-where учитываем conditional logic
    // Сначала выбираем trip_structure
    const tripStructure = getRandomItem(flowData['trip_structure']);
    answers['trip_structure'] = tripStructure;
    
    // Теперь выбираем поля в зависимости от trip_structure
    if (tripStructure === '🏠 Single destination (one home base, can include day trips)') {
      // Single destination - нужны поля для single
      answers['destination_main'] = getRandomItem(flowData['destination_main']);
      answers['transport_mode'] = getRandomItem(flowData['transport_mode']);
      answers['day_trips_interest'] = getRandomItem(flowData['day_trips_interest']);
      answers['anchors_single'] = getRandomItem(flowData['anchors_single']);
    } else {
      // Multi destination - нужны поля для multi
      answers['stops'] = getRandomItem(flowData['stops']);
      answers['intercity_transport'] = getRandomItem(flowData['intercity_transport']);
      answers['stops_order_flex'] = getRandomItem(flowData['stops_order_flex']);
      answers['anchors_multi'] = getRandomItem(flowData['anchors_multi']);
    }
    
    // Общие поля для обоих типов
    answers['season_window_shared'] = getRandomItem(flowData['season_window_shared']);
    answers['trip_length_days_shared'] = getRandomItem(flowData['trip_length_days_shared']);
    answers['lodging_booked'] = getRandomItem(flowData['lodging_booked']);
    answers['lodging_type'] = getRandomItem(flowData['lodging_type']);
    answers['lodging_budget'] = getRandomItem(flowData['lodging_budget']);
    answers['party_type_shared'] = getRandomItem(flowData['party_type_shared']);
    answers['fitness_level_shared'] = getRandomItem(flowData['fitness_level_shared']);
    answers['balance_ratio_shared'] = getRandomItem(flowData['balance_ratio_shared']);
    answers['travel_style'] = getRandomItem(flowData['travel_style']);
    answers['activities'] = getRandomItem(flowData['activities']);
    answers['food_prefs_shared'] = getRandomItem(flowData['food_prefs_shared']);
    answers['guided_prefs'] = getRandomItem(flowData['guided_prefs']);
  }
  
  return {
    flowType,
    answers,
    startedAt: new Date(),
    completedAt: new Date()
  };
}

export default function SimpleTestPanel() {
  const [state, setState] = useState<SimpleTestPanelState>({
    isRunning: false,
    logs: []
  });

  useEffect(() => {
    // Логируем активацию test mode
    const logger = testRegistry.getLogger();
    logger.info('simple-test', 'panel_initialized', {
      timestamp: new Date().toISOString()
    });
  }, []);

  const handleTestFlow = async (flowType: 'inspire-me' | 'i-know-where') => {
    setState(prev => ({ ...prev, isRunning: true, generatedAnswers: null }));
    
    const logger = testRegistry.getLogger();
    
    try {
      // Генерируем случайные ответы
      const testData = generateRandomAnswers(flowType);
      
      logger.info('simple-test', 'random_generation', {
        flowType,
        answersCount: Object.keys(testData.answers).length,
        sampleAnswers: Object.keys(testData.answers).slice(0, 3)
      });

      setState(prev => ({ 
        ...prev, 
        isRunning: false, 
        generatedAnswers: testData,
        logs: logger.getLogs()
      }));

      // Запускаем настоящий виджет справа с этими данными
      if (typeof window !== 'undefined') {
        // Отправляем данные в настоящий виджет через custom event
        const event = new CustomEvent('testModeGenerate', { 
          detail: testData 
        });
        window.dispatchEvent(event);
      }

    } catch (error) {
      logger.error('simple-test', 'generation_failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      setState(prev => ({ 
        ...prev, 
        isRunning: false,
        logs: logger.getLogs()
      }));
    }
  };

  const handleTestEmail = async () => {
    setState(prev => ({ ...prev, isRunning: true }));
    
    const logger = testRegistry.getLogger();
    
    try {
      const testEmailData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        questionnaireSummary: { test: 'data' },
        flowType: 'test',
        tripGuideId: 'test-' + Date.now(),
        tags: ['test-email'],
        submittedAt: new Date()
      };
      
      logger.info('simple-test', 'email_test_start', {
        email: testEmailData.email,
        flowType: testEmailData.flowType
      });

      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testEmailData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        logger.info('simple-test', 'email_test_success', {
          contactId: result.contactId,
          response: result
        });
      } else {
        logger.error('simple-test', 'email_test_failed', {
          error: result.error || 'Unknown error'
        });
      }

      setState(prev => ({ 
        ...prev, 
        isRunning: false,
        logs: logger.getLogs()
      }));

    } catch (error) {
      logger.error('simple-test', 'email_test_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      setState(prev => ({ 
        ...prev, 
        isRunning: false,
        logs: logger.getLogs()
      }));
    }
  };

  const handleTestExperts = async (flowType?: 'inspire-me' | 'i-know-where') => {
    setState(prev => ({ ...prev, isRunning: true, logs: [] }));
    
    const logger = testRegistry.getLogger();
    logger.info('expert-test', 'started', { 
      timestamp: new Date().toISOString(),
      flowType: flowType || 'random'
    });

    try {
      // Импортируем готовые trip guides
      // const { inspireMeTestGuides, iKnowWhereTestGuides } = await import('@/data/preGeneratedTripGuides');
      const inspireMeTestGuides = [];
      const iKnowWhereTestGuides = [];
      
      let availableGuides;
      if (flowType === 'inspire-me') {
        availableGuides = inspireMeTestGuides;
      } else if (flowType === 'i-know-where') {
        availableGuides = iKnowWhereTestGuides;
      } else {
        // Случайный выбор из всех
        // const { allTestTripGuides } = await import('@/data/preGeneratedTripGuides');
        // availableGuides = allTestTripGuides;
        availableGuides = [];
      }
      
      // Выбираем случайный готовый trip guide из фильтрованного списка
      const randomTripGuide = availableGuides[Math.floor(Math.random() * availableGuides.length)];
      
      logger.info('expert-test', 'trip_guide_selected', {
        guideId: randomTripGuide.id,
        guideName: randomTripGuide.title,
        flowType: randomTripGuide.flowType,
        expertCount: randomTripGuide.expertIds.length,
        requestedFlowType: flowType || 'random'
      });

      setState(prev => ({
        ...prev,
        generatedAnswers: null, // Не нужны questionnaire данные
        logs: logger.getLogs()
      }));

      // Отправляем готовый trip guide с экспертами напрямую с bypass flag
      const event = new CustomEvent('testModeExpertDisplay', {
        detail: {
          tripGuide: randomTripGuide,
          expertIds: randomTripGuide.expertIds,
          bypassEmail: true // Новый флаг для обхода email gate
        }
      });
      window.dispatchEvent(event);

      logger.info('expert-test', 'expert_display_triggered', {
        guideId: randomTripGuide.id,
        expertIds: randomTripGuide.expertIds,
        bypassEmail: true
      });

      setState(prev => ({ 
        ...prev, 
        isRunning: false,
        logs: logger.getLogs()
      }));

    } catch (error) {
      logger.error('expert-test', 'expert_test_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      setState(prev => ({ 
        ...prev, 
        isRunning: false,
        logs: logger.getLogs()
      }));
    }
  };

  return (
    <div style={{ 
      width: '400px',
      height: '100vh',
      background: '#f8f9fa',
      borderRight: '1px solid #e9ecef',
      padding: '20px',
      fontSize: '14px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'auto'
    }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#495057', fontSize: '20px' }}>
          🧪 Simple Test Mode
        </h3>
        <div style={{ 
          padding: '8px 12px', 
          background: '#d4edda', 
          borderRadius: '4px',
          border: '1px solid #c3e6cb',
          fontSize: '12px',
          color: '#155724'
        }}>
          ✅ Ready • Click to generate random answers
        </div>
      </div>

      {/* Mobile View Toggle */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#495057' }}>📱 View Mode:</h4>
        <select 
          onChange={(e) => {
            const iframe = window.parent?.document?.querySelector('iframe');
            const widget = window.document.querySelector('.test-mode-environment')?.nextElementSibling as HTMLElement;
            
            if (e.target.value === 'mobile') {
              if (iframe) {
                iframe.style.maxWidth = '375px';
                iframe.style.margin = '0 auto';
                iframe.style.border = '2px solid #ddd';
              }
              if (widget) {
                widget.style.maxWidth = '375px';
                widget.style.margin = '0 auto';
              }
            } else {
              if (iframe) {
                iframe.style.maxWidth = '';
                iframe.style.margin = '';
                iframe.style.border = '';
              }
              if (widget) {
                widget.style.maxWidth = '';
                widget.style.margin = '';
              }
            }
          }}
          style={{ 
            width: '100%', 
            padding: '8px', 
            borderRadius: '4px', 
            border: '1px solid #ced4da',
            marginBottom: '12px'
          }}
        >
          <option value="desktop">🖥️ Desktop View</option>
          <option value="mobile">📱 Mobile View (375px)</option>
        </select>
      </div>

      {/* Test Buttons */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>Generate Test Data:</h4>
        
        <button
          onClick={() => handleTestFlow('inspire-me')}
          disabled={state.isRunning}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
            borderRadius: '6px',
            border: '1px solid #9ca3af',
            background: state.isRunning ? '#9ca3af' : '#f3f4f6',
            color: state.isRunning ? 'white' : '#6b7280',
            fontWeight: '500',
            cursor: state.isRunning ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {state.isRunning ? '⏳ Generating...' : '🌟 Test "Inspire Me" Flow'}
        </button>

        <button
          onClick={() => handleTestFlow('i-know-where')}
          disabled={state.isRunning}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #9ca3af',
            background: state.isRunning ? '#9ca3af' : '#f3f4f6',
            color: state.isRunning ? 'white' : '#6b7280',
            fontWeight: '500',
            cursor: state.isRunning ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {state.isRunning ? '⏳ Generating...' : '🗺️ Test "I Know Where" Flow'}
        </button>

        <button
          onClick={handleTestEmail}
          disabled={state.isRunning}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '12px',
            borderRadius: '6px',
            border: '1px solid #9ca3af',
            background: state.isRunning ? '#9ca3af' : '#f3f4f6',
            color: state.isRunning ? 'white' : '#6b7280',
            fontWeight: '500',
            cursor: state.isRunning ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          📧 Test Email Submission
        </button>

        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e9ecef' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#495057', fontSize: '13px' }}>Expert Testing (Bypass Email):</h4>
          
          <button
            onClick={() => handleTestExperts('inspire-me')}
            disabled={state.isRunning}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '8px',
              borderRadius: '6px',
              border: '1px solid #4A8B5C',
              background: state.isRunning ? '#9ca3af' : '#4A8B5C',
              color: 'white',
              fontWeight: '500',
              cursor: state.isRunning ? 'not-allowed' : 'pointer',
              fontSize: '13px'
            }}
          >
            🌟 Test Inspire Me Experts
          </button>

          <button
            onClick={() => handleTestExperts('i-know-where')}
            disabled={state.isRunning}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '8px',
              borderRadius: '6px',
              border: '1px solid #2D5AA0',
              background: state.isRunning ? '#9ca3af' : '#2D5AA0',
              color: 'white',
              fontWeight: '500',
              cursor: state.isRunning ? 'not-allowed' : 'pointer',
              fontSize: '13px'
            }}
          >
            🗺️ Test I Know Where Experts
          </button>

          <button
            onClick={() => handleTestExperts()}
            disabled={state.isRunning}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #6f42c1',
              background: state.isRunning ? '#9ca3af' : '#6f42c1',
              color: 'white',
              fontWeight: '500',
              cursor: state.isRunning ? 'not-allowed' : 'pointer',
              fontSize: '13px'
            }}
          >
            🎲 Test Random Expert Flow
          </button>
        </div>
      </div>

      {/* Generated Answers Display */}
      {state.generatedAnswers && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#495057' }}>
            📋 Generated Answers ({state.generatedAnswers.flowType}):
          </h4>
          <div style={{
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #e9ecef',
            background: '#f8f9fa',
            fontSize: '12px',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            {Object.entries(state.generatedAnswers.answers).map(([key, value]) => (
              <div key={key} style={{ 
                marginBottom: '8px',
                paddingBottom: '8px',
                borderBottom: '1px solid #dee2e6'
              }}>
                <strong style={{ color: '#495057' }}>{key}:</strong>
                <div style={{ 
                  marginTop: '2px',
                  color: '#6c757d',
                  wordBreak: 'break-word'
                }}>
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clear Button */}
      {state.generatedAnswers && (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setState(prev => ({ ...prev, generatedAnswers: undefined }))}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #dc3545',
              background: 'white',
              color: '#dc3545',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🗑️ Clear Generated Data
          </button>
        </div>
      )}

      {/* Logs */}
      {state.logs.length > 0 && (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <h4 style={{ margin: 0, color: '#495057' }}>
              📝 Activity Log ({state.logs.length}):
            </h4>
            <button
              onClick={() => {
                testRegistry.getLogger().clear();
                setState(prev => ({ ...prev, logs: [] }));
              }}
              style={{
                padding: '4px 8px',
                borderRadius: '3px',
                border: '1px solid #dc3545',
                background: 'white',
                color: '#dc3545',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
          <div style={{
            maxHeight: '200px',
            overflow: 'auto',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            background: 'white'
          }}>
            {state.logs.slice(-5).map((log) => (
              <div key={log.id} style={{
                padding: '8px',
                borderBottom: '1px solid #f8f9fa',
                fontSize: '11px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <span style={{
                    background: log.level === 'error' ? '#dc3545' : 
                               log.level === 'warn' ? '#ffc107' : '#28a745',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '2px',
                    fontSize: '10px'
                  }}>
                    {log.level.toUpperCase()}
                  </span>
                  <span style={{ color: '#6c757d', fontSize: '10px' }}>
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div style={{ color: '#495057' }}>
                  <strong>{log.scope}</strong> • {log.event}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        marginTop: '20px',
        padding: '12px',
        background: '#e3f2fd',
        border: '1px solid #bbdefb',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#1565c0'
      }}>
        <strong>💡 How to use:</strong>
        <br />
        1. Click a test button to generate random answers
        <br />
        2. View generated data on the left
        <br />
        3. See the real widget work on the right
      </div>

    </div>
  );
}