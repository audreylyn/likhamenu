import React, { useRef, useState, useEffect } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Website } from '../../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

interface PreviewTestimonialsSectionProps {
  website: Website;
  isDark: boolean;
  textMuted: string;
  handleAvatarError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const PreviewTestimonialsSection: React.FC<PreviewTestimonialsSectionProps> = ({
  website,
  isDark,
  textMuted,
  handleAvatarError,
}) => {
  const { content, theme } = website;
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (swiper) {
      const updateButtons = () => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
      };
      updateButtons();
      swiper.on('slideChange', updateButtons);
      return () => {
        swiper.off('slideChange', updateButtons);
      };
    }
  }, [swiper]);

  if (content.testimonials.length === 0) {
    return null;
  }

  // Get warm brown colors from theme
  const warmBrown = theme.colors?.brand500 || theme.colors?.brand600 || '#c58550';
  const darkBrown = theme.colors?.brand900 || '#67392b';
  const lightCream = theme.colors?.brand50 || theme.secondary || '#fbf8f3';
  const bgColor = theme.colors?.brand900 || theme.primary || '#67392b'; // Dark brown background

  return (
    <section id="testimonials" className="py-20 relative" style={{ backgroundColor: bgColor }}>
      <style>{`
        :root {
          --tw-ring-color: transparent !important;
        }
        * {
          --tw-ring-color: transparent !important;
        }
        .testimonial-card {
          background-color: ${lightCream};
          border-radius: 16px;
          padding: 32px;
          height: 100%;
          position: relative;
          transition: transform 0.3s ease;
        }
        .testimonial-card:hover {
          transform: translateY(-4px);
        }
        .quote-mark-large {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 120px;
          line-height: 1;
          opacity: 0.4;
          color: ${lightCream};
          font-family: serif;
          font-weight: 300;
          z-index: 1;
        }
        .quote-mark-small {
          position: absolute;
          bottom: -6px;
          right: -6px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: ${lightCream};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: ${warmBrown};
          font-family: serif;
          font-weight: 300;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          z-index: 10;
          border: 2px solid white;
        }
        .swiper-button-custom {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: ${bgColor};
          border: 2px solid ${warmBrown};
          color: ${warmBrown};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .swiper-button-custom:hover {
          background-color: ${warmBrown};
          color: white;
        }
        .swiper-button-custom:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .swiper-button-custom:disabled:hover {
          background-color: ${bgColor};
          color: ${warmBrown};
        }
        .swiper-button-custom svg {
          width: 20px;
          height: 20px;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-16">
          <p 
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: warmBrown }}
          >
            COMMUNITY LOVE
          </p>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            style={{ 
              color: warmBrown,
              fontFamily: 'var(--heading-font)'
            }}
          >
            Words from our
            <br />
            <span 
              className="italic"
              style={{ 
                fontFamily: 'var(--heading-font)',
                fontStyle: 'italic'
              }}
            >
              Regulars
            </span>
          </h2>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          onSwiper={setSwiper}
          className="testimonials-swiper"
        >
          {content.testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="testimonial-card">
                {/* Large decorative quote mark */}
                <div className="quote-mark-large">"</div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-6 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-5 h-5 fill-current" 
                      style={{ color: warmBrown }}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p 
                  className="text-base md:text-lg mb-8 leading-relaxed pr-12 relative z-10"
                  style={{ 
                    color: darkBrown,
                    fontFamily: 'var(--heading-font)'
                  }}
                >
                  {t.content}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 relative z-10">
                  <div className="relative flex-shrink-0">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        onError={handleAvatarError}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-white"
                        style={{ backgroundColor: '#9ca3af' }}
                      >
                        {t.name.charAt(0)}
                      </div>
                    )}
                    {/* Small closing quote icon on avatar */}
                    <div className="quote-mark-small">"</div>
                  </div>
                  <div>
                    <p 
                      className="font-bold text-base mb-1"
                      style={{ 
                        color: darkBrown,
                        fontFamily: 'var(--heading-font)'
                      }}
                    >
                      {t.name}
                    </p>
                    <p 
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ 
                        color: darkBrown,
                        fontFamily: 'var(--body-font)'
                      }}
                    >
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons at Bottom */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            ref={navigationPrevRef}
            className="swiper-button-custom swiper-button-prev-custom"
            aria-label="Previous"
            onClick={() => swiper?.slidePrev()}
            disabled={isBeginning}
          >
            <ChevronLeft />
          </button>
          <button
            ref={navigationNextRef}
            className="swiper-button-custom swiper-button-next-custom"
            aria-label="Next"
            onClick={() => swiper?.slideNext()}
            disabled={isEnd}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};
