'use client';

import React, { useEffect, useState } from 'react';
import ExpertRecommendation from './ExpertRecommendation';
import { Expert } from '@/types/expert';

interface ExpertRecommendationWrapperProps {
  expertsData: Expert[];
}

export default function ExpertRecommendationWrapper({ expertsData }: ExpertRecommendationWrapperProps) {
  const [experts] = useState<Expert[]>(expertsData);

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1>Expert Recommendation Component Test</h1>
      
      <section style={{ marginBottom: '40px' }}>
        <h2>Single Expert (First from Airtable)</h2>
        <ExpertRecommendation 
          experts={experts.slice(0, 1)} 
        />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Two Experts</h2>
        <ExpertRecommendation 
          experts={experts.slice(0, 2)} 
        />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Three Experts</h2>
        <ExpertRecommendation 
          experts={experts.slice(0, 3)} 
        />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Custom Props Test</h2>
        <ExpertRecommendation 
          experts={experts.slice(0, 1)}
          title="Custom Title Test"
          description="This is a custom description to test the prop functionality."
          price="$99 for custom test pricing"
        />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>All Available Experts ({experts.length} total)</h2>
        <div style={{ 
          background: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Expert Data Preview:</h3>
          {experts.map((expert, index) => (
            <div key={expert.id || index} style={{ 
              marginBottom: '10px',
              padding: '10px',
              background: 'white',
              borderRadius: '4px'
            }}>
              <strong>{expert.name}</strong> - {expert.specialties?.join(', ')}
              <br />
              <small>Location: {expert.location || 'Not specified'}</small>
              <br />
              <small>Avatar: {expert.avatar ? '✅ Has image' : '❌ No image'}</small>
              <br />
              <small>Link: {expert.link || 'No link'}</small>
            </div>
          ))}
        </div>
        
        <ExpertRecommendation 
          experts={experts.slice(0, Math.min(3, experts.length))} 
        />
      </section>
    </div>
  );
}