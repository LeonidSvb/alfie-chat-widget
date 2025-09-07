import React, { useState } from 'react';
import { QuestionnaireData, I_KNOW_WHERE_QUESTIONS } from '@/types/questionnaire';
import { useQuestionnaire } from '@/hooks/useQuestionnaire';
import { EmailSubmissionData } from '@/types/crm';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import InlineEmailGate from '@/components/EmailCollection/InlineEmailGate';

interface IKnowWhereFlowProps {
  onComplete: (data: QuestionnaireData) => void;
}

export default function IKnowWhereFlow({ onComplete }: IKnowWhereFlowProps) {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [showEmailGate, setShowEmailGate] = useState(true);
  
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    progress,
    isFirst,
    isLast,
    nextQuestion,
    prevQuestion,
    setAnswer,
    getQuestionnaireData,
    isCurrentQuestionValid
  } = useQuestionnaire(I_KNOW_WHERE_QUESTIONS, 'i-know-where');

  const handleNext = () => {
    if (!emailSubmitted) {
      return;
    }
    if (isLast && isCurrentQuestionValid()) {
      onComplete(getQuestionnaireData());
    } else if (isCurrentQuestionValid()) {
      nextQuestion();
    }
  };

  const handlePrev = () => {
    prevQuestion();
  };

  const handleAnswerChange = (value: any) => {
    if (currentQuestion && emailSubmitted) {
      setAnswer(currentQuestion.id, value);
    }
  };

  const handleEmailSubmit = async (data: EmailSubmissionData) => {
    try {
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        setEmailSubmitted(true);
        setShowEmailGate(false);
      }
    } catch (error) {
      console.error('Email submission failed:', error);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="alfie-loading">
        <div className="alfie-spinner"></div>
        <p>Loading your questionnaire...</p>
      </div>
    );
  }

  // Get trip structure for dynamic header
  const tripStructure = answers.trip_structure;
  let flowDescription = 'Create your perfect itinerary';
  
  if (tripStructure?.includes('Single destination')) {
    flowDescription = 'Plan your single destination adventure';
  } else if (tripStructure?.includes('Multi‑destination')) {
    flowDescription = 'Design your multi-destination journey';
  } else if (tripStructure?.includes('Roadtrip')) {
    flowDescription = 'Map out your epic roadtrip';
  }

  if (showEmailGate && !emailSubmitted) {
    const mockTripGuide = {
      id: 'flow-1-email',
      title: 'Trip Planning',
      flowType: 'i-know-where' as const,
      questionnaireSummary: {},
      tags: ['flow-1']
    };
    
    return (
      <div className="alfie-flow-container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--alfie-green)', marginBottom: '1rem' }}>Plan Your Trip</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Tell us about your destination to create the perfect itinerary</p>
        </div>
        <InlineEmailGate
          onEmailSubmit={handleEmailSubmit}
          isSubmitting={false}
          tripGuide={mockTripGuide}
          onSuccess={() => setShowEmailGate(false)}
        />
      </div>
    );
  }

  return (
    <div className="alfie-flow-container">
      {/* Progress */}
      <ProgressBar 
        current={currentQuestionIndex + 1} 
        total={totalQuestions}
      />

      {/* Question Card */}
      <div className="alfie-question-container">
        <QuestionCard
          question={currentQuestion}
          value={answers[currentQuestion.id]}
          onChange={handleAnswerChange}
          onNext={handleNext}
          onPrev={handlePrev}
          isFirst={isFirst}
          isLast={isLast}
          isValid={isCurrentQuestionValid()}
        />
      </div>
    </div>
  );
}