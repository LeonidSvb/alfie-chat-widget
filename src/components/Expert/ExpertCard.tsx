import React from 'react';

interface SimpleExpertCardProps {
  expert: {
    id: string;
    name: string;
    profession?: string;
    avatar?: string;
    link?: string;
    bio?: string;
    oneline_bio?: string;
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
        <div className="alfie-expert-photo">
          {expert.avatar ? (
            <img 
              src={expert.avatar} 
              alt={`${expert.name} profile`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzgiIHI9IjE2IiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0yMCA4MEM5IDgwIDI2IDY2IDM3IDY2SDYzQzc0IDY2IDkxIDgwIDgwIDgwSDIwWiIgZmlsbD0iIzlCOUI5QiIvPgo8L3N2Zz4K';
              }}
            />
          ) : (
            <div className="alfie-expert-placeholder">
              <div className="alfie-placeholder-icon">👤</div>
            </div>
          )}
        </div>
        
        <div className="alfie-expert-info">
          <h3 className="alfie-expert-name">{expert.name}</h3>
          {expert.profession && (
            <p className="alfie-expert-profession">({expert.profession})</p>
          )}
          {(expert.bio || expert.oneline_bio) && (
            <p className="alfie-expert-description">{expert.bio || expert.oneline_bio}</p>
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
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          border: none;
          box-shadow: none;
          max-width: 350px;
        }

        .alfie-expert-header {
          display: flex;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 16px;
        }

        .alfie-expert-photo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .alfie-expert-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .alfie-expert-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 50%;
        }

        .alfie-placeholder-icon {
          font-size: 32px;
          color: #9ca3af;
        }

        .alfie-expert-info {
          flex: 1;
          min-width: 0;
        }

        .alfie-expert-name {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
          line-height: 1.2;
        }

        .alfie-expert-profession {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .alfie-expert-description {
          font-size: 14px;
          color: #4b5563;
          line-height: 1.4;
          margin: 0;
        }

        .alfie-expert-actions {
          text-align: left;
        }

        .alfie-talk-to-expert-btn {
          background: var(--alfie-green, #4A8B5C);
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          border-radius: 6px;
          font-family: inherit;
          text-align: center;
          transition: all 0.2s ease;
        }

        .alfie-talk-to-expert-btn:hover {
          background: #3a7049;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .alfie-simple-expert-card {
            max-width: 100%;
            margin: 12px 0;
            padding: 14px;
          }

          .alfie-expert-photo {
            width: 70px;
            height: 70px;
          }

          .alfie-expert-header {
            gap: 14px;
          }

          .alfie-expert-name {
            font-size: 20px;
          }

          .alfie-expert-profession {
            font-size: 14px;
          }

          .alfie-expert-description {
            font-size: 13px;
          }

          .alfie-talk-to-expert-btn {
            font-size: 14px;
            padding: 10px 20px;
          }
        }

        @media (max-width: 480px) {
          .alfie-expert-photo {
            width: 60px;
            height: 60px;
          }

          .alfie-expert-header {
            gap: 12px;
          }

          .alfie-expert-name {
            font-size: 18px;
          }

          .alfie-expert-profession {
            font-size: 13px;
          }

          .alfie-expert-description {
            font-size: 12px;
          }

          .alfie-talk-to-expert-btn {
            font-size: 13px;
            padding: 10px 18px;
          }
        }
      `}</style>
    </div>
  );
}