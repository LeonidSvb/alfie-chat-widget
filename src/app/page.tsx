'use client';

import React, { useState, useEffect } from 'react';
import WidgetContainer from '@/components/Widget/WidgetContainer';
import { TestModeWrapper } from '@/test-mode/TestModeWrapper';
import FlowSelector from '@/components/Questionnaire/FlowSelector';
import InspireMeFlow from '@/components/Questionnaire/InspireMeFlow';
import IKnowWhereFlow from '@/components/Questionnaire/IKnowWhereFlow';
import TripGuideLoading from '@/components/TripGuide/TripGuideLoading';
import TripGuideDisplay from '@/components/TripGuide/TripGuideDisplay';
import { FlowType, QuestionnaireData } from '@/types/questionnaire';
import { TripGuide } from '@/types/tripGuide';
import { setupIframeResizing, getEmbedConfig, triggerHeightUpdate, debugLog } from '@/lib/embedUtils';

type AppState = 'flow-selection' | 'questionnaire' | 'generating' | 'results';

export default function HomePage({
  searchParams
}: {
  searchParams?: { theme?: string; maxWidth?: string; embedded?: string; debug?: string; TestMod?: string }
}) {
  const [appState, setAppState] = useState<AppState>('flow-selection');
  const [selectedFlow, setSelectedFlow] = useState<FlowType | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);
  const [tripGuide, setTripGuide] = useState<TripGuide | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Get embed configuration
  const embedConfig = getEmbedConfig();
  const isEmbedded = searchParams?.embedded === 'true';
  
  const widgetConfig = {
    embedId: 'outdoorable-tripguide-widget',
    theme: (searchParams?.theme as 'light' | 'dark') || embedConfig.theme || 'light',
    maxWidth: searchParams?.maxWidth ? parseInt(searchParams.maxWidth) : embedConfig.maxWidth || 800,
  };

  // Setup iframe functionality
  useEffect(() => {
    debugLog('Widget initializing', { isEmbedded, embedConfig, widgetConfig });
    
    if (isEmbedded) {
      setupIframeResizing();
      debugLog('Iframe resizing setup completed');
    }
  }, [isEmbedded]);

  // Trigger height update when state changes (content changes)
  useEffect(() => {
    if (isEmbedded) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        triggerHeightUpdate();
        debugLog('Height update triggered for state change', { appState });
      }, 100);
    }
  }, [appState, isEmbedded]);

  // Test mode support - listen for test data from SimpleTestPanel
  useEffect(() => {
    const handleTestGenerate = async (event: CustomEvent) => {
      const testData = event.detail as QuestionnaireData;
      debugLog('Test mode data received', { flowType: testData.flowType });
      
      // Automatically run the questionnaire with test data
      setSelectedFlow(testData.flowType);
      setQuestionnaireData(testData);
      setAppState('generating');
      setGenerationError(null);
      
      // Generate trip guide with experts automatically - same logic as handleQuestionnaireComplete
      try {
        const response = await fetch('/api/generate-trip-with-experts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testData),
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('API Error Response:', text);
          throw new Error(`API Error (${response.status}): ${response.statusText}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to generate trip guide with experts');
        }

        // Add expert IDs to the trip guide object
        const guideWithExperts = {
          ...result.tripGuide,
          expertIds: result.selectedExpertIds
        };

        setTripGuide(guideWithExperts);
        setAppState('results');
        debugLog('Test mode trip guide with experts generated successfully', { 
          guideId: result.tripGuide.id,
          expertIds: result.selectedExpertIds
        });
      } catch (error) {
        console.error('Test mode trip guide generation failed:', error);
        setGenerationError(error instanceof Error ? error.message : 'Unknown error occurred');
        setAppState('results');
        debugLog('Test mode trip guide generation failed', { 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    };

    // Expert test mode - display pre-generated trip guide with experts
    const handleTestExpertDisplay = async (event: CustomEvent) => {
      const { tripGuide, expertIds, bypassEmail } = event.detail;
      debugLog('Expert test mode - displaying pre-generated trip guide', { 
        guideId: tripGuide.id,
        flowType: tripGuide.flowType,
        expertCount: expertIds.length,
        bypassEmail: bypassEmail || false
      });

      // Set state directly without generation
      setSelectedFlow(tripGuide.flowType);
      setQuestionnaireData(null); // No questionnaire data needed
      setTripGuide({
        ...tripGuide,
        expertIds: expertIds,
        bypassEmail: bypassEmail || false // Add bypass flag to trip guide
      });
      setAppState('results');
      setGenerationError(null);
    };

    window.addEventListener('testModeGenerate', handleTestGenerate as unknown as EventListener);
    window.addEventListener('testModeExpertDisplay', handleTestExpertDisplay as unknown as EventListener);
    
    return () => {
      window.removeEventListener('testModeGenerate', handleTestGenerate as unknown as EventListener);
      window.removeEventListener('testModeExpertDisplay', handleTestExpertDisplay as unknown as EventListener);
    };
  }, []);

  const handleFlowSelect = (flow: FlowType) => {
    setSelectedFlow(flow);
    setAppState('questionnaire');
    debugLog('Flow selected', { flow });
  };

  const handleQuestionnaireComplete = async (data: QuestionnaireData) => {
    setQuestionnaireData(data);
    setAppState('generating');
    setGenerationError(null);
    debugLog('Questionnaire completed, starting trip guide generation', { 
      flowType: data.flowType, 
      answerCount: Object.keys(data.answers).length 
    });

    try {
      // Call integrated API to generate trip guide with experts
      const response = await fetch('/api/generate-trip-with-experts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('API Error Response:', text);
        throw new Error(`API Error (${response.status}): ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate trip guide with experts');
      }

      // Add expert IDs to the trip guide object for frontend use
      const guideWithExperts = {
        ...result.tripGuide,
        expertIds: result.selectedExpertIds
      };

      setTripGuide(guideWithExperts);
      setAppState('results');
      debugLog('Trip guide with experts generated successfully', { 
        guideId: result.tripGuide.id,
        expertIds: result.selectedExpertIds,
        timing: result.timing
      });

    } catch (error) {
      console.error('Trip guide generation failed:', error);
      setGenerationError(error instanceof Error ? error.message : 'Unknown error occurred');
      setAppState('results');
      debugLog('Trip guide generation failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const handleBackToSelection = () => {
    setAppState('flow-selection');
    setSelectedFlow(null);
    setQuestionnaireData(null);
    setTripGuide(null);
    setGenerationError(null);
    debugLog('Reset to flow selection');
  };

  const renderCurrentState = () => {
    switch (appState) {
      case 'flow-selection':
        return <FlowSelector onFlowSelect={handleFlowSelect} />;
      
      case 'questionnaire':
        if (selectedFlow === 'inspire-me') {
          return <InspireMeFlow onComplete={handleQuestionnaireComplete} />;
        } else if (selectedFlow === 'i-know-where') {
          return <IKnowWhereFlow onComplete={handleQuestionnaireComplete} />;
        }
        return null;
      
      case 'generating':
        // Show Alfie LoadingAnimation while generating trip guide
        const destinationForFacts = questionnaireData?.answers?.destination_main || 
                                  questionnaireData?.answers?.specific_destination ||
                                  (questionnaireData?.flowType === 'i-know-where' ? 'Iceland' : undefined);
        
        return (
          <TripGuideLoading 
            userDestination={destinationForFacts}
            message="I'm analyzing your preferences and crafting the perfect outdoor adventure just for you..."
          />
        );
      
      case 'results':
        if (generationError) {
          // Show error state with detailed debugging info
          return (
            <div className="alfie-error-content">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>😞</div>
              <h2>Oops! Something went wrong</h2>
              <p>I had trouble creating your trip guide. Here's what happened:</p>
              
              <div style={{
                background: 'var(--alfie-light-green)',
                border: '1px solid var(--alfie-dark-green)',
                borderRadius: '12px',
                padding: '16px',
                margin: '20px 0',
                textAlign: 'left',
                fontSize: '14px',
                fontFamily: 'monospace',
                color: 'var(--alfie-text)'
              }}>
                <strong>Error Details:</strong><br />
                {generationError}
              </div>

              <button
                onClick={handleBackToSelection}
                className="alfie-retry-button"
                style={{ marginTop: '20px' }}
              >
                Try Again
              </button>

              {/* Debug questionnaire data */}
              {questionnaireData && (
                <details style={{ 
                  marginTop: '20px', 
                  textAlign: 'left',
                  background: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    Debug: Questionnaire Data
                  </summary>
                  <pre style={{ marginTop: '8px', overflow: 'auto' }}>
                    {JSON.stringify(questionnaireData, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          );
        }

        if (tripGuide) {
          // Show generated trip guide
          return (
            <TripGuideDisplay
              tripGuide={tripGuide}
              onEmailSubmit={(email, firstName, lastName) => {
                debugLog('Email submitted from trip guide', { email, firstName, lastName });
              }}
            />
          );
        }

        // Fallback state
        return (
          <div className="alfie-loading-section">
            <div className="alfie-loading-content">
              <h3>Something's not quite right...</h3>
              <p>Let me help you start over.</p>
              <button
                onClick={handleBackToSelection}
                className="alfie-retry-button"
                style={{ marginTop: '20px' }}
              >
                Start Over
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <TestModeWrapper searchParams={searchParams}>
      <WidgetContainer config={widgetConfig}>
        {renderCurrentState()}
      </WidgetContainer>
    </TestModeWrapper>
  );
}