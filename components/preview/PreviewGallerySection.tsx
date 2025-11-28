import React, { useState } from 'react';
import { Website } from '../../types';
import { X, Image as ImageIcon, ZoomIn } from 'lucide-react';

interface PreviewGallerySectionProps {
  website: Website;
  isDark: boolean;
}

export const PreviewGallerySection: React.FC<PreviewGallerySectionProps> = ({
  website,
  isDark,
}) => {
  const { content, theme } = website;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCaption, setSelectedCaption] = useState<string | null>(null);

  const openImage = (imageSrc: string, caption?: string) => {
    setSelectedImage(imageSrc);
    setSelectedCaption(caption || null);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setSelectedCaption(null);
  };

  return (
    <section id="gallery" className="py-20 relative" style={{
      backgroundColor: isDark ? 'rgb(15 23 42)' : '#faf9f6',
    }}>
      <style>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        @media (min-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 32px;
          }
        }
        @media (min-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          aspect-ratio: 4/3;
        }
        .gallery-item:hover {
          transform: translateY(-8px);
        }
        .gallery-item-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .gallery-item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gallery-item:hover .gallery-item-image {
          transform: scale(1.1);
        }
        .gallery-item-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gallery-item:hover .gallery-item-overlay {
          opacity: 1;
        }
        .gallery-item-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gallery-item:hover .gallery-item-content {
          transform: translateY(0);
        }
        .gallery-item-title {
          color: white;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        .zoom-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s ease;
        }
        .gallery-item:hover .zoom-icon {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }
        .gallery-modal {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .gallery-modal-content {
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-5"
          style={{ backgroundColor: theme.primary }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-5"
          style={{ backgroundColor: theme.secondary }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ 
            backgroundColor: theme.primary + '15',
            border: `1px solid ${theme.primary}30`
          }}>
            <ImageIcon className="w-4 h-4" style={{ color: theme.primary }} />
            <span className="text-sm font-semibold" style={{ color: theme.primary }}>Gallery</span>
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: theme.primary }}>
            Our Gallery
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
            Explore our collection of work and achievements
          </p>
        </div>

        {/* Gallery Grid */}
        {content.gallery.length > 0 ? (
          <div className="gallery-grid">
            {content.gallery.map((item) => (
              <div
                key={item.id}
                className="gallery-item"
                onClick={() => openImage(item.image, item.caption)}
              >
                <div className="gallery-item-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.caption || "Gallery Item"}
                    className="gallery-item-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                  <div className="gallery-item-overlay">
                    <div className="zoom-icon">
                      <ZoomIn className="w-6 h-6" />
                    </div>
                  </div>
                  {item.caption && (
                    <div className="gallery-item-content">
                      <h3 className="gallery-item-title">{item.caption}</h3>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              No gallery items to display
            </p>
          </div>
        )}
      </div>

      {/* Full-size Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] p-4 gallery-modal"
          onClick={closeImage}
        >
          <div className="relative max-w-7xl w-full max-h-[90vh] gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-white p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 z-20 transition-all"
              onClick={closeImage}
              style={{
                backdropFilter: 'blur(10px)',
              }}
            >
              <X size={24} />
            </button>
            <div className="relative">
              <img
                src={selectedImage}
                alt={selectedCaption || "Gallery Item"}
                className="max-w-full max-h-[90vh] object-contain rounded-lg mx-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                }}
              />
              {selectedCaption && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                  <h3 className="text-white text-xl font-semibold">{selectedCaption}</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
