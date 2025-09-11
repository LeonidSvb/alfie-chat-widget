'use client';

import React from 'react';
import { TripGuideDisplayProps } from '@/types/tripGuide';
import EmailGatedTripGuide from './EmailGatedTripGuide';

export default function TripGuideDisplay({
  tripGuide,
  onEmailSubmit,
  className = ''
}: TripGuideDisplayProps): JSX.Element {
  return (
    <EmailGatedTripGuide
      tripGuide={tripGuide}
      expertIds={(tripGuide as any).expertIds}
      onEmailSubmit={onEmailSubmit}
      className={className}
    />
  );
}