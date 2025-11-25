import React, { useState } from 'react';
import { Website } from '../../types';
import { MapPin, Mail, Clock } from 'lucide-react'; // Using Lucide React icons
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
    <section className="contact-page-sec" style={{ 
        backgroundColor: isDark ? theme.primary : '#fff' 
      }}>
      <div
        className="container"
        style={{
          '--primary-color': theme.primary,
          '--secondary-color': theme.secondary,
          '--muted-text-color': isDark ? '#d1d5db' : '#999999',
          '--light-bg-color': isDark ? '#1f2937' : '#f9f9f9',
        } as React.CSSProperties}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Contact Info Items */}
          <div className="col-span-1">
            <div className="contact-info">
              <div className="contact-info-item flex items-center p-4 rounded-lg shadow-md"
                   style={{ backgroundColor: '#071c34' }}> {/* Static dark blue background */}
                <div className="contact-info-icon mr-4">
                  <MapPin style={{ color: theme.secondary }} /> {/* Dynamic icon color */}
                </div>
                <div className="contact-info-text text-left">
                  <h2 className="text-white text-lg font-semibold mb-1">Phone</h2>
                  <span className="text-sm" style={{ color: '#999999' }}>{content.contact.phone || '09201063227'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="contact-info">
              <div className="contact-info-item flex items-center p-4 rounded-lg shadow-md"
                   style={{ backgroundColor: '#071c34' }}> {/* Static dark blue background */}
                <div className="contact-info-icon mr-4">
                  <Mail style={{ color: theme.secondary }} /> {/* Dynamic icon color */}
                </div>
                <div className="contact-info-text text-left">
                  <h2 className="text-white text-lg font-semibold mb-1">E-mail</h2>
                  <span className="text-sm" style={{ color: '#999999' }}>{content.contact.email || 'audreylynmorana1504@gmail.com'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* REMOVED: Office Time Block */}
          {/* <div className="col-span-1">
            <div className="contact-info">
              <div className="contact-info-item flex items-center p-4 rounded-lg shadow-md"
                   style={{ backgroundColor: '#071c34' }}>
                <div className="contact-info-icon mr-4">
                  <Clock style={{ color: theme.secondary }} />
                </div>
                <div className="contact-info-text text-left">
                  <h2 className="text-white text-lg font-semibold mb-1">Office Time</h2>
                  <span className="text-sm" style={{ color: '#999999' }}>Mon - Thu 9:00 am - 4.00 pm</span>
                  <span className="text-sm" style={{ color: '#999999' }}>Thu - Mon 10.00 pm - 5.00 pm</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Contact Form */}
          <div className="col-span-12 md:col-span-8">
            <div className="contact-page-form p-6 rounded-lg shadow-md bg-white"> {/* Static white background */}
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#000' }}>Get in Touch</h2> {/* Static dark color */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="single-input-field">
                    <input
                      type="text"
                      placeholder="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2`}
                      style={{ borderColor: '#e5e7eb', backgroundColor: '#f9f9f9', color: '#000' }}
                    />
                  </div>
                  <div className="single-input-field">
                    <input
                      type="email"
                      placeholder="E-mail"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2`}
                      style={{ borderColor: '#e5e7eb', backgroundColor: '#f9f9f9', color: '#000' }}
                    />
                  </div>
                  <div className="single-input-field">
                    <input
                      type="text"
                      placeholder="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2`}
                      style={{ borderColor: '#e5e7eb', backgroundColor: '#f9f9f9', color: '#000' }}
                    />
                  </div>
                  <div className="single-input-field">
                    <input
                      type="text"
                      placeholder="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2`}
                      style={{ borderColor: '#e5e7eb', backgroundColor: '#f9f9f9', color: '#000' }}
                    />
                  </div>
                </div>
                <div className="single-input-field message-input mb-4">
                  <textarea
                    placeholder="Write Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2`}
                    style={{ borderColor: '#e5e7eb', backgroundColor: '#f9f9f9', color: '#000' }}
                  ></textarea>
                </div>
                <div className="single-input-fieldsbtn text-right">
                  <input
                    type="submit"
                    value="Send Now"
                    className="px-8 py-3 rounded-lg text-white font-semibold transition-colors hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: theme.secondary }}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Google Map */}
          <div className="col-span-12 md:col-span-4">
            <div className="contact-page-map rounded-lg overflow-hidden shadow-md">
              <iframe
                src={content.contact.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.8157790899295!2d120.9704706749103!3d14.549232976722247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9459392e297%3A0xc3e0023023e9a597!2s1%20Kabesang%20Purong%20St%2C%20Valenzuela%2C%201444%20Metro%20Manila%2C%20Philippines!5e0!3m2!1sen!2sph!4v1701334418386!5m2!1sen!2sph"}
                width="100%"
                height="450"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex={0}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
