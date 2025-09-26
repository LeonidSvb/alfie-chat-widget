import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Question } from '@/types/questionnaire';

export interface QuestionCardProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onPrev?: () => void;
  isFirst: boolean;
  isLast: boolean;
  isValid: boolean;
}

export default function QuestionCard({
  question,
  value,
  onChange,
  onNext,
  onPrev,
  isFirst,
  isLast,
  isValid
}: QuestionCardProps) {
  const [otherText, setOtherText] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [justNavigatedBack, setJustNavigatedBack] = useState(false);

  // Автоматический переход для single-choice
  useEffect(() => {
    if (question.type === 'single-choice' && value && isValid && !justNavigatedBack) {
      const timer = setTimeout(() => {
        onNext();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [value, question.type, isValid, onNext, justNavigatedBack]);

  // Очистка Other input при смене вопроса
  useEffect(() => {
    setOtherText('');
    setShowOtherInput(false);
    setJustNavigatedBack(false);
  }, [question.id]);

  const handlePrev = () => {
    setJustNavigatedBack(true);
    if (onPrev) onPrev();
  };

  const handleSingleChoice = (option: string) => {
    onChange(option);
  };

  const handleMultipleChoice = (option: string) => {
    const currentValue = Array.isArray(value) ? value : [];
    const newValue = currentValue.includes(option)
      ? currentValue.filter(v => v !== option)
      : [...currentValue, option];
    onChange(newValue);
  };

  const handleMultiWithOther = (option: string) => {
    const currentValue = Array.isArray(value) ? value : [];
    const newValue = currentValue.includes(option)
      ? currentValue.filter(v => v !== option)
      : [...currentValue, option];
    onChange(newValue);
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    if (text.trim()) {
      const currentValue = Array.isArray(value) ? value : [];
      // Remove any previous "other" entries and add new one
      const filteredValue = currentValue.filter(v => !v.startsWith('Other: '));
      const newValue = [...filteredValue, `Other: ${text.trim()}`];
      onChange(newValue);
    } else {
      // Remove other entry if text is empty
      const currentValue = Array.isArray(value) ? value : [];
      const filteredValue = currentValue.filter(v => !v.startsWith('Other: '));
      onChange(filteredValue);
    }
  };

  const handleTextChange = (text: string) => {
    onChange(text);
  };

  const renderInput = () => {
    switch (question.type) {
      case 'single-choice':
        return (
          <>
            {question.options?.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSingleChoice(option)}
                className={`alfie-option-button ${value === option ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
          </>
        );

      case 'multiple-choice':
        return (
          <>
            {question.options?.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleMultipleChoice(option)}
                className={`alfie-multi-option-button ${Array.isArray(value) && value.includes(option) ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
          </>
        );

      case 'multi-with-other':
        return (
          <>
            {question.options?.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleMultiWithOther(option)}
                className={`alfie-multi-option-button ${Array.isArray(value) && value.includes(option) ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
            
            {question.hasOtherOption && (
              <div className="alfie-other-input-container">
                <input
                  key={`${question.id}-other`}
                  type="text"
                  value={otherText}
                  onChange={(e) => handleOtherTextChange(e.target.value)}
                  placeholder="Type your answer here..."
                  className="alfie-other-input"
                />
              </div>
            )}

          </>
        );

      case 'text':
        return (
          <div className="alfie-custom-input" style={{gridColumn: '1 / -1'}}>
            <input
              key={question.id}
              type="text"
              value={value || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={question.placeholder}
              className="alfie-input"
            />
          </div>
        );

      case 'range':
        return (
          <div className="alfie-custom-input" style={{gridColumn: '1 / -1'}}>
            <input
              key={question.id}
              type="range"
              min={question.min || 0}
              max={question.max || 100}
              value={value || question.min || 0}
              onChange={(e) => onChange(parseInt(e.target.value))}
              className="alfie-input"
              style={{appearance: 'auto'}}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--alfie-text-light)', marginTop: '8px'}}>
              <span>{question.min || 0}</span>
              <span style={{fontWeight: '600', color: 'var(--alfie-green)'}}>{value || question.min || 0}</span>
              <span>{question.max || 100}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="alfie-questions-section">
      {/* Question Display */}
      <div className="alfie-question-display-simple">
        <Image
          src="/images/alfie-avatar.png"
          alt="Alfie"
          width={32}
          height={32}
          className="alfie-question-avatar"
          priority
        />
        <div className="alfie-question-content">
          <h2 className="alfie-question-text-simple">
            {question.text}
          </h2>
          {/* Multi-select hint */}
          {(question.type === 'multiple-choice' || question.type === 'multi-with-other') && (
            <p style={{
              fontSize: '14px',
              color: 'var(--alfie-text-light)',
              margin: '8px 0 0 0',
              fontStyle: 'italic'
            }}>
              select as many as you like
            </p>
          )}
        </div>
      </div>

      {/* Answer Options */}
      <div className="alfie-answer-options">
        {renderInput()}
      </div>

      {/* Navigation - для всех типов кроме single-choice */}
      {(question.type === 'multiple-choice' || question.type === 'multi-with-other' || question.type === 'text' || question.type === 'range') && (
        <div className="alfie-navigation">
          <button
            onClick={handlePrev}
            className="alfie-nav-button"
          >
            {isFirst ? '← Choose Flow' : '← Back'}
          </button>
          <button
            onClick={onNext}
            disabled={!isValid}
            className={`alfie-nav-button ${isValid ? 'primary' : ''}`}
          >
            {isLast ? '✓ Complete' : 'Next →'}
          </button>
        </div>
      )}

      {/* Navigation для single-choice - только кнопка назад */}
      {question.type === 'single-choice' && (
        <div className="alfie-navigation" style={{ justifyContent: 'flex-start' }}>
          <button
            onClick={handlePrev}
            className="alfie-nav-button"
          >
            {isFirst ? '← Choose Flow' : '← Back'}
          </button>
        </div>
      )}
    </div>
  );
}