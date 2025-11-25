import React from 'react';
import { Website, PricingPlan } from '../../types';
import './PreviewPricingSection.css';

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
    return null; // Don't render section if no pricing plans
  }

  return (
    <section id="pricing">
      <center><h1 style={{ fontSize: '2.5em', fontFamily: 'Open Sans, sans-serif', color: 'white' }}>Maintenance Websites Price List</h1></center>
      <div className="pricing pricing-palden">
        {content.pricing.map((plan, index) => (
          <div key={plan.id} className={`pricing-item features-item ${index === 1 ? 'pricing__item--featured' : ''}`} style={{ minHeight: '497px' }}>
            <div className="pricing-deco" style={{ 
              background: 
                index === 0
                  ? `linear-gradient(135deg,#4097f9,#0af0c7)` // Basic plan gradient
                  : index === 1
                  ? `linear-gradient(135deg,${theme.secondary},${theme.primary})` // Premium plan gradient
                  : `linear-gradient(135deg,#4097f9,#0af0c7)` // Standard plan gradient
            }}>
              <svg className="pricing-deco-img" enableBackground="new 0 0 300 100" height="100px" id="Layer_1" preserveAspectRatio="none" version="1.1" viewBox="0 0 300 100" width="300px" x="0px" y="0px">
                <path className="deco-layer deco-layer--1" d="M30.913,43.944c0,0,42.911-34.464,87.51-14.191c77.31,35.14,113.304-1.952,146.638-4.729c48.654-4.056,69.94,16.218,69.94,16.218v54.396H30.913V43.944z" fill="#FFFFFF" opacity="0.6"></path>
                <path className="deco-layer deco-layer--2" d="M-35.667,44.628c0,0,42.91-34.463,87.51-14.191c77.31,35.141,113.304-1.952,146.639-4.729c48.653-4.055,69.939,16.218,69.939,16.218v54.396H-35.667V44.628z" fill="#FFFFFF" opacity="0.6"></path>
                <path className="deco-layer deco-layer--3" d="M43.415,98.342c0,0,48.283-68.927,109.133-68.927c65.886,0,97.983,67.914,97.983,67.914v3.716H42.401L43.415,98.342z" fill="#FFFFFF" opacity="0.7"></path>
                <path className="deco-layer deco-layer--4" d="M-34.667,62.998c0,0,56-45.667,120.316-27.839C167.484,57.842,197,41.332,232.286,30.428c53.07-16.399,104.047,36.903,104.047,36.903l1.333,36.667l-372-2.954L-34.667,62.998z" fill="#FFFFFF"></path>
              </svg>
              <div className="pricing-price"><span className="pricing-currency">$TWD</span>{plan.price.replace('₱', '').split('/')[0].trim()}
                <span className="pricing-period">{index === 0 ? '/ day' : index === 1 ? '/ month' : '/ week'}</span>
              </div>
              <h3 className="pricing-title">{plan.name}</h3>
            </div>
            <ul className="pricing-feature-list">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="pricing-feature">{feature}</li>
              ))}
            </ul>
            <a
              href={plan.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="pricing-action"
              style={{
                backgroundColor: theme.button,
                background: 
                  index === 0
                    ? `linear-gradient(135deg, #a93bfe, #584efd)` // Basic plan button
                    : index === 1
                    ? `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})` // Premium plan button
                    : `linear-gradient(135deg, #4097f9, #0af0c7)` // Standard plan button
              }}
            >
              {plan.buttonText}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};
