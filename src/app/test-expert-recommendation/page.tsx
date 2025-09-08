import React from 'react';
import ExpertRecommendationWrapper from '@/components/Expert/ExpertRecommendationWrapper';
import { getAllExperts } from '@/lib/airtable';

export default async function TestExpertRecommendationPage() {
  const experts = await getAllExperts();

  return <ExpertRecommendationWrapper expertsData={experts} />;
}