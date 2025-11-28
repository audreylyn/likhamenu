import React from 'react';
import { Info } from 'lucide-react';
import { Website } from '../../types';

interface PreviewAboutSectionProps {
  website: Website;
  bgSecondary: string;
  textMuted: string;
}

export const PreviewAboutSection: React.FC<PreviewAboutSectionProps> = ({
  website,
  bgSecondary,
  textMuted,
}) => {
  const { content, theme } = website;

  return (
    <section id="about" className={`py-16 ${bgSecondary}`}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ 
          backgroundColor: theme.primary + '15',
          border: `1px solid ${theme.primary}30`
        }}>
          <Info className="w-4 h-4" style={{ color: theme.primary }} />
          <span className="text-sm font-semibold" style={{ color: theme.primary }}>About</span>
        </div>
        <h2 className="text-3xl font-bold mb-4" style={{ color: theme.primary }}>About Us</h2>
        <p className={`text-lg leading-relaxed ${textMuted} max-w-2xl mx-auto mb-8`}>
          Learn more about who we are and what we stand for
        </p>
        <p className={`text-lg leading-relaxed ${textMuted}`}>
          {content.about}
        </p>
      </div>
    </section>
  );
};
