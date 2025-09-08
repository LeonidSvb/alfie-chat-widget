'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TripGuide } from '@/types/tripGuide';
import { EmailSubmissionData, CRMSubmissionResponse } from '@/types/crm';
import InlineEmailGate from '@/components/EmailCollection/InlineEmailGate';
import AIContentRenderer from './AIContentRenderer';
import TripGuideChips from './TripGuideChips';

interface EmailGatedTripGuideProps {
  tripGuide: TripGuide;
  onEmailSubmit?: (email: string, firstName?: string, lastName?: string) => void;
  className?: string;
}

type ParsedSection = { key: string; title: string; body: string };
type ParsedFacts = {
  tripType?: string;
  tripLength?: string;
  season?: string;
  group?: string;
  style?: string;
};

export default function EmailGatedTripGuide({
  tripGuide,
  onEmailSubmit,
  className = ''
}: EmailGatedTripGuideProps): JSX.Element {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Check if email was already submitted for this guide
  useEffect(() => {
    const storageKey = `tripguide-email-submitted-${tripGuide.id}`;
    const hasSubmitted = sessionStorage.getItem(storageKey) === 'true';
    if (hasSubmitted) {
      setEmailSubmitted(true);
    }
  }, [tripGuide.id]);

  const handleEmailSubmit = async (data: EmailSubmissionData) => {
    setIsSubmitting(true);
    setError(undefined);

    try {
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result: CRMSubmissionResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit email');
      }

      // Success
      const storageKey = `tripguide-email-submitted-${tripGuide.id}`;
      sessionStorage.setItem(storageKey, 'true');
      setEmailSubmitted(true);
      onEmailSubmit?.(data.email, data.firstName, data.lastName);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Unified parsing logic for both flows
  const { facts, sections } = useMemo(() => {
    const lines = tripGuide.content.split('\n').map(l => l.trim()).filter(Boolean);
    
    // Parse facts (same for both flows)
    const facts: ParsedFacts = {};
    const factPatterns: Array<[keyof ParsedFacts, RegExp[]]> = [
      ['tripType', [/^Trip\s*Type[:\s]+(.+)/i]],
      ['tripLength', [/^Trip\s*Length[:\s]+(.+)/i]],
      ['season', [/^Season[:\s]+(.+)/i]],
      ['group', [/^Group[:\s]+(.+)/i]],
      ['style', [/^Style[:\s]+(.+)/i]],
    ];

    for (const line of lines) {
      for (const [key, patterns] of factPatterns) {
        for (const re of patterns) {
          const m = line.match(re);
          if (m && !facts[key]) {
            facts[key] = m[1].trim();
          }
        }
      }
    }

    // Parse sections based on flow type
    const sections: ParsedSection[] = [];
    
    if (tripGuide.flowType === 'inspire-me') {
      // Parse Adventure Ideas for inspire-me - more flexible pattern matching
      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        // Match various formats: "🏞️ Adventure Idea 1:", "Adventure Idea 1:", "🏞️Adventure Idea 1", etc.
        if (/(?:🏞️\s*)?Adventure\s*Idea\s*\d+[:\.]?/i.test(line)) {
          const title = line;
          const key = title.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
          const bodyLines: string[] = [];
          i++;
          
          // Continue until we hit another Adventure Idea or end of content
          while (i < lines.length && !/(?:🏞️\s*)?Adventure\s*Idea\s*\d+[:\.]?/i.test(lines[i])) {
            bodyLines.push(lines[i]);
            i++;
          }
          
          sections.push({ key, title, body: bodyLines.join('\n').trim() });
          continue;
        }
        i++;
      }
    } else {
      // Parse headers for i-know-where
      const knownHeaders = [
        '🌄 Why This Route Works',
        '✈️ Travel Snapshot', 
        '🚗 Recommended Transportation',
        '🧳 What to Book Now',
        '🥾 Outdoor Activities to Prioritize',
        '🏛️ Top Cultural Experiences',
        "🧠 Things You Maybe Haven't Thought Of",
        '🧭 The Approach: Flexible Itinerary Flow'
      ];
      const isHeader = (line: string) => knownHeaders.some(h => line.startsWith(h));
      
      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        if (isHeader(line)) {
          const title = line;
          const key = title.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
          const bodyLines: string[] = [];
          i++;
          while (i < lines.length && !isHeader(lines[i])) {
            bodyLines.push(lines[i]);
            i++;
          }
          sections.push({ key, title, body: bodyLines.join('\n').trim() });
          continue;
        }
        i++;
      }
    }

    return { facts, sections };
  }, [tripGuide.content, tripGuide.flowType]);

  // Show email gate if not submitted
  if (!emailSubmitted) {
    return (
      <div className={`alfie-guide-container ${className}`}>
        <div className="alfie-guide-scroll-area">
          <article className="alfie-guide-article">
            {/* Trip Guide Header */}
            <header className="alfie-guide-header">
              <h1 className="alfie-guide-title">{tripGuide.title}</h1>
            </header>

            {/* Teaser facts (chips) */}
            <TripGuideChips facts={facts} />

            {/* Email Gate */}
            <InlineEmailGate
              onEmailSubmit={handleEmailSubmit}
              isSubmitting={isSubmitting}
              tripGuide={tripGuide}
            />

            {error && (
              <div style={{ 
                color: '#dc2626', 
                background: '#fef2f2', 
                padding: '12px', 
                borderRadius: '6px',
                border: '1px solid #fca5a5',
                margin: '16px 0',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
          </article>
        </div>
      </div>
    );
  }

  // Show full content after email submitted
  return (
    <div className={`alfie-guide-container ${className}`}>
      <div className="alfie-guide-scroll-area">
        <article className="alfie-guide-article">
          {/* Trip Guide Header */}
          <header className="alfie-guide-header">
            <h1 className="alfie-guide-title">{tripGuide.title}</h1>
          </header>

          {/* Teaser facts (chips) */}
          <TripGuideChips facts={facts} />

          {/* Trip Guide Content */}
          <div>
            {sections.length > 0 ? (
              <div className="alfie-accordion">
                {/* Always show "Why This Route Works" section open */}
                {sections.filter(s => s.title.startsWith('🌄')).map(s => (
                  <div key={s.key} className="alfie-accordion-item open">
                    <div className="alfie-accordion-header">
                      <span className="alfie-accordion-title">{s.title}</span>
                    </div>
                    <div className="alfie-accordion-body alfie-section-standard">
                      <AIContentRenderer content={s.body} />
                    </div>
                  </div>
                ))}

                {/* Interactive accordions for other sections */}
                {sections.filter(s => !s.title.startsWith('🌄')).map(s => (
                  <AccordionSection key={s.key} section={s} />
                ))}
              </div>
            ) : (
              <AIContentRenderer content={tripGuide.content} />
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

// Individual accordion section component
function AccordionSection({ section }: { section: ParsedSection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`alfie-accordion-item ${isOpen ? 'open' : ''}`}>
      <button 
        type="button" 
        className="alfie-accordion-header" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="alfie-accordion-title">{section.title}</span>
        <span className={`alfie-accordion-chevron ${isOpen ? 'rotated' : ''}`}>⌄</span>
      </button>
      {isOpen && (
        <div className="alfie-accordion-body alfie-section-standard">
          <AIContentRenderer content={section.body} />
        </div>
      )}
    </div>
  );
}