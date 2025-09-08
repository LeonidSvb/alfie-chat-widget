export interface Expert {
  id: string;
  name: string;
  avatar?: string;
  description: string;
  specialties: string[];
  tags: string[];
  link: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  languages?: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExpertMatchRequest {
  questionnaireSummary: Record<string, any>;
  flowType: 'inspire-me' | 'i-know-where';
  userTags?: string[];
}

export interface ExpertMatchResponse {
  success: boolean;
  expert?: Expert;
  matchScore?: number;
  error?: string;
  tagsUsed?: string[];
}

export interface ExpertCardProps {
  expert: Expert;
  matchScore?: number;
  onContactClick?: (expert: Expert) => void;
  className?: string;
  showMatchScore?: boolean;
}

export interface ExpertMatchingProps {
  questionnaireSummary: Record<string, any>;
  flowType: 'inspire-me' | 'i-know-where';
  userTags?: string[];
  onExpertFound?: (expert: Expert) => void;
}

export interface ExpertRecommendationProps {
  experts: Expert[];
  title?: string;
  description?: string;
  price?: string;
  onExpertClick?: (expert: Expert) => void;
}