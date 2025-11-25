import React, { useState } from 'react';
import { Website } from '../../types';
import './PreviewFaqSection.css';

interface PreviewFaqSectionProps {
  website: Website;
  isDark: boolean; // Re-introducing isDark prop
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
    <section id="faq" className={`py-20 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="faq-container" style={{ '--theme-primary-color': theme.primary } as React.CSSProperties}>
        <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '1.5em', color: theme.primary, textAlign: 'center' }}>Frequently Asked Questions</h2>
        <div className="faq-accordion">
          {content.faq.map((f) => (
            <div key={f.id} className="accordion-item">
              <button
                id={`accordion-button-${f.id}`}
                aria-expanded={expandedItem === f.id ? 'true' : 'false'}
                onClick={() => toggleAccordion(f.id)}
                style={expandedItem === f.id ? { borderBottom: `1px solid ${theme.primary}` } : {}}
              >
                <span className="accordion-title" style={{ color: isDark ? '#ffffff' : '#4d5974' }}>{f.question}</span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p style={{ color: isDark ? '#d1d5db' : '#4d5974' }}>{f.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
