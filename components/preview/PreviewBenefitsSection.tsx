import React from 'react';
import { 
  Star, Heart, Award, Shield, Zap, Leaf, Clock, Users, CheckCircle, ArrowRight,
  Gift, Trophy, Target, Flame, Coffee, ShoppingBag, Truck, Headphones, Mail, Phone,
  Globe, Lock, Eye, ThumbsUp, Smile, Package, Wrench, Lightbulb, Rocket, TrendingUp
} from 'lucide-react';
import { Website } from '../../types';

interface PreviewBenefitsSectionProps {
  website: Website;
  isDark: boolean;
  textMuted: string;
}


// Icon mapping for Lucide icons
const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Star,
  Heart,
  Award,
  Shield,
  Zap,
  Leaf,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Gift,
  Trophy,
  Target,
  Flame,
  Coffee,
  ShoppingBag,
  Truck,
  Headphones,
  Mail,
  Phone,
  Globe,
  Lock,
  Eye,
  ThumbsUp,
  Smile,
  Package,
  Wrench,
  Lightbulb,
  Rocket,
  TrendingUp,
};

// Helper to check if icon is a URL
const isImageUrl = (icon: string): boolean => {
  return icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('data:');
};

// Helper to render icon
const renderIcon = (icon: string, theme: { colors?: { brand500?: string }; primary: string }) => {
  const warmBrown = theme.colors?.brand500 || '#c58550';
  
  if (!icon || icon.trim() === '') {
    const IconComponent = iconMap['Star'] || Star;
    return <IconComponent className="w-8 h-8 benefit-icon transition-colors duration-300" style={{ color: warmBrown }} />;
  }
  
  if (isImageUrl(icon)) {
    return (
      <img 
        src={icon} 
        alt="Benefit icon" 
        className="w-8 h-8 object-contain benefit-icon-image transition-all duration-300"
        style={{ 
          maxWidth: '2rem',
          maxHeight: '2rem',
          width: 'auto',
          height: 'auto'
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    );
  }
  
  // Case-insensitive icon name matching
  const iconName = (icon || '').trim();
  // Try exact match first
  let IconComponent = iconName ? iconMap[iconName] : null;
  // Try capitalized version (e.g., "leaf" -> "Leaf")
  if (!IconComponent && iconName) {
    const capitalized = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
    IconComponent = iconMap[capitalized];
  }
  // Fallback to Star if not found
  if (!IconComponent) {
    IconComponent = Star;
  }
  return <IconComponent className="w-8 h-8 benefit-icon transition-colors duration-300" style={{ color: warmBrown }} />;
};

export const PreviewBenefitsSection: React.FC<PreviewBenefitsSectionProps> = ({
  website,
  isDark,
  textMuted,
}) => {
  const { content, theme } = website;
  // Use theme colors from presets
  const warmBrown = theme.colors?.brand500 || '#c58550';
  const darkBrown = theme.colors?.brand900 || '#67392b';
  const darkGray = isDark ? 'rgba(107, 114, 128, 0.8)' : 'rgb(75, 85, 99)';
  
  // Icon background colors
  const iconBgDefault = theme.colors?.brand100 || '#f5efe4'; // Slightly darker than brand50
  const iconBgHover = theme.colors?.brand600 || theme.primary || '#b96b40'; // Primary/dark color
  const iconColorDefault = warmBrown;
  const iconColorHover = '#ffffff'; // White on hover

  // Use wheat/cream background for Benefits (WhyChooseUs) section
  const wheatBg = theme.colors?.brand50 || theme.secondary || '#fbf8f3';
  
  return (
    <section id="benefits" className="py-20" style={{ backgroundColor: wheatBg }}>
      <style>{`
        .benefit-icon-wrapper {
          transition: all 0.3s ease;
        }
        .benefit-icon-wrapper:hover {
          background-color: ${iconBgHover} !important;
        }
        .benefit-icon-wrapper:hover .benefit-icon {
          color: ${iconColorHover} !important;
        }
        .benefit-icon-wrapper:hover .benefit-icon-image {
          filter: brightness(0) invert(1);
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with title and divider line */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6" 
            style={{ 
              color: darkBrown,
              fontFamily: 'var(--heading-font)'
            }}
          >
            Why Choose Us
          </h2>
          <div 
            className="w-24 h-0.5 mx-auto"
            style={{ 
              backgroundColor: (theme.colors?.brand500 || '#c58550') + '80',
              marginTop: '0.5rem'
            }}
          />
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {content.benefits.map(b => (
            <div
              key={b.id}
              className="flex flex-col items-center text-center"
            >
              {/* Icon in circular background */}
              <div
                className="benefit-icon-wrapper w-20 h-20 rounded-full flex items-center justify-center mb-6 cursor-pointer"
                style={{
                  backgroundColor: iconBgDefault,
                }}
              >
                {renderIcon(b.icon || 'Star', theme)}
              </div>

              {/* Heading */}
              <h3 
                className="text-xl font-bold mb-4"
                style={{ 
                  color: darkBrown,
                  fontFamily: 'var(--heading-font)',
                  lineHeight: '1.3'
                }}
              >
                {b.title}
              </h3>

              {/* Description */}
              <p 
                className="text-base leading-relaxed"
                style={{ 
                  color: darkGray,
                  fontFamily: 'var(--body-font)',
                  lineHeight: '1.6'
                }}
              >
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
