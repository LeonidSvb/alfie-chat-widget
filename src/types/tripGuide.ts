export interface TripGuide {
  id: string;
  flowType: 'inspire-me' | 'i-know-where';
  title: string;
  content: string;
  generatedAt: Date;
  questionnaireSummary: Record<string, any>;
  tags: string[];
  estimatedReadTime?: number;
  bypassEmail?: boolean; // For test mode - skip email collection
}

export interface TripGuideSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface GenerateGuideRequest {
  questionnaireSummary: Record<string, any>;
  flowType: 'inspire-me' | 'i-know-where';
  userInputs: Record<string, any>;
}

export interface GenerateGuideResponse {
  success: boolean;
  guide?: TripGuide;
  error?: string;
}

export interface TripGuideDisplayProps {
  tripGuide: TripGuide;
  onEmailSubmit?: (email: string, firstName?: string, lastName?: string) => void;
  showPartialContent?: boolean;
  partialPercentage?: number;
  className?: string;
}