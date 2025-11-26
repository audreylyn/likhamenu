import React, { useEffect, useState } from 'react';
import { Website } from '../../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { X } from 'lucide-react';

import './PreviewGallerySection.css'; // Custom styles

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

  const openImage = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <section className="base-template" style={{
      backgroundColor: isDark ? theme.primary : '#f9fafb',
      color: isDark ? 'white' : '#1f2937'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ color: isDark ? 'white' : theme.primary }}>Our Gallery</h2>
      </div>
      <div className="base-template__wrapper wrapper">
        <h1 className="base-template__title" style={{ color: isDark ? 'white' : theme.primary }}>
          Gallery
        </h1>
        <div className="base-template__content">
          <div className="booking-slider">
            {/* Slider Navigation */}
            <div className="booking-slider__nav slider-nav">
              <div title="Newest offers" tabIndex={0} className="slider-nav__item slider-nav__item_prev">
                <svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 26L2 14L14 2" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div title="Oldest offers" tabIndex={0} className="slider-nav__item slider-nav__item_next">
                <svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 26L14 14L2 2" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            {/* Slider Content */}
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={1.15}
              spaceBetween={20}
              slidesOffsetBefore={20}
              slidesOffsetAfter={20}
              speed={600}
              observer={true}
              watchOverflow={true}
              watchSlidesProgress={true}
              navigation={{
                nextEl: '.booking-slider__nav .slider-nav__item_next',
                prevEl: '.booking-slider__nav .slider-nav__item_prev',
                disabledClass: 'disabled',
              }}
              pagination={{
                el: '.booking-slider__pagination',
                type: 'bullets',
                bulletClass: 'slider-pagination__item',
                bulletActiveClass: 'active',
                clickable: true,
              }}
              breakpoints={{
                575: {
                  slidesPerView: 1.5,
                },
                992: {
                  slidesPerView: 2,
                  slidesOffsetBefore: 0,
                  slidesOffsetAfter: 0,
                },
                1366: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                  slidesOffsetBefore: 0,
                  slidesOffsetAfter: 0,
                },
              }}
              className="booking-slider__slider swiper"
            >
              {content.gallery.map((item) => (
                <SwiperSlide key={item.id} className="booking-slider__slide swiper-slide">
                  <div className="booking-slider__item booking-slider-item">
                    {item.price && (
                      <div className="booking-slider-item__badge">Popular</div>
                    )}
                    <a title={item.caption || "Gallery Item"} href="#" className="booking-slider-item__image" onClick={(e) => { e.preventDefault(); openImage(item.image); }}>
                      <img src={item.image} alt={item.caption || "Gallery Item"} />
                    </a>
                    <div className="booking-slider-item__content">
                      {item.price && (
                        <div className="booking-slider-item__price">
                          {item.price} <small>/month</small>
                        </div>
                      )}
                      <h2 className="booking-slider-item__title">
                        <a title={item.caption || "Gallery Item"} href="/" onClick={(e) => e.preventDefault()}>
                          {item.caption || "Gallery Item"}
                        </a>
                      </h2>
                      {item.address && (
                        <div className="booking-slider-item__address">
                          <span className="booking-slider-item__address-icon">
                            <img src="https://bato-web-agency.github.io/bato-shared/img/slider-2/icon-address.svg" alt="Address icon" />
                          </span>
                          {item.address}
                        </div>
                      )}
                      <div className="booking-slider-item__text">
                        {item.caption || "Explore this beautifully crafted space."}
                      </div>
                      {(item.beds || item.bathrooms || item.area) && (
                        <div className="booking-slider-item__footer">
                          <div className="booking-slider-item__footer-inner">
                            <div className="booking-slider-item__amenities">
                              {item.beds && (
                                <div className="booking-slider-item__amenity">
                                  <span className="booking-slider-item__amenity-icon">
                                    <img src="https://bato-web-agency.github.io/bato-shared/img/slider-2/icon-beds.svg" alt="Beds icon" />
                                  </span>
                                  <span className="booking-slider-item__amenity-text">{item.beds} Beds</span>
                                </div>
                              )}
                              {item.bathrooms && (
                                <div className="booking-slider-item__amenity">
                                  <span className="booking-slider-item__amenity-icon">
                                    <img src="https://bato-web-agency.github.io/bato-shared/img/slider-2/icon-bathrooms.svg" alt="Bathrooms icon" />
                                  </span>
                                  <span className="booking-slider-item__amenity-text">{item.bathrooms} Bathrooms</span>
                                </div>
                              )}
                              {item.area && (
                                <div className="booking-slider-item__amenity">
                                  <span className="booking-slider-item__amenity-icon">
                                    <img src="https://bato-web-agency.github.io/bato-shared/img/slider-2/icon-area.svg" alt="Area icon" />
                                  </span>
                                  <span className="booking-slider-item__amenity-text">{item.area}</span>
                                </div>
                              )}
                            </div>
                            <a href="/" className="booking-slider-item__btn" onClick={(e) => e.preventDefault()}>
                              Explore more
                              <span className="booking-slider-item__btn-icon"></span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Slider Pagination */}
            <div className="booking-slider__pagination slider-pagination"></div>
          </div>
        </div>

        {selectedImage && (
            <div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4"
                onClick={closeImage}
            >
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="absolute top-2 right-2 text-white text-3xl p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75"
                        onClick={closeImage}
                    >
                        <X size={24} />
                    </button>
                    <img src={selectedImage} alt="Enlarged gallery item" className="max-w-full max-h-[90vh] object-contain" />
                </div>
            </div>
        )}

      </div>
    </section>
  );
};
