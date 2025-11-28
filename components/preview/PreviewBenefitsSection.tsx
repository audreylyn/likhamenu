import React from 'react';
import { Website } from '../../types';

interface PreviewBenefitsSectionProps {
  website: Website;
  isDark: boolean;
  textMuted: string;
}

// Helper function to darken a color
const darkenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - percent)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00ff) * (1 - percent)));
  const b = Math.max(0, Math.floor((num & 0x0000ff) * (1 - percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

export const PreviewBenefitsSection: React.FC<PreviewBenefitsSectionProps> = ({
  website,
  isDark,
  textMuted,
}) => {
  const { content, theme } = website;

  // Create dynamic gradient colors from theme
  const darkPrimary = darkenColor(theme.primary, 0.2);
  const darkButton = darkenColor(theme.button, 0.15);

  return (
    <section id="benefits" className="py-20">
      <style>{`
        .benefit-card-wrapper {
          position: relative;
          max-width: 300px;
          max-height: 320px;
          border-radius: 10px;
          padding: 2em 1.2em;
          margin: 12px;
          text-decoration: none;
          z-index: 0;
          overflow: hidden;
          font-family: Arial, Helvetica, sans-serif;
          width: 100%;
          cursor: pointer;
        }
        .benefit-card-corner {
          position: absolute;
          z-index: -1;
          top: -16px;
          right: -16px;
          height: 32px;
          width: 32px;
          border-radius: 32px;
          transform: scale(1);
          transform-origin: 50% 50%;
          transition: transform 0.35s ease-out;
        }
        .benefit-card-wrapper:hover .benefit-card-corner {
          transform: scale(28);
        }
        .benefit-card-title {
          color: #262626;
          font-size: 1.5em;
          line-height: normal;
          font-weight: 700;
          margin-bottom: 0.5em;
          transition: all 0.5s ease-out;
        }
        .benefit-card-wrapper:hover .benefit-card-title {
          color: #ffffff;
        }
        .benefit-card-desc {
          font-size: 1em;
          font-weight: 400;
          line-height: 1.5em;
          color: #452c2c;
          transition: all 0.5s ease-out;
        }
        .benefit-card-wrapper:hover .benefit-card-desc {
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4" style={{ color: theme.primary }}>Why Choose Us</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          {content.benefits.map(b => (
            <div
              key={b.id}
              className="benefit-card-wrapper"
              style={{
                background: `linear-gradient(to bottom, ${theme.secondary}, ${theme.primary}40)`,
              }}
            >
              {/* Corner element that expands on hover */}
              <div
                className="benefit-card-corner"
                style={{
                  background: `linear-gradient(135deg, ${darkPrimary}, ${darkButton})`,
                }}
              />
              
              {/* Arrow in corner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  width: '2em',
                  height: '2em',
                  overflow: 'hidden',
                  top: 0,
                  right: 0,
                  background: `linear-gradient(135deg, ${theme.primary}, ${darkButton})`,
                  borderRadius: '0 4px 0 32px',
                }}
              >
                <div
                  style={{
                    marginTop: '-4px',
                    marginRight: '-4px',
                    color: 'white',
                    fontFamily: 'courier, sans',
                  }}
                >
                  →
                </div>
              </div>

              {/* Card Title */}
              <p className="benefit-card-title">
                {b.title}
              </p>

              {/* Card Description */}
              <p className="benefit-card-desc">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
