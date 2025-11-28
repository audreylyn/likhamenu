import React, { useState } from 'react';
import { Website } from '../../types';
import { MapPin, Mail, Phone } from 'lucide-react'; // Using Lucide React icons
import './PreviewContactSection.css';

interface PreviewContactSectionProps {
  website: Website;
  isDark: boolean;
}

export const PreviewContactSection: React.FC<PreviewContactSectionProps> = ({
  website,
  isDark,
}) => {
  const { content, theme } = website;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Here you would typically send the data to a backend
    alert('Message sent! (Check console for data)');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="py-16 px-4 bg-gray-50 dark:bg-gray-900" style={{
      backgroundColor: isDark ? theme.primary : '#f9fafb',
      color: isDark ? 'white' : '#1f2937'
    }}>
      <div className="max-w-6xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ 
            backgroundColor: theme.primary + '15',
            border: `1px solid ${theme.primary}30`
          }}>
            <Phone className="w-4 h-4" style={{ color: theme.primary }} />
            <span className="text-sm font-semibold" style={{ color: theme.primary }}>Contact</span>
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: theme.primary }}>
            Get in Touch
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
            We'd love to hear from you. Send us a message or find us using the details below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Contact Info - Phone */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-start space-x-4">
            <Phone className="mt-1" size={24} style={{ color: theme.secondary }} />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Call Us</h3>
              <p className="text-gray-700 dark:text-gray-300">{content.contact.phone || 'N/A'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reach out to us during business hours.</p>
            </div>
          </div>

          {/* Contact Info - Email */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-start space-x-4">
            <Mail className="mt-1" size={24} style={{ color: theme.secondary }} />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Email Us</h3>
              <p className="text-gray-700 dark:text-gray-300 break-words">{content.contact.email || 'N/A'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">We respond to all inquiries within 24 hours.</p>
            </div>
          </div>

          {/* Contact Info - Address */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-start space-x-4">
            <MapPin className="mt-1" size={24} style={{ color: theme.secondary }} />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Our Location</h3>
              <p className="text-gray-700 dark:text-gray-300">{content.contact.address || 'N/A'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Visit us at our office during opening hours.</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Send us a Message
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="sr-only">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="subject" className="sr-only">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="message" className="sr-only">Write Your Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Write Your Message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
            <div className="md:col-span-2 text-center">
              <button
                type="submit"
                className="px-8 py-3 rounded-md text-white font-semibold transition-colors hover:opacity-90"
                style={{ backgroundColor: theme.secondary }}
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
