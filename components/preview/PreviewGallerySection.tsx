import React, { useState, useEffect } from 'react';
import { Website } from '../../types';
import { X, Instagram, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface PreviewGallerySectionProps {
  website: Website;
  isDark: boolean;
}

export const PreviewGallerySection: React.FC<PreviewGallerySectionProps> = ({
  website,
  isDark,
}) => {
  const { content, theme } = website;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Get all gallery items (not just first 4)
  const galleryItems = content.gallery;

  const openImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImage = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null && galleryItems.length > 0) {
      setSelectedImageIndex((selectedImageIndex + 1) % galleryItems.length);
    }
  };

  const previousImage = () => {
    if (selectedImageIndex !== null && galleryItems.length > 0) {
      setSelectedImageIndex((selectedImageIndex - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, galleryItems.length]);

  // Get Instagram link if available
  const instagramLink = content.socialLinks?.find(link => link.platform === 'instagram' && link.enabled)?.url || '#';

  // Use wheat/cream background for Gallery section
  const wheatBg = theme.colors?.brand50 || theme.secondary || '#fbf8f3';
  const darkBrown = theme.colors?.brand900 || '#67392b';
  const warmBrown = theme.colors?.brand500 || '#c58550';
  
  return (
    <section id="gallery" className="py-20 relative" style={{ backgroundColor: wheatBg }}>
      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          grid-auto-rows: 250px;
        }
        .bento-item {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          cursor: zoom-in;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%);
        }
        .bento-item:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        .bento-item:hover .bento-overlay {
          opacity: 1;
        }
        .bento-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .bento-item:hover img {
          transform: scale(1.1);
        }
        .bento-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .bento-maximize-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${darkBrown};
          transform: scale(0.8);
          transition: transform 0.3s ease;
        }
        .bento-item:hover .bento-maximize-icon {
          transform: scale(1);
        }
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        .lightbox-content {
          position: relative;
          max-width: 95vw;
          max-height: 95vh;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: zoomIn 0.3s ease;
        }
        .lightbox-image {
          max-width: 100%;
          max-height: 95vh;
          object-fit: contain;
          border-radius: 8px;
        }
        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }
        .lightbox-nav:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-50%) scale(1.1);
        }
        .lightbox-nav.prev {
          left: 20px;
        }
        .lightbox-nav.next {
          right: 20px;
        }
        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }
        .lightbox-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }
        .lightbox-caption {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          color: white;
          padding: 12px 24px;
          border-radius: 24px;
          font-size: 14px;
          max-width: 80%;
          text-align: center;
        }
        .lightbox-counter {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          z-index: 10;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @media (max-width: 768px) {
          .bento-grid {
            grid-template-columns: 1fr;
            grid-auto-rows: 200px;
          }
          .lightbox-nav {
            width: 40px;
            height: 40px;
          }
          .lightbox-nav.prev {
            left: 10px;
          }
          .lightbox-nav.next {
            right: 10px;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p 
                className="text-sm font-semibold uppercase tracking-wider mb-2" 
                style={{ color: darkBrown }}
              >
                bg-amber-300 LIKIIA
              </p>
              <h2 
                className="text-4xl md:text-5xl font-bold" 
                style={{ 
                  color: darkBrown,
                  fontFamily: 'var(--heading-font)'
                }}
              >
                Life at {website.title || 'Our Business'}
              </h2>
            </div>
            {instagramLink && instagramLink !== '#' && (
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: darkBrown }}
              >
                <Instagram className="w-5 h-5" />
                <span>Follow us on Instagram</span>
              </a>
            )}
          </div>
        </div>

        {/* Bento Grid Gallery */}
        {galleryItems.length > 0 ? (
          <div className="bento-grid">
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                className="bento-item"
                onClick={() => openImage(index)}
              >
                <img
                  src={item.image}
                  alt={item.caption || `Gallery Image ${index + 1}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                  }}
                />
                <div className="bento-overlay">
                  <div className="bento-maximize-icon">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg" style={{ color: darkBrown }}>
              No gallery items to display. Add images in the Gallery Configuration.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal with Carousel */}
      {selectedImageIndex !== null && galleryItems[selectedImageIndex] && (
        <div
          className="lightbox-overlay"
          onClick={closeImage}
        >
          <div 
            className="lightbox-content" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Counter */}
            <div className="lightbox-counter">
              {selectedImageIndex + 1} / {galleryItems.length}
            </div>

            {/* Close Button */}
            <button
              className="lightbox-close"
              onClick={closeImage}
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Previous Button */}
            {galleryItems.length > 1 && (
              <button
                className="lightbox-nav prev"
                onClick={previousImage}
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Image */}
            <img
              src={galleryItems[selectedImageIndex].image}
              alt={galleryItems[selectedImageIndex].caption || `Gallery Image ${selectedImageIndex + 1}`}
              className="lightbox-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/800x600?text=Image+Not+Found';
              }}
            />

            {/* Next Button */}
            {galleryItems.length > 1 && (
              <button
                className="lightbox-nav next"
                onClick={nextImage}
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Caption */}
            {galleryItems[selectedImageIndex].caption && (
              <div className="lightbox-caption">
                {galleryItems[selectedImageIndex].caption}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
