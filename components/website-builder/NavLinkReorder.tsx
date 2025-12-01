import React from 'react';
import { Website } from '../../types';
import { ChevronUp, ChevronDown, Menu } from 'lucide-react';

interface NavLinkReorderProps {
  website: Website;
  setWebsite: React.Dispatch<React.SetStateAction<Website | null>>;
}

export const NavLinkReorder: React.FC<NavLinkReorderProps> = ({
  website,
  setWebsite,
}) => {
  const sectionMap: { [key in keyof typeof website.enabledSections]?: string } = {
    hero: 'Home',
    about: 'About',
    products: 'Products',
    featured: 'Featured',
    benefits: 'Benefits',
    testimonials: 'Testimonials',
    faq: 'FAQ',
    gallery: 'Gallery',
    team: 'Team',
    pricing: 'Pricing',
    callToAction: 'Call to Action',
    contact: 'Contact',
  };

  const excludedSections = ['hero', 'callToAction'];

  const navLinks = Object.entries(website.enabledSections)
    .filter(([sectionKey, isEnabled]) => isEnabled && !excludedSections.includes(sectionKey))
    .map(([sectionKey]) => {
      const displayKey = sectionKey as keyof typeof website.enabledSections;
      const sectionName = sectionMap[displayKey];
      if (sectionName) {
        return {
          id: sectionKey,
          name: sectionName,
        };
      }
      // Fallback: capitalize sectionKey safely
      const safeKey = sectionKey || '';
      return {
        id: sectionKey,
        name: safeKey.charAt(0).toUpperCase() + safeKey.slice(1),
      };
    });

  // Use navLinkOrder from content field, otherwise use default order
  const navLinkOrder = (website.content as any)?.navLinkOrder;
  
  // Build ordered links: use navLinkOrder if available, but add any new enabled sections at the end
  let orderedLinks: { id: string; name: string }[];
  if (navLinkOrder && navLinkOrder.length > 0) {
    // Start with sections from navLinkOrder that are still enabled
    const orderedFromConfig = navLinkOrder
      .map(id => navLinks.find(link => link.id === id))
      .filter((link): link is { id: string; name: string } => link !== undefined);
    
    // Add any newly enabled sections that aren't in the order yet
    const orderedIds = new Set(orderedFromConfig.map(link => link.id));
    const newSections = navLinks.filter(link => !orderedIds.has(link.id));
    
    orderedLinks = [...orderedFromConfig, ...newSections];
  } else {
    // No order set yet, use current navLinks order
    orderedLinks = navLinks;
  }

  const moveUp = (index: number) => {
    if (index === 0) return;

    const newOrder = [...orderedLinks];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];

    const newNavLinkOrder = newOrder.map(link => link.id as keyof typeof website.enabledSections);

    setWebsite(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        content: {
          ...prev.content,
          navLinkOrder: newNavLinkOrder
        }
      };
    });
  };

  const moveDown = (index: number) => {
    if (index === orderedLinks.length - 1) return;

    const newOrder = [...orderedLinks];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];

    const newNavLinkOrder = newOrder.map(link => link.id as keyof typeof website.enabledSections);

    setWebsite(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        content: {
          ...prev.content,
          navLinkOrder: newNavLinkOrder
        }
      };
    });
  };

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
      <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
        <Menu className="w-5 h-5 text-amber-500" />
        Navigation Order
      </h3>
      <div className="space-y-3">
        {orderedLinks.map((link, index) => (
          <div
            key={link.id}
            className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Menu className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">{link.name}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="p-1 text-slate-400 hover:text-amber-600 disabled:text-slate-200 disabled:cursor-not-allowed transition-colors"
                title="Move up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveDown(index)}
                disabled={index === orderedLinks.length - 1}
                className="p-1 text-slate-400 hover:text-amber-600 disabled:text-slate-200 disabled:cursor-not-allowed transition-colors"
                title="Move down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500 mt-4">Sections like 'Home' and 'Call to Action' are excluded from reordering as they have fixed positions.</p>
    </div>
  );
};
