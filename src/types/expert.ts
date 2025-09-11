// Простые типы для системы экспертов
export interface Expert {
  id: string;
  name: string;
  avatar?: string;
  description: string;
  specialties: string[];
  location?: string;
  link: string;
  rating?: number;
  reviewCount?: number;
  languages?: string[];
  isActive: boolean;
}

export interface ExpertCardProps {
  expert: Expert;
  matchScore?: number;
  onContactClick?: (expert: Expert) => void;
  className?: string;
  showMatchScore?: boolean;
}