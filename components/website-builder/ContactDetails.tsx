import React from 'react';
import { WebsiteContent, ThemeConfig } from '../../types';
import { useWebsite } from '../../hooks/useWebsite';
import { WebsiteBuilderInput } from './WebsiteBuilderInput';
import { WebsiteBuilderTextArea } from './WebsiteBuilderTextArea';

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...props }) => (
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" {...props}>
    {children}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => (
  <input
    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
    {...props}
  />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className,
  ...props
}) => (
  <textarea
    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
    {...props}
  />
);

interface ContactDetailsProps {
  content: WebsiteContent['contact'];
  onContentChange: (newContent: WebsiteContent['contact']) => void;
  isDark: boolean;
  theme: ThemeConfig;
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({
  content,
  onContentChange,
  isDark,
  theme,
}) => {
  return (
    <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <WebsiteBuilderInput
            label="Phone"
            id="contact-phone"
            value={content.phone}
            onChange={(e) => onContentChange({ ...content, phone: e.target.value })}
          />
          <WebsiteBuilderInput
            label="Email"
            id="contact-email"
            value={content.email}
            onChange={(e) => onContentChange({ ...content, email: e.target.value })}
          />
          <WebsiteBuilderTextArea
            label="Address"
            id="contact-address"
            value={content.address}
            onChange={(e) => onContentChange({ ...content, address: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </section>
  );
};
