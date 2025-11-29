import React from 'react';
import { Users } from 'lucide-react';
import { Website, TeamMember } from '../../types';

interface PreviewTeamSectionProps {
  website: Website;
  bgSecondary: string;
  isDark: boolean;
  handleAvatarError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const PreviewTeamSection: React.FC<PreviewTeamSectionProps> = ({
  website,
  bgSecondary,
  isDark,
  handleAvatarError,
}) => {
  const { content, theme } = website;

  if (content.team.length === 0) {
    return null; // Don't render section if no team members
  }

  // Use wheat/cream background for Team section
  const wheatBg = theme.colors?.brand50 || theme.secondary || '#fbf8f3';
  
  return (
    <section id="team" className="py-20 relative" style={{ backgroundColor: wheatBg }}>
      <style>{`
        .team-card {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .team-card:hover {
          transform: translateY(-8px);
        }
        .team-card-image-wrapper {
          position: relative;
          width: 100%;
          height: 320px;
          overflow: hidden;
        }
        .team-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .team-card:hover .team-card-image {
          transform: scale(1.1);
        }
        .team-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          display: flex;
          align-items: flex-end;
          padding: 24px;
        }
        .team-card:hover .team-card-overlay {
          opacity: 1;
        }
        .team-card-description {
          color: white;
          font-size: 14px;
          line-height: 1.6;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, padding 0.4s ease;
        }
        .team-card:hover .team-card-description {
          max-height: 200px;
        }
        .team-card-content {
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }
        .team-card:hover .team-card-content {
          padding-bottom: 16px;
        }
        .team-card-name {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
          transition: color 0.3s ease;
        }
        .team-card-role {
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: color 0.3s ease;
        }
      `}</style>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-5"
          style={{ backgroundColor: theme.primary }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-5"
          style={{ backgroundColor: theme.secondary }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ 
            backgroundColor: theme.primary + '15',
            border: `1px solid ${theme.primary}30`
          }}>
            <Users className="w-4 h-4" style={{ color: theme.primary }} />
            <span className="text-sm font-semibold" style={{ color: theme.primary }}>Team</span>
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: theme.primary }}>Meet Our Team</h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
            Get to know the talented individuals behind our success
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {content.team.map((member) => (
            <div
              key={member.id}
              className={`team-card ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-xl`}
            >
              <div className="team-card-image-wrapper">
                <img
                  src={member.image}
                  alt={member.name}
                  onError={handleAvatarError}
                  className="team-card-image"
                />
                {member.description && (
                  <div className="team-card-overlay">
                    <p className="team-card-description">{member.description}</p>
                  </div>
                )}
              </div>
              <div className={`team-card-content ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                <h3 className={`team-card-name ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {member.name}
                </h3>
                <p 
                  className={`team-card-role`}
                  style={{ color: theme.primary }}
                >
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
