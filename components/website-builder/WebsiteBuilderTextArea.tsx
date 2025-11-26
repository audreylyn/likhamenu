import React from 'react';

interface WebsiteBuilderTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const WebsiteBuilderTextArea: React.FC<WebsiteBuilderTextAreaProps> = ({
  label,
  ...props
}) => {
  return (
    <div>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        {...props}
        className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-24 resize-none"
      />
    </div>
  );
};
