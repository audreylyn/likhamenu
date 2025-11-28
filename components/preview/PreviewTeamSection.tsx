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

  return (
    <section id="team" className={`py-20 ${bgSecondary}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className={`rounded-xl overflow-hidden shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            >
              <img
                src={member.image}
                alt={member.name}
                onError={handleAvatarError}
                className="w-full h-56 object-cover object-top"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
