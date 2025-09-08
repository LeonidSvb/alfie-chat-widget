'use client';

import React from 'react';
import { Expert, ExpertRecommendationProps } from '@/types/expert';
import styles from './ExpertRecommendation.module.css';

export default function ExpertRecommendation({
  experts,
  title = "Get your Adventure Fully Dialed",
  description = "Refine your itinerary, ask questions, and get a plan you can trust — straight from a local expert who knows the area best.",
  price = "$65 for a 25-minute call + a customized TripGuide from your expert",
  onExpertClick
}: ExpertRecommendationProps) {
  
  const handleExpertClick = (expert: Expert) => {
    if (onExpertClick) {
      onExpertClick(expert);
    } else if (expert.link) {
      window.open(expert.link, '_blank', 'noopener,noreferrer');
    }
  };

  const getExpertProfession = (expert: Expert) => {
    return expert.specialties && expert.specialties.length > 0 
      ? expert.specialties[0] 
      : 'Travel Expert';
  };

  const getExpertLocation = (expert: Expert) => {
    if (expert.location) {
      // Extract main location from expert.location field
      const locations = expert.location.split(',');
      return locations[0].trim();
    }
    return 'Destination';
  };

  if (experts.length === 0) {
    return null;
  }

  return (
    <div className={styles.alfieExpertRecommendation}>
      <div className={styles.alfieRecommendationHeader}>
        <h2 className={styles.alfieRecommendationTitle}>{title}</h2>
        <p className={styles.alfieRecommendationDescription}>{description}</p>
        <div className={styles.alfieRecommendationPrice}>
          📞 {price}
        </div>
      </div>

      <div className={styles.alfieExpertPicksSection}>
        <div className={styles.alfieExpertPicksHeader}>
          Your expert picks:
        </div>
        
        <div className={`${styles.alfieExpertsGrid} ${styles[`alfieExpertsCount${experts.length}`]}`}>
          {experts.map((expert, index) => (
            <div key={expert.id || index} className={styles.alfieExpertPickCard}>
              <div className={styles.alfieExpertAvatar}>
                {expert.avatar ? (
                  <img 
                    src={expert.avatar} 
                    alt={`${expert.name} profile`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className={styles.alfieExpertAvatarPlaceholder}>
                    {expert.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className={styles.alfieExpertInfo}>
                <h3 className={styles.alfieExpertName}>{expert.name}</h3>
                <p className={styles.alfieExpertProfession}>({getExpertProfession(expert)})</p>
                <p className={styles.alfieExpertLocation}>({getExpertLocation(expert)}) Expert</p>
                
                <button 
                  className={styles.alfieTalkToExpertBtn}
                  onClick={() => handleExpertClick(expert)}
                  type="button"
                >
                  Talk to {expert.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}