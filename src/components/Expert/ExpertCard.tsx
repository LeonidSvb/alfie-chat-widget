import React from 'react';

interface SimpleExpertCardProps {
  expert: {
    id: string;
    name: string;
    profession?: string;
    avatar?: string;
    link?: string;
  };
  className?: string;
  onContactClick?: (expert: any) => void;
}

export default function ExpertCard({
  expert,
  className = '',
  onContactClick
}: SimpleExpertCardProps) {
  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick(expert);
    } else if (expert.link) {
      window.open(expert.link, '_blank', 'noopener,noreferrer');
    }
  };

  // Защита от undefined имени
  const firstName = expert.name ? expert.name.split(' ')[0] : 'Expert';

  // Если нет основных данных, показываем placeholder
  if (!expert.name) {
    return (
      <div className={`alfie-simple-expert-card ${className}`}>
        <div className="alfie-expert-header">
          <div className="alfie-expert-info">
            <h3 className="alfie-expert-name">Loading expert...</h3>
            <p className="alfie-expert-profession">(Professional Guide)</p>
          </div>
        </div>
        <div className="alfie-expert-actions">
          <button 
            className="alfie-talk-to-expert-btn"
            disabled
            type="button"
          >
            Loading...
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`alfie-simple-expert-card ${className}`}>
      <div className="alfie-expert-header">
        {expert.avatar && (
          <div className="alfie-expert-avatar">
            <img 
              src={expert.avatar} 
              alt={`${expert.name} profile`}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="alfie-expert-info">
          <h3 className="alfie-expert-name">{expert.name}</h3>
          {expert.profession && (
            <p className="alfie-expert-profession">({expert.profession})</p>
          )}
        </div>
      </div>

      <div className="alfie-expert-actions">
        <button 
          className="alfie-talk-to-expert-btn"
          onClick={handleContactClick}
          type="button"
        >
          Talk to {firstName}
        </button>
      </div>

      <style jsx>{`
        .alfie-simple-expert-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          margin: 16px 0;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          max-width: 280px;
        }

        .alfie-expert-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          gap: 12px;
        }

        .alfie-expert-avatar {
          flex-shrink: 0;
        }

        .alfie-expert-avatar img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: none;
        }

        .alfie-expert-info {
          flex: 1;
          min-width: 0;
        }

        .alfie-expert-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 2px 0;
          line-height: 1.2;
        }

        .alfie-expert-profession {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
          line-height: 1.2;
        }

        .alfie-expert-actions {
          text-align: left;
        }

        .alfie-talk-to-expert-btn {
          background: none;
          color: #1f2937;
          border: none;
          padding: 0;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
          font-family: inherit;
          text-align: left;
        }

        .alfie-talk-to-expert-btn:hover {
          color: var(--alfie-green, #4A8B5C);
        }

        @media (max-width: 480px) {
          .alfie-simple-expert-card {
            padding: 12px;
            margin: 12px 0;
            max-width: 100%;
          }

          .alfie-expert-header {
            gap: 10px;
          }

          .alfie-expert-avatar img {
            width: 40px;
            height: 40px;
          }

          .alfie-expert-name {
            font-size: 15px;
          }

          .alfie-expert-profession {
            font-size: 12px;
          }

          .alfie-talk-to-expert-btn {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}