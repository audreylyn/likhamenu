import { useReducer } from 'react';
import { Website } from '../types';
import { fileToBase64 } from '../utils/file';

type Action =
  | { type: 'set'; payload: Website | null }
  | { type: 'updateContent'; payload: { section: keyof Website['content']; value: any } }
  | { type: 'updateSocialLink'; payload: { platform: string; field: 'url' | 'enabled'; value: any } }
  | { type: 'addItem'; payload: { section: keyof Website['content']; item: any } }
  | { type: 'removeItem'; payload: { section: keyof Website['content']; id: string } }
  | { type: 'updateItem'; payload: { section: keyof Website['content']; id: string; field: string; value: any } }
  | { type: 'setTheme'; payload: Website['theme'] }
  | { type: 'setMarketing'; payload: Website['marketing'] }
  | { type: 'toggleSection'; payload: { section: keyof Website['enabledSections']; value: boolean } };

const reducer = (state: Website | null, action: Action): Website | null => {
  if (!state && action.type !== 'set') return state;

  switch (action.type) {
    case 'set':
      return action.payload;
    case 'updateContent': {
      const { section, value } = action.payload;
      return { ...state!, content: { ...state!.content, [section]: value } };
    }
    case 'updateSocialLink': {
      const { platform, field, value } = action.payload;
      const updated = state!.content.socialLinks.map((link) =>
        link.platform === platform ? { ...link, [field]: value } : link
      );
      return { ...state!, content: { ...state!.content, socialLinks: updated } };
    }
    case 'addItem': {
      const { section, item } = action.payload;
      const list = (state!.content[section] as unknown as any[]) || [];
      const newItem = { ...item, id: Date.now().toString() };
      return { ...state!, content: { ...state!.content, [section]: [...list, newItem] } };
    }
    case 'removeItem': {
      const { section, id } = action.payload;
      const list = (state!.content[section] as unknown as any[]) || [];
      return { ...state!, content: { ...state!.content, [section]: list.filter((it) => it.id !== id) } };
    }
    case 'updateItem': {
      const { section, id, field, value } = action.payload;
      const list = (state!.content[section] as unknown as any[]) || [];
      const updated = list.map((it) => (it.id === id ? { ...it, [field]: value } : it));
      return { ...state!, content: { ...state!.content, [section]: updated } };
    }
    case 'setTheme':
      return { ...state!, theme: action.payload };
    case 'setMarketing':
      return { ...state!, marketing: action.payload };
    case 'toggleSection': {
      const { section, value } = action.payload;
      return { ...state!, enabledSections: { ...state!.enabledSections, [section]: value } } as Website;
    }
    default:
      return state;
  }
};

export const useWebsite = (initial: Website | null) => {
  const [state, dispatch] = useReducer(reducer, initial);

  const setWebsite = (w: Website | null | ((prev: Website | null) => Website | null)) => {
    const next = typeof w === 'function' ? (w as (p: Website | null) => Website | null)(state) : w;
    dispatch({ type: 'set', payload: next });
  };
  const updateContent = (section: keyof Website['content'], value: any) => dispatch({ type: 'updateContent', payload: { section, value } });
  const updateSocialLink = (platform: string, field: 'url' | 'enabled', value: any) => dispatch({ type: 'updateSocialLink', payload: { platform, field, value } });
  const addItem = <T extends { id?: string }>(section: keyof Website['content'], item: Omit<T, 'id'>) => dispatch({ type: 'addItem', payload: { section, item } });
  const removeItem = (section: keyof Website['content'], id: string) => dispatch({ type: 'removeItem', payload: { section, id } });
  const updateItem = <T extends { id: string }>(section: keyof Website['content'], id: string, field: keyof T | string, value: any) => dispatch({ type: 'updateItem', payload: { section, id, field: field as string, value } });
  const setTheme = (theme: Website['theme']) => dispatch({ type: 'setTheme', payload: theme });
  const setMarketing = (marketing: Website['marketing']) => dispatch({ type: 'setMarketing', payload: marketing });
  const toggleSection = (section: keyof Website['enabledSections'], value: boolean) => dispatch({ type: 'toggleSection', payload: { section, value } });

  return {
    website: state,
    setWebsite,
    updateContent,
    updateSocialLink,
    addItem,
    removeItem,
    updateItem,
    setTheme,
    setMarketing,
    toggleSection,
    fileToBase64,
  };
};

export default useWebsite;
