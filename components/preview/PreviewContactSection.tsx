import React, { useState } from 'react';
import { Website } from '../../types';
import { MapPin, Mail, Phone, Clock, Calendar, Cake } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface PreviewContactSectionProps {
  website: Website;
  isDark: boolean;
}


export const PreviewContactSection: React.FC<PreviewContactSectionProps> = ({
  website,
  isDark,
}) => {
  const { content, theme } = website;
  const contact = content.contact;
  // Use theme colors from presets
  const warmBrown = theme.colors?.brand500 || '#c58550';
  const darkBrown = theme.colors?.brand900 || '#67392b';
  const darkGray = isDark ? 'rgba(107, 114, 128, 0.8)' : 'rgb(75, 85, 99)';
  const lightBeige = theme.colors?.brand50 || '#fbf8f3';
  const lightBrown = theme.colors?.brand200 || '#ebdcc4';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: contact.inquiryTypes?.[0] || 'General Question',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formConfig = website.contactFormConfig;
    const scriptUrl = import.meta.env.VITE_CONTACT_FORM_SCRIPT_URL || formConfig?.googleScriptUrl;
    
    // If Google Script is configured and enabled, use it
    if (formConfig?.enabled && scriptUrl && formConfig.clientId) {
      setStatus('submitting');
      
      try {
        // Send to Google Apps Script
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors', // Important: prevents CORS errors with Google Scripts
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId: formConfig.clientId,
            name: formData.name,
            email: formData.email,
            type: formData.inquiryType,
            message: formData.message,
          }),
        });

        // Since we use 'no-cors', we can't read the response
        // But if no error is thrown, assume success
        setStatus('success');
        setFormData({ 
          name: '', 
          email: '', 
          inquiryType: contact.inquiryTypes?.[0] || 'General Question', 
          message: '' 
        });
        
        // Clear success message after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } catch (error) {
        console.error('Error submitting form:', error);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } else {
      // Fallback: Just log to console (for development/testing)
      console.log('Form Data Submitted:', formData);
      alert('Message sent! (Check console for data)\n\nNote: Configure Google Apps Script in Contact Form Configuration to enable email delivery.');
      setFormData({ 
        name: '', 
        email: '', 
        inquiryType: contact.inquiryTypes?.[0] || 'General Question', 
        message: '' 
      });
    }
  };

  // Use white background for Contact section
  return (
    <>
      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
      <section id="contact" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4" 
            style={{ 
              color: darkBrown,
              fontFamily: 'var(--heading-font)'
            }}
          >
            Get in Touch
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ 
              color: darkGray,
              fontFamily: 'var(--body-font)'
            }}
          >
            Have a question or planning a special event? We'd love to hear from you.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Visit Our Bakery */}
          <div
            className="rounded-xl p-8"
            style={{
              backgroundColor: lightBeige,
            }}
          >
            <h3 
              className="text-2xl font-bold mb-6"
              style={{ 
                color: darkBrown,
                fontFamily: 'var(--heading-font)'
              }}
            >
              Visit Our Bakery
            </h3>

            <div className="space-y-6">
              {/* Location */}
              {contact.address && (
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: lightBrown }}
                  >
                    <MapPin className="w-6 h-6" style={{ color: darkBrown }} />
                  </div>
                  <div>
                    <p 
                      className="text-base leading-relaxed" 
                      style={{ 
                        color: darkGray,
                        fontFamily: 'var(--body-font)'
                      }}
                    >
                      {contact.address.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < contact.address.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              )}

              {/* Opening Hours */}
              {contact.hours && (
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: lightBrown }}
                  >
                    <Clock className="w-6 h-6" style={{ color: darkBrown }} />
                  </div>
                  <div>
                    {contact.hours.weekday && (
                      <p className="text-base mb-1" style={{ color: darkGray }}>
                        {contact.hours.weekday}
                      </p>
                    )}
                    {contact.hours.weekend && (
                      <p className="text-base mb-1" style={{ color: darkGray }}>
                        {contact.hours.weekend}
                      </p>
                    )}
                    {contact.hours.closed && (
                      <p className="text-base" style={{ color: warmBrown + 'CC' }}>
                        {contact.hours.closed}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: lightBrown }}
                >
                  <Phone className="w-6 h-6" style={{ color: darkBrown }} />
                </div>
                <div>
                  {contact.phone && (
                    <p className="text-base mb-1" style={{ color: darkGray }}>
                      {contact.phone}
                    </p>
                  )}
                  {contact.email && (
                    <p className="text-base" style={{ color: darkGray }}>
                      {contact.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Custom Orders & Catering */}
              {contact.catering && (
                <>
                  <div 
                    className="border-t pt-6 mt-6"
                    style={{ borderColor: lightBrown }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: lightBrown }}
                      >
                        <Calendar className="w-5 h-5" style={{ color: darkBrown }} />
                        <Cake className="w-4 h-4 absolute" style={{ color: darkBrown, marginTop: '8px', marginLeft: '8px' }} />
                      </div>
                      <div>
                        <p className="text-base leading-relaxed mb-3" style={{ color: darkGray }}>
                          {contact.catering.text}
                        </p>
                        {contact.catering.link && (
                          <a
                            href={contact.catering.link}
                            className="inline-flex items-center gap-1 font-semibold hover:opacity-80 transition-opacity"
                            style={{ color: warmBrown }}
                          >
                            {contact.catering.linkText || 'VIEW CATERING MENU'}
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Send a Message */}
          <div
            className="rounded-xl p-8 shadow-lg"
            style={{
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
            }}
          >
            <h3 
              className="text-2xl font-bold mb-6"
              style={{ 
                color: darkBrown,
                fontFamily: 'var(--heading-font)'
              }}
            >
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: darkGray }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: lightBrown,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                    color: isDark ? 'white' : darkGray,
                    focusRingColor: warmBrown
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: darkGray }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: lightBrown,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                    color: isDark ? 'white' : darkGray,
                    focusRingColor: warmBrown
                  }}
                />
              </div>

              {/* Inquiry Type */}
              {contact.inquiryTypes && contact.inquiryTypes.length > 0 && (
                <div>
                  <label 
                    htmlFor="inquiryType" 
                    className="block text-sm font-medium mb-2"
                    style={{ color: darkGray }}
                  >
                    Inquiry Type
                  </label>
                  <div className="relative">
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg appearance-none focus:outline-none focus:ring-2 pr-10"
                      style={{
                        borderColor: lightBrown,
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                        color: isDark ? 'white' : darkGray,
                        focusRingColor: warmBrown
                      }}
                    >
                      {contact.inquiryTypes.map((type) => (
                        <option key={type} value={type} style={{ backgroundColor: isDark ? '#1e293b' : 'white', color: darkGray }}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <div 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                      style={{ color: darkGray }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label 
                  htmlFor="message" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: darkGray }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us more about your event or question..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border rounded-lg resize-y focus:outline-none focus:ring-2"
                  style={{
                    borderColor: lightBrown,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                    color: isDark ? 'white' : darkGray,
                    focusRingColor: warmBrown
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary w-full py-3 px-6 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--body-font)' }}
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            {/* Alert Toast - Fixed Position at Top */}
            {status === 'success' && (
              <div 
                className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down"
                style={{ 
                  maxWidth: '90%',
                  width: '500px',
                  fontFamily: 'var(--body-font)'
                }}
              >
                <div className="bg-green-50 border-2 border-green-400 rounded-lg shadow-xl p-4 flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900">Message sent successfully!</p>
                    <p className="text-xs text-green-700 mt-0.5">We'll get back to you soon.</p>
                  </div>
                  <button
                    onClick={() => setStatus('idle')}
                    className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            {status === 'error' && (
              <div 
                className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down"
                style={{ 
                  maxWidth: '90%',
                  width: '500px',
                  fontFamily: 'var(--body-font)'
                }}
              >
                <div className="bg-red-50 border-2 border-red-400 rounded-lg shadow-xl p-4 flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-900">Something went wrong</p>
                    <p className="text-xs text-red-700 mt-0.5">Please try again or contact us directly.</p>
                  </div>
                  <button
                    onClick={() => setStatus('idle')}
                    className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </>
  );
};
