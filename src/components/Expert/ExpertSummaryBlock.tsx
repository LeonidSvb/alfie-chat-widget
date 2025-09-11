import React from 'react';

interface ExpertSummaryBlockProps {
  className?: string;
}

export default function ExpertSummaryBlock({ className = '' }: ExpertSummaryBlockProps) {
  return (
    <div className={`alfie-expert-summary-block ${className}`}>
      <div className="alfie-summary-content">
        <h2 className="alfie-summary-title">Get your Adventure Fully Dialed</h2>
        <p className="alfie-summary-description">
          Refine your itinerary, ask questions, and get a plan you can trust — straight from a local expert who knows the area best.
        </p>
        <div className="alfie-summary-pricing">
          <span className="alfie-pricing-icon">📞</span>
          <span className="alfie-pricing-text">$65 for a 25-minute call + a customized TripGuide from your expert</span>
        </div>
      </div>

      <style jsx>{`
        .alfie-expert-summary-block {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin: 24px 0;
          border: 1px solid #e5e7eb;
        }

        .alfie-summary-content {
          max-width: 100%;
        }

        .alfie-summary-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 12px 0;
          line-height: 1.3;
        }

        .alfie-summary-description {
          font-size: 16px;
          color: #4b5563;
          line-height: 1.5;
          margin: 0 0 20px 0;
        }

        .alfie-summary-pricing {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background: #f0fdf4;
          border-radius: 8px;
          border: 1px solid #bbf7d0;
        }

        .alfie-pricing-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .alfie-pricing-text {
          font-size: 15px;
          color: #065f46;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .alfie-expert-summary-block {
            padding: 20px;
            margin: 20px 0;
          }

          .alfie-summary-title {
            font-size: 20px;
          }

          .alfie-summary-description {
            font-size: 15px;
          }

          .alfie-summary-pricing {
            padding: 14px;
          }

          .alfie-pricing-text {
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .alfie-expert-summary-block {
            padding: 16px;
            margin: 16px 0;
          }

          .alfie-summary-title {
            font-size: 18px;
          }

          .alfie-summary-description {
            font-size: 14px;
          }

          .alfie-summary-pricing {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
            padding: 12px;
          }

          .alfie-pricing-text {
            font-size: 13px;
            line-height: 1.4;
          }
        }
      `}</style>
    </div>
  );
}