import React from 'react';
import { Quote, Star } from 'lucide-react';
import { Website } from '../../types';

interface PreviewTestimonialsSectionProps {
  website: Website;
  isDark: boolean;
  textMuted: string;
  handleAvatarError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const PreviewTestimonialsSection: React.FC<PreviewTestimonialsSectionProps> = ({
  website,
  isDark,
  textMuted,
  handleAvatarError,
}) => {
  const { content, theme } = website;

  return (
    <section id="testimonials" className={`py-20 relative ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      <style>{`
        :root {
          --tw-ring-color: transparent !important;
        }
        * {
          --tw-ring-color: transparent !important;
        }
        .testimonial-grid-item {
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .testimonial-grid-item:hover {
          transform: translateY(-8px) scale(1.02);
        }
        .testimonial-card-inner {
          position: relative;
          height: 100%;
          transition: all 0.3s ease;
        }
        .testimonial-grid-item:hover .testimonial-card-inner {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        .quote-decoration {
          position: absolute;
          top: 20px;
          left: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .testimonial-grid-item:hover .quote-decoration {
          transform: scale(1.1) rotate(5deg);
        }
        .testimonial-avatar-wrapper {
          position: relative;
          transition: all 0.3s ease;
        }
        .testimonial-grid-item:hover .testimonial-avatar-wrapper {
          transform: scale(1.1);
        }
        .testimonial-avatar-wrapper::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${theme.primary}, ${theme.button});
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .testimonial-grid-item:hover .testimonial-avatar-wrapper::before {
          opacity: 0.3;
        }
        @media (max-width: 768px) {
          .testimonial-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: theme.primary }}
        />
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: theme.secondary }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ 
            backgroundColor: theme.primary + '15',
            border: `1px solid ${theme.primary}30`
          }}>
            <Star className="w-4 h-4" style={{ color: theme.primary }} />
            <span className="text-sm font-semibold" style={{ color: theme.primary }}>Testimonials</span>
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: theme.primary }}>
            What People Say
          </h2>
          <p className={`text-lg ${textMuted} max-w-2xl mx-auto`}>
            Real feedback from real customers who love our service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 testimonial-grid">
          {content.testimonials.map((t, index) => (
            <div key={t.id} className="testimonial-grid-item">
              <div 
                className={`testimonial-card-inner p-8 rounded-3xl ${isDark ? 'bg-slate-800/90' : 'bg-white'} border ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'} shadow-lg backdrop-blur-sm`}
                style={{
                  borderTop: `4px solid ${theme.primary}`,
                }}
              >
                {/* Quote decoration */}
                <div className="quote-decoration">
                  <Quote className="w-8 h-8" style={{ color: theme.primary, opacity: 0.2 }} />
                </div>

                {/* Testimonial content */}
                <div className="pt-4">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 fill-current" 
                        style={{ color: theme.primary }}
                      />
                    ))}
                  </div>

                  <p className={`text-base md:text-lg mb-8 leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    "{t.content}"
                  </p>

                  {/* Author info */}
                  <div className="flex items-center gap-4 pt-6 border-t" style={{ 
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                  }}>
                    <div className="testimonial-avatar-wrapper relative">
                      {t.avatar ? (
                        <img
                          src={t.avatar}
                          alt={t.name}
                          onError={handleAvatarError}
                          className="w-14 h-14 rounded-full object-cover border-2 relative z-10"
                          style={{ borderColor: theme.primary }}
                        />
                      ) : (
                        <div 
                          className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl text-white relative z-10"
                          style={{ 
                            backgroundColor: theme.primary,
                            boxShadow: `0 4px 15px ${theme.primary}40`
                          }}
                        >
                          {t.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {t.name}
                      </p>
                      <p className={`text-sm ${textMuted}`}>
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
