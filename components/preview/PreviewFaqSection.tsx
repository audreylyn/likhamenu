import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Website } from '../../types';

interface PreviewFaqSectionProps {
  website: Website;
  isDark: boolean;
}


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

  // Use theme colors from presets
  const darkBrown = theme.colors?.brand900 || '#67392b';
  const darkGray = isDark ? 'rgba(107, 114, 128, 0.8)' : 'rgb(75, 85, 99)';
  const lightBeige = theme.colors?.brand50 || '#fbf8f3';
  const lightBeigeBorder = theme.colors?.brand200 || '#ebdcc4';
  const darkerBeigeBorder = theme.colors?.brand500 || '#c58550';
  const iconColor = theme.colors?.brand900 || '#67392b';

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
              fontFamily: 'var(--heading-font)'
            }}
          >
            Frequently Asked Questions
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ 
              color: darkGray,
              fontFamily: 'var(--body-font)'
            }}
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
                      fontFamily: 'var(--heading-font)'
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
                        style={{ color: iconColor }} 
                      />
                    ) : (
                      <Plus 
                        className="w-5 h-5" 
                        style={{ color: iconColor }} 
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
                        color: darkGray,
                        fontFamily: 'var(--body-font)'
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
