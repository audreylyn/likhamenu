import React from 'react';
import { Check, Star } from 'lucide-react';
import { Website } from '../../types';

interface PreviewPricingSectionProps {
  website: Website;
  bgSecondary: string;
  isDark: boolean;
}


export const PreviewPricingSection: React.FC<PreviewPricingSectionProps> = ({
  website,
  bgSecondary,
  isDark,
}) => {
  const { content, theme } = website;

  if (content.pricing.length === 0) {
    return null;
  }

  // Use theme colors from presets
  const warmBrown = theme.colors?.brand500 || '#c58550';
  const darkBrown = theme.colors?.brand900 || '#67392b';
  const darkGray = isDark ? 'rgba(107, 114, 128, 0.8)' : 'rgb(75, 85, 99)';
  const lightBeige = theme.colors?.brand50 || '#fbf8f3';
  const cardBg = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)';
  
  // Use white background for Pricing section
  // Button colors: use theme colors for regular and popular buttons
  const regularButtonBg = theme.colors?.brand50 || '#fbf8f3';
  const regularButtonText = theme.colors?.brand900 || '#67392b';
  const regularButtonBorder = theme.colors?.brand200 || '#ebdcc4';
  const popularButtonBg = theme.colors?.brand600 || theme.primary || '#b96b40';
  const popularButtonHover = theme.colors?.brand700 || '#9a5336';

  // Parse price to extract number and period
  const parsePrice = (priceStr: string) => {
    const cleaned = priceStr.replace(/[₱$]/g, '').trim();
    const parts = cleaned.split('/');
    return {
      amount: parts[0].trim(),
      period: parts[1] ? `/${parts[1].trim()}` : '/month'
    };
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4" 
            style={{ 
              color: darkBrown,
              fontFamily: 'var(--heading-font)'
            }}
          >
            Our Pricing Plans
          </h2>
          <p 
            className={`text-lg max-w-2xl mx-auto`}
            style={{ 
              color: darkGray,
              fontFamily: 'var(--body-font)'
            }}
          >
            Choose the perfect plan that fits your needs and budget
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {content.pricing.map((plan) => {
            const { amount, period } = parsePrice(plan.price);
            const isPopular = plan.isPopular || false;

            return (
              <div
                key={plan.id}
                className="relative rounded-2xl p-8 shadow-lg transition-all hover:shadow-xl"
                style={{
                  backgroundColor: cardBg,
                  border: isPopular ? `2px solid ${warmBrown}` : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  transform: isPopular ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {/* Most Popular Badge */}
                {isPopular && (
                  <div
                    className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: warmBrown,
                      color: 'white'
                    }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>MOST POPULAR</span>
                  </div>
                )}

                {/* Plan Title */}
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ 
                    color: darkBrown,
                    fontFamily: 'var(--heading-font)'
                  }}
                >
                  {plan.name}
                </h3>

                {/* Tagline */}
                {plan.tagline && (
                  <p 
                    className="text-sm mb-6"
                    style={{ 
                      color: darkGray,
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    {plan.tagline}
                  </p>
                )}

                {/* Price */}
                <div className="mb-6">
                  <span 
                    className="text-4xl font-bold"
                    style={{ 
                      color: darkBrown,
                      fontFamily: 'var(--heading-font)'
                    }}
                  >
                    ₱{amount}
                  </span>
                  <span 
                    className="text-base ml-1"
                    style={{ 
                      color: darkGray,
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    {period}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check 
                        className="w-5 h-5 flex-shrink-0 mt-0.5" 
                        style={{ color: '#10b981' }} // Green checkmark
                      />
                      <span 
                        className="text-sm leading-relaxed"
                        style={{ 
                          color: darkGray,
                          fontFamily: 'var(--body-font)'
                        }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <a
                  href={plan.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 px-6 rounded-lg text-center font-semibold transition-all shadow-lg hover:shadow-xl"
                  style={{
                    backgroundColor: isPopular ? popularButtonBg : regularButtonBg,
                    color: isPopular ? 'white' : regularButtonText,
                    border: isPopular ? 'none' : `1px solid ${regularButtonBorder}`,
                    fontFamily: 'var(--body-font)'
                  }}
                  onMouseEnter={(e) => {
                    if (isPopular) {
                      e.currentTarget.style.backgroundColor = popularButtonHover;
                    } else {
                      e.currentTarget.style.backgroundColor = theme.colors?.brand100 || '#f5efe4';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isPopular) {
                      e.currentTarget.style.backgroundColor = popularButtonBg;
                    } else {
                      e.currentTarget.style.backgroundColor = regularButtonBg;
                    }
                  }}
                >
                  {plan.buttonText}
                </a>
              </div>
            );
          })}
        </div>

        {/* Bottom Text */}
        <div className="text-center">
          <p 
            className="text-sm"
            style={{ 
              color: darkGray,
              fontFamily: 'var(--body-font)'
            }}
          >
            Need a custom plan for a larger event?{' '}
            <a
              href="#contact"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: warmBrown }}
            >
              Contact us
            </a>
            {' '}for a quote.
          </p>
        </div>
      </div>
    </section>
  );
};
