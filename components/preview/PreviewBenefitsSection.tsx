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

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 139, g: 90, b: 43 }; // Default warm brown
};

// Helper function to get warm brown color from theme
const getWarmBrown = (theme: { primary: string }): string => {
  const rgb = hexToRgb(theme.primary);
  // Create a warm brown tone from the primary color
  const brown = {
    r: Math.max(100, Math.min(180, rgb.r + 20)),
    g: Math.max(70, Math.min(150, rgb.g - 10)),
    b: Math.max(40, Math.min(100, rgb.b - 30))
  };
  return `rgb(${brown.r}, ${brown.g}, ${brown.b})`;
};

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
const renderIcon = (icon: string, theme: { primary: string }) => {
  const warmBrown = getWarmBrown(theme);
  
  if (!icon || icon.trim() === '') {
    const IconComponent = iconMap['Star'] || Star;
    return <IconComponent className="w-8 h-8" style={{ color: warmBrown }} />;
  }
  
  if (isImageUrl(icon)) {
    return (
      <img 
        src={icon} 
        alt="Benefit icon" 
        className="w-8 h-8 object-contain"
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
  const iconName = icon.trim();
  // Try exact match first
  let IconComponent = iconMap[iconName];
  // Try capitalized version (e.g., "leaf" -> "Leaf")
  if (!IconComponent) {
    const capitalized = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
    IconComponent = iconMap[capitalized];
  }
  // Fallback to Star if not found
  if (!IconComponent) {
    IconComponent = Star;
  }
  return <IconComponent className="w-8 h-8" style={{ color: warmBrown }} />;
};

export const PreviewBenefitsSection: React.FC<PreviewBenefitsSectionProps> = ({
  website,
  isDark,
  textMuted,
}) => {
  const { content, theme } = website;
  const warmBrown = getWarmBrown(theme);
  const lightBeige = isDark ? 'rgba(245, 245, 240, 0.15)' : 'rgba(245, 245, 240, 0.8)';
  const darkBrown = isDark ? 'rgba(139, 90, 43, 0.9)' : 'rgb(101, 67, 33)';
  const darkGray = isDark ? 'rgba(107, 114, 128, 0.8)' : 'rgb(75, 85, 99)';

  // Use wheat/cream background for Benefits (WhyChooseUs) section
  const wheatBg = theme.colors?.brand50 || theme.secondary || '#fbf8f3';
  
  return (
    <section id="benefits" className="py-20" style={{ backgroundColor: wheatBg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with title and divider line */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6" 
            style={{ 
              color: darkBrown,
              fontFamily: 'serif'
            }}
          >
            Why Choose Us
          </h2>
          <div 
            className="w-24 h-0.5 mx-auto"
            style={{ 
              backgroundColor: warmBrown + '80',
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
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{
                  backgroundColor: lightBeige,
                }}
              >
                {renderIcon(b.icon || 'Star', theme)}
              </div>

              {/* Heading */}
              <h3 
                className="text-xl font-bold mb-4"
                style={{ 
                  color: darkBrown,
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
