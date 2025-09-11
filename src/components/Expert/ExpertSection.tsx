'use client';

import React, { useEffect, useState } from 'react';
import ExpertCard from './ExpertCard';

interface ExpertSectionProps {
  expertIds: string | string[];
  flowType: 'inspire-me' | 'i-know-where';
  className?: string;
}

interface ExpertData {
  id: string;
  name: string;
  profession: string;
  avatar?: string;
  link?: string;
  bio?: string;
}

export default function ExpertSection({ expertIds, flowType, className = '' }: ExpertSectionProps) {
  const [experts, setExperts] = useState<ExpertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpertDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Нормализуем expertIds в массив
        const ids = Array.isArray(expertIds) ? expertIds : [expertIds];
        
        // Параллельно запрашиваем всех экспертов
        const expertPromises = ids.map(async (id) => {
          const response = await fetch(`/api/expert-details?id=${id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch expert ${id}`);
          }
          const data = await response.json();
          return data.expert;
        });

        const expertsData = await Promise.all(expertPromises);
        setExperts(expertsData.filter(Boolean)); // Фильтруем null/undefined
      } catch (err) {
        console.error('Failed to fetch expert details:', err);
        setError('Failed to load expert information');
      } finally {
        setLoading(false);
      }
    };

    if (expertIds) {
      fetchExpertDetails();
    }
  }, [expertIds]);

  if (loading) {
    return (
      <div className={`alfie-expert-section loading ${className}`}>
        <div className="alfie-expert-header">
          <div className="alfie-expert-badge">Your expert picks:</div>
        </div>
        <div className="alfie-loading-placeholder">
          <div className="alfie-loading-spinner"></div>
          <span>Loading expert information...</span>
        </div>
        <style jsx>{`
          .alfie-expert-section.loading {
            margin: 24px 0;
            padding: 20px;
            background: #f9fafb;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
          }

          .alfie-expert-header {
            margin-bottom: 16px;
          }

          .alfie-expert-badge {
            background: var(--alfie-green, #4A8B5C);
            color: white;
            padding: 6px 16px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
          }

          .alfie-loading-placeholder {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #6b7280;
            font-size: 14px;
          }

          .alfie-loading-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid #e5e7eb;
            border-top-color: var(--alfie-green, #4A8B5C);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || experts.length === 0) {
    return null; // Не показываем ошибку, просто скрываем секцию
  }

  return (
    <div className={`alfie-expert-section ${className}`}>
      <div className="alfie-expert-header">
        <div className="alfie-expert-badge">Your expert picks:</div>
      </div>
      
      <div className={`alfie-experts-grid ${experts.length === 1 ? 'single' : 'multiple'}`}>
        {experts.map((expert) => (
          <ExpertCard
            key={expert.id}
            expert={expert}
          />
        ))}
      </div>

      <style jsx>{`
        .alfie-expert-section {
          margin: 32px 0;
          padding: 24px;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .alfie-expert-header {
          margin-bottom: 20px;
        }

        .alfie-expert-badge {
          background: var(--alfie-green, #4A8B5C);
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 15px;
          font-weight: 600;
          display: inline-block;
          box-shadow: 0 2px 4px rgba(74, 139, 92, 0.2);
        }

        .alfie-experts-grid {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .alfie-experts-grid.single {
          justify-content: flex-start;
        }

        .alfie-experts-grid.multiple {
          justify-content: flex-start;
        }

        @media (max-width: 768px) {
          .alfie-expert-section {
            padding: 16px;
            margin: 20px 0;
          }

          .alfie-experts-grid {
            flex-direction: column;
            gap: 12px;
          }

          .alfie-expert-badge {
            font-size: 14px;
            padding: 6px 16px;
          }
        }
      `}</style>
    </div>
  );
}