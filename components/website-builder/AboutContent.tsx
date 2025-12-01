import React from 'react';
import { Website } from '../../types';
import { Plus, Trash, Upload, Loader2 } from 'lucide-react';

interface AboutContentProps {
  website: Website;
  updateContent: (section: 'about', data: Website['content']['about']) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => void;
  isUploadingImage: boolean;
}

export const AboutContent: React.FC<AboutContentProps> = ({
  website,
  updateContent,
  handleFileUpload,
  isUploadingImage,
}) => {
  const about = website.content.about || {
    image: '',
    subtitle: '',
    title: '',
    paragraphs: [''],
  };

  const handleAboutChange = <K extends keyof typeof about>(key: K, value: typeof about[K]) => {
    updateContent('about', { ...about, [key]: value });
  };

  const handleParagraphChange = (index: number, value: string) => {
    const newParagraphs = [...about.paragraphs];
    newParagraphs[index] = value;
    handleAboutChange('paragraphs', newParagraphs);
  };

  const addParagraph = () => {
    handleAboutChange('paragraphs', [...about.paragraphs, '']);
  };

  const removeParagraph = (index: number) => {
    if (about.paragraphs.length > 1) {
      const newParagraphs = about.paragraphs.filter((_, i) => i !== index);
      handleAboutChange('paragraphs', newParagraphs);
    }
  };

  return (
    <section>
      <h3 className="text-lg font-bold text-slate-900 mb-4">About Section</h3>
      <div className="space-y-4">
        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Image</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={about.image}
              onChange={(e) => handleAboutChange('image', e.target.value)}
              className="flex-1 text-xs text-slate-400 bg-white border border-slate-200 rounded px-2 py-1"
              placeholder="Image URL"
            />
            <label className="cursor-pointer px-2 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              {isUploadingImage ? <Loader2 className="w-3 h-3 text-slate-500 animate-spin" /> : <Upload className="w-3 h-3 text-slate-500" />}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, (base64) => handleAboutChange('image', base64))}
                disabled={isUploadingImage}
              />
            </label>
          </div>
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Subtitle</label>
          <input
            type="text"
            value={about.subtitle}
            onChange={(e) => handleAboutChange('subtitle', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            placeholder="e.g., OUR PHILOSOPHY"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
          <input
            type="text"
            value={about.title}
            onChange={(e) => handleAboutChange('title', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            placeholder="e.g., Baking with Heart & Soul"
          />
        </div>

        {/* Paragraphs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">Paragraphs</label>
            <button
              onClick={addParagraph}
              className="text-xs flex items-center gap-1 text-amber-600 hover:underline"
            >
              <Plus className="w-3 h-3" /> Add Paragraph
            </button>
          </div>
          <div className="space-y-2">
            {about.paragraphs.map((paragraph, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  value={paragraph}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none"
                  placeholder={`Paragraph ${index + 1}...`}
                />
                {about.paragraphs.length > 1 && (
                  <button
                    onClick={() => removeParagraph(index)}
                    className="text-slate-400 hover:text-red-500 p-2"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
