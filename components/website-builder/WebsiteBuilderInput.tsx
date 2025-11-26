import React from 'react';

interface WebsiteBuilderInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const WebsiteBuilderInput: React.FC<WebsiteBuilderInputProps> = ({
  label,
  ...props
}) => {
  return (
    <div>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        {...props}
        className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
};
