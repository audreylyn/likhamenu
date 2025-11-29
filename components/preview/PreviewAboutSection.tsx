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
  
  // Handle legacy about data (string) vs new structure (object)
  const about = typeof content.about === 'string' 
    ? { image: '', subtitle: '', title: 'About Us', paragraphs: [content.about] }
    : content.about;

  // Use white background for About section
  return (
    <section id="about" className="py-20 relative bg-white">
      <style>{`
        .about-image {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .about-image img {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .about-image:hover img {
          transform: scale(1.05);
        }
        .about-divider {
          height: 2px;
          width: 60px;
          margin-top: 12px;
          margin-bottom: 24px;
          transition: width 0.3s ease;
        }
        .about-content:hover .about-divider {
          width: 80px;
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="about-image">
            {about.image ? (
              <img
                src={about.image}
                alt={about.title || "About Us"}
                className="w-full h-full object-cover"
                style={{ minHeight: '500px' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/800x600?text=About+Us';
                }}
              />
            ) : (
              <div 
                className="w-full bg-slate-200 flex items-center justify-center"
                style={{ minHeight: '500px' }}
              >
                <p className="text-slate-400">Add an image</p>
              </div>
            )}
          </div>

          {/* Right: Content */}
          <div className="about-content">
            {about.subtitle && (
              <p 
                className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: theme.primary }}
              >
                {about.subtitle}
              </p>
            )}
            <h2 
              className="text-4xl font-bold mb-4"
              style={{ color: theme.primary }}
            >
              {about.title || 'About Us'}
            </h2>
            <div 
              className="about-divider"
              style={{ backgroundColor: theme.primary }}
            />
            <div className="space-y-4">
              {about.paragraphs && about.paragraphs.length > 0 ? (
                about.paragraphs.map((paragraph, index) => (
                  <p 
                    key={index} 
                    className={`text-base leading-relaxed ${textMuted}`}
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className={`text-base leading-relaxed ${textMuted}`}>
                  Add your story here...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
