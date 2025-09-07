import React from 'react';

interface TripGuideChipsProps {
  facts: {
    tripType?: string;
    tripLength?: string;
    season?: string;
    group?: string;
    style?: string;
  };
}

export default function TripGuideChips({ facts }: TripGuideChipsProps) {
  return (
    <>
      {(facts.tripType || facts.tripLength || facts.season || facts.group || facts.style) && (
        <div className="alfie-guide-meta-chips">
          {facts.tripType && <span className="alfie-chip chip-triptype">{facts.tripType}</span>}
          {facts.tripLength && <span className="alfie-chip chip-triplength">{facts.tripLength}</span>}
          {facts.season && <span className="alfie-chip chip-season">{facts.season}</span>}
          {facts.group && <span className="alfie-chip chip-group">{facts.group}</span>}
          {facts.style && <span className="alfie-chip chip-style">{facts.style}</span>}
        </div>
      )}
    </>
  );
}