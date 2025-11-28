import React from 'react';
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
        <h2 className="text-3xl font-bold mb-4" style={{ color: theme.primary }}>About Us</h2>
        <p className={`text-lg leading-relaxed ${textMuted}`}>
          {content.about}
        </p>
      </div>
    </section>
  );
};
