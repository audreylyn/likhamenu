import React, { useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface WebsiteBuilderImageUploadProps {
  label: string;
  imageUrl: string | undefined;
  onFileUpload: (base64: string) => void;
  isUploading: boolean;
}

export const WebsiteBuilderImageUpload: React.FC<WebsiteBuilderImageUploadProps> = ({
  label,
  imageUrl,
  onFileUpload,
  isUploading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="text"
          value={imageUrl || ''}
          readOnly
          placeholder="No image uploaded"
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-500 bg-slate-50"
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Upload Image"
          disabled={isUploading}
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        </button>
      </div>
      {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 max-h-40 object-contain" />}
    </div>
  );
};
