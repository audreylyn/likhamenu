import React, { useState } from 'react';
import { Website } from '../../types';
import { MapPin, Mail, Phone, Clock, Calendar, Cake } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface PreviewContactSectionProps {
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
  const brown = {
    r: Math.max(100, Math.min(180, rgb.r + 20)),
    g: Math.max(70, Math.min(150, rgb.g - 10)),
    b: Math.max(40, Math.min(100, rgb.b - 30))
  };
  return `rgb(${brown.r}, ${brown.g}, ${brown.b})`;
};

export const PreviewContactSection: React.FC<PreviewContactSectionProps> = ({
  website,
  isDark,
}) => {
  const { content, theme } = website;
  const contact = content.contact;
  const warmBrown = getWarmBrown(theme);
  const darkBrown = isDark ? 'rgba(139, 90, 43, 0.9)' : 'rgb(101, 67, 33)';
  const darkGray = isDark ? 'rgba(107, 114, 128, 0.8)' : 'rgb(75, 85, 99)';
  const lightBeige = isDark ? 'rgba(245, 245, 240, 0.15)' : 'rgba(245, 245, 240, 0.8)';
  const lightBrown = isDark ? 'rgba(200, 170, 140, 0.3)' : 'rgba(200, 170, 140, 0.5)';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: contact.inquiryTypes?.[0] || 'General Question',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    alert('Message sent! (Check console for data)');
    setFormData({ name: '', email: '', inquiryType: contact.inquiryTypes?.[0] || 'General Question', message: '' });
  };

  return (
    <section id="contact" className={`py-20 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4" 
            style={{ 
              color: darkBrown,
              fontFamily: 'serif'
            }}
          >
            Get in Touch
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: warmBrown }}
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
              style={{ color: darkBrown }}
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
                    <p className="text-base leading-relaxed" style={{ color: darkGray }}>
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
              style={{ color: darkBrown }}
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
                className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: darkBrown }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
