'use client';

import React, { useState } from 'react';
import ExpertSection from './ExpertSection';

interface ExpertTestDisplayProps {
  flowType: 'inspire-me' | 'i-know-where';
  testScenarioName: string;
  expertIds: string[];
}

export default function ExpertTestDisplay({
  flowType,
  testScenarioName,
  expertIds
}: ExpertTestDisplayProps) {
  return (
    <div className="alfie-expert-test-display">
      <div className="alfie-test-header">
        <h2 className="alfie-test-title">
          🧪 Expert Test Mode: {flowType === 'inspire-me' ? 'Inspire Me' : 'I Know Where'}
        </h2>
        <p className="alfie-test-scenario">
          <strong>Test Scenario:</strong> {testScenarioName}
        </p>
      </div>

      {flowType === 'inspire-me' ? (
        <div className="alfie-inspire-test-layout">
          <h3 className="alfie-section-title">🏞️ Adventure Ideas</h3>
          
          {expertIds.map((expertId, index) => (
            <div key={expertId} className="alfie-accordion-mock">
              <div className="alfie-accordion-header-mock">
                <span className="alfie-accordion-title-mock">
                  🏞️ Adventure Idea {index + 1}: Test Adventure
                </span>
                <span className="alfie-accordion-chevron-mock">⌄</span>
              </div>
              <div className="alfie-accordion-body-mock">
                <p>This is a sample adventure idea for testing expert display...</p>
                
                {/* Expert after accordion */}
                <ExpertSection 
                  expertIds={[expertId]} 
                  flowType="inspire-me"
                  className="alfie-expert-under-accordion"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alfie-know-where-test-layout">
          <h3 className="alfie-section-title">🌄 Why This Route Works</h3>
          
          <div className="alfie-mock-content">
            <p>This is sample content for "I Know Where" flow to show context for expert placement...</p>
            <p>The expert will appear at the end of all sections as designed.</p>
          </div>

          {/* Experts at the end for i-know-where flow */}
          <ExpertSection 
            expertIds={expertIds} 
            flowType="i-know-where"
            className="alfie-expert-at-end"
          />
        </div>
      )}

      <style jsx>{`
        .alfie-expert-test-display {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .alfie-test-header {
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }

        .alfie-test-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--alfie-text, #2E4B3E);
          margin: 0 0 8px 0;
        }

        .alfie-test-scenario {
          font-size: 16px;
          color: var(--alfie-text-light, #4A6741);
          margin: 0;
        }

        .alfie-section-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--alfie-text, #2E4B3E);
          margin: 0 0 20px 0;
        }

        .alfie-accordion-mock {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 16px;
          overflow: hidden;
        }

        .alfie-accordion-header-mock {
          background: #f9fafb;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .alfie-accordion-title-mock {
          font-size: 16px;
          font-weight: 600;
          color: var(--alfie-text, #2E4B3E);
        }

        .alfie-accordion-chevron-mock {
          font-size: 18px;
          color: #6b7280;
          transform: rotate(180deg);
        }

        .alfie-accordion-body-mock {
          padding: 20px;
          background: white;
        }

        .alfie-accordion-body-mock p {
          color: var(--alfie-text-light, #4A6741);
          line-height: 1.6;
          margin: 0 0 16px 0;
        }

        .alfie-mock-content {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .alfie-mock-content p {
          color: var(--alfie-text-light, #4A6741);
          line-height: 1.6;
          margin: 0 0 12px 0;
        }

        .alfie-mock-content p:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .alfie-expert-test-display {
            padding: 16px;
            margin: 16px;
          }

          .alfie-test-title {
            font-size: 20px;
          }

          .alfie-section-title {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}