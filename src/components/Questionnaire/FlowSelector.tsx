import React from 'react';
import Image from 'next/image';
import { FlowType } from '@/types/questionnaire';

interface FlowSelectorProps {
  onFlowSelect: (flow: FlowType) => void;
}

export default function FlowSelector({ onFlowSelect }: FlowSelectorProps) {
  return (
    <div className="alfie-flow-selection">
      <div className="alfie-intro">
        <div className="alfie-avatar-main">
          <Image src="/images/alfie.png" alt="Alfie" width={60} height={60} />
        </div>
        <div className="alfie-greeting">
          <h2 className="alfie-question-text-simple">
            Hi, I'm Alfie 👋 Tell me what you're dreaming up and I'll share free tailored trip ideas to inspire your next adventure.
          </h2>
        </div>
      </div>
      
      <div className="alfie-flow-buttons">
        <button 
          className="alfie-flow-button" 
          onClick={() => onFlowSelect('inspire-me')}
        >
          💡 Inspire me — I'm not sure where to go yet
          <span className="alfie-flow-arrow">→</span>
        </button>
        <button 
          className="alfie-flow-button" 
          onClick={() => onFlowSelect('i-know-where')}
        >
          🗺️ I know my destination — help with recs & itinerary
          <span className="alfie-flow-arrow">→</span>
        </button>
      </div>
    </div>
  );
}