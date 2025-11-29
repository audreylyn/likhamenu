import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Website } from '../../types';

interface PreviewCallToActionSectionProps {
  website: Website;
}

export const PreviewCallToActionSection: React.FC<PreviewCallToActionSectionProps> = ({
  website,
}) => {
  const { content } = website;
  const cta = content.callToAction;

  if (!cta || !cta.text || !cta.buttons || cta.buttons.length === 0) {
    return null;
  }

  // Helper to get warm brown colors
  const lightBrown = 'rgba(180, 130, 80, 0.95)';
  const darkBrown = cta.backgroundColor || '#8B5A3C';

  return (
    <section id="cta" className="py-20 relative overflow-hidden">
      <style>{`
        .cta-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.03) 10px, rgba(255, 255, 255, 0.03) 20px),
            repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.02) 10px, rgba(255, 255, 255, 0.02) 20px);
          opacity: 0.4;
        }
        .cta-button-solid {
          transition: all 0.3s ease;
        }
        .cta-button-solid:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        .cta-button-outlined {
          transition: all 0.3s ease;
        }
        .cta-button-outlined:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
      `}</style>
      
      {/* Dark brown background */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: darkBrown }}
      />
      
      {/* Subtle pattern overlay */}
      <div className="cta-pattern" />
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
        {/* Heading */}
        <h2 
          className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
          style={{ 
            color: 'white',
            fontFamily: 'serif'
          }}
        >
          {cta.text}
        </h2>
        
        {/* Description */}
        {cta.description && (
          <p 
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
            style={{ color: 'white' }}
          >
            {cta.description}
          </p>
        )}
        
        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {cta.buttons.map((button) => {
            if (button.style === 'solid') {
              return (
                <a
                  key={button.id}
                  href={button.link}
                  target={button.link.startsWith('#') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="cta-button-solid inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-base"
                  style={{ 
                    backgroundColor: lightBrown,
                    color: darkBrown
                  }}
                >
                  <span>{button.text}</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              );
            } else {
              return (
                <a
                  key={button.id}
                  href={button.link}
                  target={button.link.startsWith('#') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="cta-button-outlined inline-flex items-center px-8 py-3 rounded-lg font-semibold text-base rounded-lg border-2"
                  style={{ 
                    borderColor: 'white',
                    color: 'white',
                    backgroundColor: 'transparent'
                  }}
                >
                  {button.text}
                </a>
              );
            }
          })}
        </div>
      </div>
    </section>
  );
};
