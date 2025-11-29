import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Website } from '../../types';

interface PreviewFaqSectionProps {
  website: Website;
  isDark: boolean;
}

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 139, g: 90, b: 43 }; // Default warm brown
};

// Helper function to get warm brown color from theme
const getWarmBrown = (theme: { primary: string }): string => {
  const rgb = hexToRgb(theme.primary);
  // Create a warm brown tone from the primary color
  const brown = {
    r: Math.max(100, Math.min(180, rgb.r + 20)),
    g: Math.max(70, Math.min(150, rgb.g - 10)),
    b: Math.max(40, Math.min(100, rgb.b - 30))
  };
  return `rgb(${brown.r}, ${brown.g}, ${brown.b})`;
};

export const PreviewFaqSection: React.FC<PreviewFaqSectionProps> = ({
  website,
  isDark,
}) => {
  const { content, theme } = website;
  const [expandedItem, setExpandedItem] = useState<string | null>(content.faq.length > 0 ? content.faq[0].id : null);

  const toggleAccordion = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  if (content.faq.length === 0) {
    return null;
  }

  const warmBrown = getWarmBrown(theme);
  const darkBrown = isDark ? 'rgba(139, 90, 43, 0.9)' : 'rgb(101, 67, 33)';
  const darkGray = isDark ? 'rgba(107, 114, 128, 0.8)' : 'rgb(75, 85, 99)';
  const lightBeige = isDark ? 'rgba(245, 245, 240, 0.15)' : 'rgba(245, 245, 240, 0.8)';
  const lightBeigeBorder = isDark ? 'rgba(200, 180, 150, 0.3)' : 'rgba(200, 180, 150, 0.5)';
  const darkerBeigeBorder = isDark ? 'rgba(180, 150, 120, 0.5)' : 'rgba(180, 150, 120, 0.7)';

  // Use white background for FAQ section
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4" 
            style={{ 
              color: darkBrown,
              fontFamily: 'serif'
            }}
          >
            Frequently Asked Questions
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: darkGray }}
          >
            Everything you need to know about our bakery.
          </p>
        </div>
        
        {/* FAQ Items */}
        <div className="space-y-4">
          {content.faq.map((f) => {
            const isExpanded = expandedItem === f.id;
            return (
              <div
                key={f.id}
                className="rounded-xl overflow-hidden transition-all"
                style={{
                  backgroundColor: lightBeige,
                  border: `1px solid ${isExpanded ? darkerBeigeBorder : lightBeigeBorder}`,
                }}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left focus:outline-none transition-colors hover:opacity-90"
                  onClick={() => toggleAccordion(f.id)}
                  aria-expanded={isExpanded}
                >
                  {/* Question */}
                  <span 
                    className="flex-1 font-semibold text-lg md:text-xl"
                    style={{ 
                      color: darkBrown,
                      fontFamily: 'serif'
                    }}
                  >
                    {f.question}
                  </span>
                  
                  {/* Plus/Minus Icon */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      backgroundColor: lightBeige,
                    }}
                  >
                    {isExpanded ? (
                      <Minus 
                        className="w-5 h-5" 
                        style={{ color: darkBrown }} 
                      />
                    ) : (
                      <Plus 
                        className="w-5 h-5" 
                        style={{ color: darkBrown }} 
                      />
                    )}
                  </div>
                </button>
                
                {/* Answer */}
                {isExpanded && (
                  <div 
                    className="px-6 pb-5 transition-all"
                    style={{
                      animation: 'fadeIn 0.3s ease-in'
                    }}
                  >
                    <p 
                      className="text-base leading-relaxed"
                      style={{ 
                        color: darkGray
                      }}
                    >
                      {f.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};
