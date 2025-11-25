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
        <div className="row">
          {/* Contact Info Items */}
          <div className="col-md-4">
            <div className="contact-info">
              <div className="contact-info-item" style={{ backgroundColor: isDark ? theme.primary : '#071c34' }}>
                <div className="contact-info-icon">
                  <MapPin style={{ color: theme.secondary }} />
                </div>
                <div className="contact-info-text">
                  <h2>Address</h2>
                  <span>{content.contact.address || '123 Street, City, Country'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="contact-info">
              <div className="contact-info-item" style={{ backgroundColor: isDark ? theme.primary : '#071c34' }}>
                <div className="contact-info-icon">
                  <Mail style={{ color: theme.secondary }} />
                </div>
                <div className="contact-info-text">
                  <h2>E-mail</h2>
                  <span>{content.contact.email || 'info@example.com'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="contact-info">
              <div className="contact-info-item" style={{ backgroundColor: isDark ? theme.primary : '#071c34' }}>
                <div className="contact-info-icon">
                  <Clock style={{ color: theme.secondary }} />
                </div>
                <div className="contact-info-text">
                  <h2>Office Time</h2>
                  <span>Mon - Thu 9:00 am - 4.00 pm</span>
                  <span>Thu - Mon 10.00 pm - 5.00 pm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Contact Form */}
          <div className="col-md-8">
            <div className="contact-page-form">
              <h2 style={{ color: theme.primary }}>Get in Touch</h2>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <div className="single-input-field">
                      <input
                        type="text"
                        placeholder="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <div className="single-input-field">
                      <input
                        type="email"
                        placeholder="E-mail"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <div className="single-input-field">
                      <input
                        type="text"
                        placeholder="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <div className="single-input-field">
                      <input
                        type="text"
                        placeholder="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-12 message-input">
                    <div className="single-input-field">
                      <textarea
                        placeholder="Write Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className="single-input-fieldsbtn">
                    <input type="submit" value="Send Now" style={{ backgroundColor: theme.secondary }} />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Google Map */}
          <div className="col-md-4">
            <div className="contact-page-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109741.02912911311!2d76.69348873658222!3d30.73506264436677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0be66ec96b%3A0xa5ff67f9527319fe!2sChandigarh!5e0!3m2!1sen!2sin!4v1553497921355"
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
