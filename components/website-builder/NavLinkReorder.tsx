import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Website } from '../../types';
import { Menu } from 'lucide-react';

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
      return {
        id: sectionKey,
        name: sectionMap[displayKey] || sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1),
      };
    });

  const initialOrderedLinks = website.navLinkOrder
    ? website.navLinkOrder
        .map(id => navLinks.find(link => link.id === id))
        .filter((link): link is { id: string; name: string } => link !== undefined)
    : navLinks;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedLinks = Array.from(initialOrderedLinks);
    const [removed] = reorderedLinks.splice(result.source.index, 1);
    reorderedLinks.splice(result.destination.index, 0, removed);

    const newNavLinkOrder = reorderedLinks.map(link => link.id as keyof typeof website.enabledSections);

    setWebsite(prev => {
      if (!prev) return prev;
      return { ...prev, navLinkOrder: newNavLinkOrder };
    });
  };

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Menu className="w-5 h-5 text-indigo-500" />
        Navigation Order
      </h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="navlinks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {initialOrderedLinks.map((link, index) => (
                <Draggable key={link.id} draggableId={link.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm"
                    >
                      <Menu className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{link.name}</span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
