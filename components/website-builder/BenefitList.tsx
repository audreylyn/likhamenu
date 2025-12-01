import React from 'react';
import { 
  Plus, Trash, Heart, Star, Award, Shield, Zap, Leaf, Clock, Users, CheckCircle, ArrowRight,
  Gift, Trophy, Target, Flame, Coffee, ShoppingBag, Truck, Headphones, Mail, Phone,
  Globe, Lock, Eye, ThumbsUp, Smile, Package, Wrench, Lightbulb, Rocket, TrendingUp
} from 'lucide-react';
import { Website, Benefit } from '../../types';

interface BenefitListProps {
  website: Website;
  addItem: <T extends keyof Website['content']>(section: T, item: Website['content'][T][number]) => void;
  removeItem: <T extends keyof Website['content']>(section: T, id: string) => void;
  updateItem: <T extends keyof Website['content'], K extends keyof Website['content'][T][number]>(section: T, id: string, key: K, value: Website['content'][T][number][K]) => void;
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

// Helper to render icon preview
const renderIconPreview = (icon: string) => {
  if (!icon || icon.trim() === '') {
    return <Star className="w-5 h-5 text-slate-400" />;
  }
  
  if (isImageUrl(icon)) {
    return (
      <img 
        src={icon} 
        alt="Icon" 
        className="w-5 h-5 object-contain" 
        onError={(e) => { 
          (e.target as HTMLImageElement).style.display = 'none'; 
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
  return <IconComponent className="w-5 h-5 text-slate-400" />;
};

export const BenefitList: React.FC<BenefitListProps> = ({
  website,
  addItem,
  removeItem,
  updateItem,
}) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-slate-500" /> Key Benefits
        </h3>
        <button
          onClick={() => addItem<Benefit>('benefits', { id: Math.random().toString(), title: 'New Benefit', description: 'Explanation', icon: 'Star' })}
          className="text-sm flex items-center gap-1 text-amber-600 hover:underline"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>
      <div className="space-y-3">
        {website.content.benefits.map((b) => (
          <div key={b.id} className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50 group">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-slate-200 flex-shrink-0">
              {renderIconPreview(b.icon)}
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={b.icon || ''}
                placeholder="Icon (Lucide name like 'Star', 'Heart' or image URL)"
                onChange={(e) => updateItem<Benefit>('benefits', b.id, 'icon', e.target.value)}
                className="w-full bg-transparent text-xs text-slate-500 border-b border-transparent focus:border-amber-400 outline-none"
              />
              <input
                type="text"
                value={b.title}
                placeholder="Title"
                onChange={(e) => updateItem<Benefit>('benefits', b.id, 'title', e.target.value)}
                className="w-full bg-transparent font-bold border-b border-transparent focus:border-amber-400 outline-none"
              />
              <textarea
                value={b.description}
                placeholder="Description"
                onChange={(e) => updateItem<Benefit>('benefits', b.id, 'description', e.target.value)}
                className="w-full bg-transparent text-sm text-slate-600 border-transparent focus:border-amber-400 outline-none resize-none"
                rows={2}
              />
            </div>
            <button onClick={() => removeItem('benefits', b.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
