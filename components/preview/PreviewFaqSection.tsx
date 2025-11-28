import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
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
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  if (content.faq.length === 0) {
    return null; // Don't render section if no FAQ items
  }

  return (
    <section id="faq" className={`py-20 relative ${isDark ? 'bg-slate-900' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      <style>{`
        .faq-item {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .faq-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: ${theme.primary};
          transform: scaleY(0);
          transition: transform 0.3s ease;
          transform-origin: bottom;
        }
        .faq-item[aria-expanded="true"]::before {
          transform: scaleY(1);
        }
        .faq-item:hover {
          transform: translateX(8px);
        }
        .faq-button {
          transition: all 0.3s ease;
          position: relative;
        }
        .faq-button:hover {
          background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
        }
        .faq-icon-wrapper {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }
        .faq-item[aria-expanded="true"] .faq-icon-wrapper {
          transform: rotate(180deg);
          background: ${theme.primary};
        }
        .faq-item[aria-expanded="true"] .faq-icon-wrapper svg {
          color: white;
        }
        .faq-content {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-number {
          transition: all 0.3s ease;
        }
        .faq-item[aria-expanded="true"] .faq-number {
          background: ${theme.primary};
          color: white;
        }
      `}</style>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-10 right-20 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: theme.primary }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ 
            backgroundColor: theme.primary + '15',
            border: `1px solid ${theme.primary}30`
          }}>
            <HelpCircle className="w-4 h-4" style={{ color: theme.primary }} />
            <span className="text-sm font-semibold" style={{ color: theme.primary }}>FAQ</span>
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: theme.primary }}>
            Frequently Asked Questions
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
            Everything you need to know about our services
          </p>
        </div>
        
        <div className="space-y-4">
          {content.faq.map((f, index) => {
            const isExpanded = expandedItem === f.id;
            return (
              <div
                key={f.id}
                className={`faq-item rounded-2xl overflow-hidden ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white border-slate-200/50'} border shadow-lg backdrop-blur-sm`}
                aria-expanded={isExpanded}
              >
                <button
                  className="faq-button w-full px-6 py-6 flex items-center justify-between gap-4 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-2xl"
                  style={{ 
                    focusRingColor: theme.primary,
                  }}
                  onClick={() => toggleAccordion(f.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Question number */}
                    <div 
                      className="faq-number w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border-2"
                      style={{
                        borderColor: isExpanded ? theme.primary : (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'),
                        backgroundColor: isExpanded ? theme.primary : 'transparent',
                        color: isExpanded ? 'white' : (isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)'),
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    
                    <span className={`flex-1 font-semibold text-lg md:text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {f.question}
                    </span>
                  </div>
                  
                  <div
                    className="faq-icon-wrapper w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all"
                    style={{
                      borderColor: isExpanded ? theme.primary : (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'),
                      backgroundColor: isExpanded ? theme.primary : 'transparent',
                    }}
                  >
                    <ChevronDown 
                      className="w-5 h-5 transition-colors" 
                      style={{ color: isExpanded ? 'white' : theme.primary }} 
                    />
                  </div>
                </button>
                
                <div
                  className="faq-content overflow-hidden"
                  style={{
                    maxHeight: isExpanded ? '500px' : '0',
                    opacity: isExpanded ? 1 : 0,
                    paddingLeft: isExpanded ? '0' : '0',
                    paddingRight: isExpanded ? '0' : '0',
                  }}
                >
                  <div className="px-6 pb-6 pl-20">
                    <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {f.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
