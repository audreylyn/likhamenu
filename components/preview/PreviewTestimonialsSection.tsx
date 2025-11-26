import React from 'react';
import { User } from 'lucide-react';
import { Website } from '../../types';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import required modules
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

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

  return (
    <section id="testimonials" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4" style={{ color: theme.primary }}>What People Say</h2>
        </div>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 2,
            },
          }}
          className="mySwiper"
        >
          {content.testimonials.map(t => (
            <SwiperSlide key={t.id}>
              <div className={`p-8 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'} relative`}>
                <div className="text-4xl absolute top-4 left-6 opacity-20" style={{ color: theme.primary }}>"</div>
                <p className={`text-lg italic mb-6 relative z-10 ${textMuted}`}>{t.content}</p>
                <div className="flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    onError={handleAvatarError}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className={`text-sm ${textMuted}`}>{t.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
