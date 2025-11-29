import React, { useState } from 'react';
import { Website } from '../../types';
import { X, Instagram } from 'lucide-react';

interface PreviewGallerySectionProps {
  website: Website;
  isDark: boolean;
}

export const PreviewGallerySection: React.FC<PreviewGallerySectionProps> = ({
  website,
  isDark,
}) => {
  const { content, theme } = website;
  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string } | null>(null);

  // Get only first 4 gallery items
  const displayItems = content.gallery.slice(0, 4);

  const openImage = (imageSrc: string, caption?: string) => {
    setSelectedImage({ src: imageSrc, caption: caption || '' });
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  // Get Instagram link if available
  const instagramLink = content.socialLinks?.find(link => link.platform === 'instagram' && link.enabled)?.url || '#';

  // Use wheat/cream background for Gallery section
  const wheatBg = theme.colors?.brand50 || theme.secondary || '#fbf8f3';
  
  return (
    <section id="gallery" className="py-20 relative" style={{
      backgroundColor: wheatBg,
    }}>
      <style>{`
        .gallery-grid-4 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 16px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .gallery-item-1 {
          grid-column: 1;
          grid-row: 1;
        }
        .gallery-item-2 {
          grid-column: 2;
          grid-row: 1;
        }
        .gallery-item-3 {
          grid-column: 3;
          grid-row: 1;
        }
        .gallery-item-4 {
          grid-column: 2 / 4;
          grid-row: 2;
        }
        .gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.3s ease, opacity 0.3s ease;
          aspect-ratio: auto;
        }
        .gallery-item:hover {
          transform: scale(1.02);
          opacity: 0.9;
        }
        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .gallery-item-1 img,
        .gallery-item-2 img,
        .gallery-item-3 img {
          min-height: 300px;
        }
        .gallery-item-4 img {
          min-height: 400px;
        }
        .gallery-modal {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        @media (max-width: 768px) {
          .gallery-grid-4 {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, auto);
          }
          .gallery-item-1,
          .gallery-item-2,
          .gallery-item-3,
          .gallery-item-4 {
            grid-column: 1;
          }
          .gallery-item-1 { grid-row: 1; }
          .gallery-item-2 { grid-row: 2; }
          .gallery-item-3 { grid-row: 3; }
          .gallery-item-4 { grid-row: 4; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: theme.colors?.brand900 || '#67392b' }}>
                LIFE AT LIKIIA
              </p>
              <h2 
                className="text-4xl md:text-5xl font-bold" 
                style={{ 
                  color: theme.colors?.brand900 || '#67392b',
                  fontFamily: 'serif'
                }}
              >
                A Glimpse Inside
              </h2>
            </div>
            {instagramLink && instagramLink !== '#' && (
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: theme.colors?.brand900 || '#67392b' }}
              >
                <Instagram className="w-5 h-5" />
                <span>Follow us on Instagram</span>
              </a>
            )}
          </div>
        </div>

        {/* Gallery Grid - 4 Images Only */}
        {displayItems.length > 0 ? (
          <div className="gallery-grid-4">
            {displayItems.map((item, index) => (
              <div
                key={item.id}
                className={`gallery-item gallery-item-${index + 1}`}
                onClick={() => openImage(item.image, item.caption)}
              >
                <img
                  src={item.image}
                  alt={item.caption || "Gallery Item"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              No gallery items to display. Add up to 4 images in the Gallery Configuration.
            </p>
          </div>
        )}
      </div>

      {/* Full-size Image Modal - Stays Open Until Closed */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[100] p-4 gallery-modal"
          onClick={closeImage}
        >
          <div 
            className="relative max-w-7xl w-full max-h-[90vh] gallery-modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 z-20 transition-all backdrop-blur-sm"
              onClick={closeImage}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <div className="relative">
              <img
                src={selectedImage.src}
                alt={selectedImage.caption || "Gallery Item"}
                className="max-w-full max-h-[90vh] object-contain rounded-lg mx-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                }}
              />
              {selectedImage.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                  <h3 className="text-white text-xl font-semibold">{selectedImage.caption}</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
