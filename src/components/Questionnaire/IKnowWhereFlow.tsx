import React from 'react';
import { QuestionnaireData, I_KNOW_WHERE_QUESTIONS } from '@/types/questionnaire';
import { useQuestionnaire } from '@/hooks/useQuestionnaire';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';

interface IKnowWhereFlowProps {
  onComplete: (data: QuestionnaireData) => void;
  onBackToFlowSelection: () => void;
}

export default function IKnowWhereFlow({ onComplete, onBackToFlowSelection }: IKnowWhereFlowProps) {
  
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
    if (isLast && isCurrentQuestionValid()) {
      onComplete(getQuestionnaireData());
    } else if (isCurrentQuestionValid()) {
      nextQuestion();
    }
  };

  const handlePrev = () => {
    if (isFirst) {
      onBackToFlowSelection();
    } else {
      prevQuestion();
    }
  };

  const handleAnswerChange = (value: any) => {
    if (currentQuestion) {
      setAnswer(currentQuestion.id, value);
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