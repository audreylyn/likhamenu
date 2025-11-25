import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ColorPicker } from '../components/ColorPicker';
import { Website, Product, Benefit, Testimonial, FAQ, SocialLink } from '../types';
import { saveWebsite, getWebsiteById, uploadImage } from '../services/supabaseService';
import { generateWebsiteContent, generateTheme, generateMarketingContent } from '../services/geminiService';
import { Save, ArrowLeft, Plus, Trash, Sparkles, Image as ImageIcon, Loader2, Lock, ExternalLink, Palette, Sun, Moon, MessageCircle, Layers, Star, HelpCircle, Heart, User, Facebook, Instagram, Twitter, Linkedin, Youtube, Link as LinkIcon, Megaphone, Copy, Check, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWebsite } from '../hooks/useWebsite';
import { DEFAULT_WEBSITE } from '../constants/websiteDefaults';



export const WebsiteBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'settings' | 'content' | 'marketing'>('settings');
  const websiteManager = useWebsite(null);
  const { website, setWebsite, updateContent, updateSocialLink, addItem, removeItem, updateItem, setTheme, setMarketing, toggleSection, fileToBase64 } = websiteManager;
  const [isNew, setIsNew] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // AI Content State
  const [aiPrompt, setAiPrompt] = useState({ name: '', type: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Theme State
  const [themePrompt, setThemePrompt] = useState('');
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);

  // AI Marketing State
  const [isGeneratingMarketing, setIsGeneratingMarketing] = useState(false);
  const [copied, setCopied] = useState(false);

  // File Input Refs
  const heroImageInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      // upload to Supabase storage and return the public URL to the callback
      uploadImage(file).then((url) => callback(url)).catch(() => {});
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!id && user.role === 'editor') {
        navigate('/');
        return;
      }

      if (id) {
        setIsNew(false);
        try {
          const existing = await getWebsiteById(id);
          if (existing) {
          // Ensure new fields exist if loading legacy data
          const merged = { ...DEFAULT_WEBSITE, ...existing };
          merged.enabledSections = { ...DEFAULT_WEBSITE.enabledSections, ...existing.enabledSections };
          merged.content = { 
            ...DEFAULT_WEBSITE.content, 
            ...existing.content,
            products: existing.content.products.map(p => ({...p, price: p.price || ''})),
            benefits: existing.content.benefits || [],
            testimonials: existing.content.testimonials || [],
            faq: existing.content.faq || [],
            socialLinks: existing.content.socialLinks || DEFAULT_WEBSITE.content.socialLinks,
          };
          // Ensure marketing object exists
          merged.marketing = existing.marketing || DEFAULT_WEBSITE.marketing;
          setWebsite(merged);
          } else {
            navigate('/');
          }
        } catch (err) {
          console.error('Failed to load website', err);
          alert('Failed to load website: ' + ((err as any)?.message || String(err)));
          navigate('/');
        }
      } else {
        setWebsite({ ...DEFAULT_WEBSITE, id: Date.now().toString(), createdAt: new Date().toISOString() });
      }
      setIsLoading(false);
    };

    init();
  }, [id, navigate, user.role]);

  useEffect(() => {
    if (user.role === 'editor') {
      setActiveTab('content');
    }
  }, [user.role]);

  const handleSave = async () => {
    if (!website) return;
    setIsSaving(true);
    try {
      await saveWebsite(website);
      setIsSaving(false);
      navigate('/');
    } catch (err) {
      console.error('Failed to save website', err);
      setIsSaving(false);
      alert('Failed to save website: ' + ((err as any)?.message || String(err)));
    }
  };

  const handlePreview = () => {
    if (!website) return;
    // Save draft to Supabase as a draft record and open preview by id
    (async () => {
      try {
        const draft = { ...website, status: 'draft', createdAt: website.createdAt || new Date().toISOString() } as Website;
        const saved = await saveWebsite(draft);

        // If the website has a configured subdomain, build the preview URL using it.
        // Otherwise fall back to the current origin (localhost during development).
        let baseUrl = window.location.origin; // Default to current origin for development
        if (website.subdomain && website.subdomain.trim()) {
          // For published subdomains, use the full subdomain URL
          baseUrl = `https://${website.subdomain}.likhasiteworks.dev`;
        }

        const previewUrl = `${baseUrl}/preview/${saved.id}`;
        window.open(previewUrl, '_blank');
      } catch (err) {
        console.error('Failed to save draft for preview', err);
        alert('Failed to create preview draft: ' + ((err as any)?.message || String(err)));
      }
    })();
  };

  

  

  // --- Helper functions for list management ---

  // addItem provided by useWebsite

  // removeItem provided by useWebsite

  // updateItem provided by useWebsite

  // file upload handled by wrapper above using fileToBase64

  // -------------------------------------------

  const handleAiGenerate = async () => {
    if (!aiPrompt.name || !aiPrompt.type || !website) return;
    setIsGenerating(true);
    const result = await generateWebsiteContent(aiPrompt.name, aiPrompt.type);
    
    if (result) {
      setWebsite(prev => {
        if (!prev) return null;
        
        // Helper to generate a unique but deterministic-looking ID for mapped items
        const generateId = () => Math.random().toString(36).substr(2, 9);
        const timestamp = Date.now();
        
        // Helper to generate dynamic image URL from prompt
        const generateImageUrl = (prompt: string, width: number, height: number) => {
          return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true`;
        };

        return {
          ...prev,
          title: aiPrompt.name,
          content: {
            ...prev.content,
            hero: { 
              ...prev.content.hero, 
              title: result.heroTitle, 
              subtext: result.heroSubtext,
              image: result.heroImagePrompt 
                ? generateImageUrl(result.heroImagePrompt, 1200, 600)
                : `https://placehold.co/1200x600?text=Hero+Image`
            },
            about: result.aboutText,
            products: result.products?.map((p, i) => ({
              id: generateId(),
              name: p.name,
              description: p.description,
              price: p.price.includes('₱') ? p.price : `₱${p.price.replace('$', '')}`, // Ensure Peso sign
              image: p.imagePrompt 
                ? generateImageUrl(p.imagePrompt, 800, 600)
                : `https://placehold.co/800x600?text=${encodeURIComponent(p.name)}`
            })) || [],
            benefits: result.benefits?.map((b) => ({
              id: generateId(),
              title: b.title,
              description: b.description,
              icon: b.icon || 'Star'
            })) || [],
            testimonials: result.testimonials?.map((t, i) => ({
              id: generateId(),
              name: t.name,
              role: t.role,
              content: t.content,
              avatar: `https://placehold.co/150x150?text=${t.name.charAt(0)}`
            })) || [],
            faq: result.faq?.map((f) => ({
              id: generateId(),
              question: f.question,
              answer: f.answer
            })) || [],
          },
          enabledSections: {
            ...prev.enabledSections,
            // Auto-enable sections if AI returned content for them
            products: (result.products?.length ?? 0) > 0,
            benefits: (result.benefits?.length ?? 0) > 0,
            testimonials: (result.testimonials?.length ?? 0) > 0,
            faq: (result.faq?.length ?? 0) > 0,
          }
        };
      });
    }
    setIsGenerating(false);
  };

  const handleThemeGenerate = async () => {
    if (!themePrompt) return;
    setIsGeneratingTheme(true);
    const theme = await generateTheme(themePrompt);
    if (theme) {
      setWebsite(prev => {
        if (!prev) return null;
        return { ...prev, theme };
      });
    }
    setIsGeneratingTheme(false);
  };

  const handleMarketingGenerate = async () => {
    if (!website) return;
    setIsGeneratingMarketing(true);
    const result = await generateMarketingContent(website);
    if (result) {
       setWebsite(prev => {
         if (!prev) return null;
         return {
           ...prev,
           marketing: {
             seo: {
               metaTitle: result.metaTitle,
               metaDescription: result.metaDescription,
               keywords: result.keywords
             },
             socialPost: result.socialPost
           }
         }
       });
    }
    setIsGeneratingMarketing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      default: return <LinkIcon className="w-5 h-5" />;
    }
  };

  if (isLoading || !website) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-slate-500">Loading editor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-full max-w-5xl mx-auto pb-20">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">
              {isNew ? 'Create Website' : `Edit: ${website.title}`}
            </h1>
            {user.role === 'editor' && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium border border-yellow-200">
                Editor Mode
              </span>
            )}
          </div>
          <div className="flex gap-3">
             <button 
               onClick={handlePreview}
               className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium flex items-center gap-2"
             >
               <ExternalLink className="w-4 h-4" />
               Preview
             </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
          <button
            onClick={() => user.role === 'admin' && setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'border-indigo-600 text-indigo-600' 
                : user.role === 'editor' 
                  ? 'border-transparent text-slate-300 cursor-not-allowed' 
                  : 'border-transparent text-slate-500 hover:text-indigo-600'
            }`}
          >
            Settings & Appearance
            {user.role === 'editor' && <Lock className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'content' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-indigo-600'
            }`}
          >
            Content Management
          </button>
          <button
            onClick={() => setActiveTab('marketing')}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'marketing' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-indigo-600'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            Marketing Kit
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[500px]">
          
          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && user.role === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                {/* General Info */}
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">General Information</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Website Title</label>
                  <input
                    type="text"
                    value={website.title}
                    onChange={(e) => setWebsite({ ...website, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subdomain</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={website.subdomain}
                      onChange={(e) => setWebsite({ ...website, subdomain: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <span className="bg-slate-100 border border-l-0 border-slate-300 text-slate-500 px-4 py-2 rounded-r-lg">
                      .likhasiteworks.dev
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={website.status || 'draft'}
                    onChange={(e) => setWebsite({ ...website, status: e.target.value as 'draft' | 'published' })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {/* Section Visibility */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-500" />
                    Page Sections
                  </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {(Object.keys(website.enabledSections) as Array<keyof typeof website.enabledSections>).map((key) => {
                        const enabled = website.enabledSections[key];
                        return (
                          <label key={String(key)} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-indigo-300 transition-all">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(e) => setWebsite(prev => prev ? ({ ...prev, enabledSections: { ...prev.enabledSections, [key]: e.target.checked } }) : prev)}
                              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="capitalize text-sm font-medium text-slate-700">{key} Section</span>
                          </label>
                        );
                      })}
                    </div>
                </div>
              </div>

              {/* Right Column: Theme & Integrations */}
              <div className="space-y-8">
                {/* Visual Style */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-indigo-500" />
                    Visual Style
                  </h3>

                   {/* AI Theme Generator */}
                  <div className="mb-6 bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                    <label className="text-sm font-semibold text-indigo-900 mb-2 block flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      AI Theme Generator
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 'Cyberpunk Neon', 'Pastel Bakery', 'Corporate Blue'"
                        value={themePrompt}
                        onChange={(e) => setThemePrompt(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={handleThemeGenerate}
                        disabled={isGeneratingTheme || !themePrompt}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                      >
                         {isGeneratingTheme ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-3">Color Theme</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => website && setTheme({ ...website.theme, background: 'light' })}
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                            website.theme.background === 'light' 
                              ? 'border-indigo-600 bg-white text-indigo-600' 
                              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <Sun className="w-4 h-4" />
                          <span className="font-medium text-sm">Light Mode</span>
                        </button>
                        <button
                          onClick={() => website && setTheme({ ...website.theme, background: 'dark' })}
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                            website.theme.background === 'dark' 
                              ? 'border-indigo-600 bg-slate-800 text-white' 
                              : 'border-slate-200 bg-slate-100 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <Moon className="w-4 h-4" />
                          <span className="font-medium text-sm">Dark Mode</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-3">Brand Colors</label>
                      <div className="grid grid-cols-1 gap-4">
                        <ColorPicker 
                          label="Primary Brand Color" 
                          value={website.theme.primary} 
                          onChange={(v) => website && setTheme({ ...website.theme, primary: v })} 
                        />
                        <ColorPicker 
                          label="Secondary / Accent" 
                          value={website.theme.secondary} 
                          onChange={(v) => website && setTheme({ ...website.theme, secondary: v })} 
                        />
                        <ColorPicker 
                          label="Action Button" 
                          value={website.theme.button} 
                          onChange={(v) => website && setTheme({ ...website.theme, button: v })} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integrations */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-indigo-500" />
                    Integrations
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">Facebook Messenger</p>
                          <p className="text-xs text-slate-500">Add live chat to your site</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={website.messenger.enabled}
                          onChange={(e) => setWebsite(prev => prev ? ({ ...prev, messenger: { ...prev.messenger, enabled: e.target.checked } }) : prev)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    {website.messenger.enabled && (
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                        <input
                          type="text"
                          placeholder="Page ID"
                          value={website.messenger.pageId}
                          onChange={(e) => setWebsite(prev => prev ? ({ ...prev, messenger: { ...prev.messenger, pageId: e.target.value } }) : prev)}
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Welcome Message"
                          value={website.messenger.welcomeMessage}
                          onChange={(e) => setWebsite(prev => prev ? ({ ...prev, messenger: { ...prev.messenger, welcomeMessage: e.target.value } }) : prev)}
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CONTENT */}
          {activeTab === 'content' && (
            <div className="space-y-10">
              
              {/* AI Generator */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-indigo-900">AI Content Wizard</h4>
                    <p className="text-sm text-indigo-700 mb-4">
                      Enter your business name and type, and we will generate the full website content including products, benefits, and testimonials for you.
                    </p>
                    <div className="flex gap-3 flex-wrap md:flex-nowrap">
                      <input 
                        type="text" 
                        placeholder="Business Name" 
                        className="flex-1 px-4 py-2 border border-indigo-200 rounded-lg outline-none"
                        value={aiPrompt.name}
                        onChange={(e) => setAiPrompt({...aiPrompt, name: e.target.value})}
                      />
                       <input 
                        type="text" 
                        placeholder="Business Type (e.g. 'Yoga Studio', 'Vegan Cafe')" 
                        className="flex-1 px-4 py-2 border border-indigo-200 rounded-lg outline-none"
                        value={aiPrompt.type}
                        onChange={(e) => setAiPrompt({...aiPrompt, type: e.target.value})}
                      />
                      <button 
                        onClick={handleAiGenerate}
                        disabled={isGenerating || !aiPrompt.name || !aiPrompt.type}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections List */}
              
              {/* Hero */}
              {website.enabledSections.hero && (
                <section>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-slate-500" /> Hero Section
                  </h3>
                  <div className="grid gap-4">
                    <input
                      type="text"
                      placeholder="Headline"
                      value={website.content.hero.title}
                      onChange={(e) => website && updateContent('hero', { ...website.content.hero, title: e.target.value })}
                      className="w-full px-4 py-3 text-lg font-bold border border-slate-300 rounded-lg"
                    />
                    <textarea
                      placeholder="Subtext"
                      value={website.content.hero.subtext}
                      onChange={(e) => website && updateContent('hero', { ...website.content.hero, subtext: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Banner Image URL"
                        value={website.content.hero.image}
                        onChange={(e) => website && updateContent('hero', { ...website.content.hero, image: e.target.value })}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-500"
                      />
                       <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={heroImageInputRef}
                        onChange={(e) => handleFileUpload(e, (base64) => website && updateContent('hero', { ...website.content.hero, image: base64 }))}
                      />
                      <button 
                        onClick={() => heroImageInputRef.current?.click()}
                        className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600"
                        title="Upload Image"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* About */}
              {website.enabledSections.about && (
                <section>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">About Section</h3>
                  <textarea
                    placeholder="Tell us about your business..."
                    value={website.content.about}
                    onChange={(e) => updateContent('about', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg h-32"
                  />
                </section>
              )}

              {/* Products */}
              {website.enabledSections.products && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Products / Services</h3>
                    <button 
                      onClick={() => addItem<Product>('products', { name: 'New Product', description: 'Desc', image: 'https://placehold.co/400x300?text=Product', price: '₱0.00' })}
                      className="text-sm flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Add Item
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {website.content.products.map((p) => (
                      <div key={p.id} className="border border-slate-200 p-4 rounded-lg relative bg-slate-50 group">
                        <button onClick={() => removeItem('products', p.id)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash className="w-4 h-4" />
                        </button>
                        <div className="flex gap-2 mb-2">
                           <input
                            type="text"
                            value={p.name}
                            placeholder="Product Name"
                            onChange={(e) => updateItem<Product>('products', p.id, 'name', e.target.value)}
                            className="flex-1 bg-transparent font-bold border-b border-transparent focus:border-indigo-400 outline-none"
                          />
                          <input
                            type="text"
                            value={p.price}
                            placeholder="Price"
                            onChange={(e) => updateItem<Product>('products', p.id, 'price', e.target.value)}
                            className="w-20 bg-transparent text-right font-medium text-slate-700 border-b border-transparent focus:border-indigo-400 outline-none"
                          />
                        </div>
                        <textarea
                          value={p.description}
                          onChange={(e) => updateItem<Product>('products', p.id, 'description', e.target.value)}
                          className="w-full bg-transparent text-sm text-slate-600 border-transparent focus:border-indigo-400 rounded outline-none h-16 resize-none"
                        />
                         <div className="flex gap-2 mt-2">
                           <input
                            type="text"
                            value={p.image}
                            onChange={(e) => updateItem<Product>('products', p.id, 'image', e.target.value)}
                            className="flex-1 text-xs text-slate-400 bg-white border border-slate-200 rounded px-2 py-1"
                            placeholder="Image URL"
                          />
                           <label className="cursor-pointer px-2 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 flex items-center justify-center">
                             <Upload className="w-3 h-3 text-slate-500" />
                             <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleFileUpload(e, (base64) => updateItem<Product>('products', p.id, 'image', base64))}
                             />
                           </label>
                         </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Benefits */}
              {website.enabledSections.benefits && (
                <section>
                   <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       <Heart className="w-5 h-5 text-slate-500" /> Key Benefits
                    </h3>
                    <button 
                      onClick={() => addItem<Benefit>('benefits', { title: 'New Benefit', description: 'Explanation', icon: 'Star' })}
                      className="text-sm flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Add Item
                    </button>
                  </div>
                  <div className="space-y-3">
                     {website.content.benefits.map((b) => (
                       <div key={b.id} className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50 group">
                          <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-slate-200">
                             <Star className="w-5 h-5 text-slate-400" />
                          </div>
                          <div className="flex-1">
                             <input
                              type="text"
                              value={b.title}
                              onChange={(e) => updateItem<Benefit>('benefits', b.id, 'title', e.target.value)}
                              className="w-full bg-transparent font-bold border-b border-transparent focus:border-indigo-400 outline-none"
                            />
                            <input
                              type="text"
                              value={b.description}
                              onChange={(e) => updateItem<Benefit>('benefits', b.id, 'description', e.target.value)}
                              className="w-full bg-transparent text-sm text-slate-600 border-transparent focus:border-indigo-400 outline-none mt-1"
                            />
                          </div>
                          <button onClick={() => removeItem('benefits', b.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash className="w-4 h-4" />
                          </button>
                       </div>
                     ))}
                  </div>
                </section>
              )}

              {/* Testimonials */}
              {website.enabledSections.testimonials && (
                <section>
                   <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       <User className="w-5 h-5 text-slate-500" /> Testimonials
                    </h3>
                    <button 
                      onClick={() => addItem<Testimonial>('testimonials', { name: 'Customer Name', role: 'Client', content: 'Great service!', avatar: 'https://placehold.co/150x150?text=User' })}
                      className="text-sm flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Add Item
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {website.content.testimonials.map((t) => (
                       <div key={t.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                          <button onClick={() => removeItem('testimonials', t.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash className="w-4 h-4" />
                          </button>
                          <textarea
                              value={t.content}
                              onChange={(e) => updateItem<Testimonial>('testimonials', t.id, 'content', e.target.value)}
                              className="w-full bg-transparent text-sm italic text-slate-600 border-transparent focus:border-indigo-400 outline-none resize-none mb-2"
                              placeholder="Quote"
                            />
                          <div className="flex gap-2">
                             <div className="relative w-10 h-10">
                               <img src={t.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200" onError={(e) => e.currentTarget.src = 'https://placehold.co/150x150?text=User'} />
                               <label className="absolute -bottom-1 -right-1 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-slate-50">
                                 <Upload className="w-2.5 h-2.5 text-slate-600" />
                                 <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => handleFileUpload(e, (base64) => updateItem<Testimonial>('testimonials', t.id, 'avatar', base64))}
                                 />
                               </label>
                             </div>
                             <div className="flex-1">
                                <input
                                  type="text"
                                  value={t.name}
                                  onChange={(e) => updateItem<Testimonial>('testimonials', t.id, 'name', e.target.value)}
                                  className="w-full bg-transparent font-bold text-sm border-b border-transparent focus:border-indigo-400 outline-none"
                                  placeholder="Name"
                                />
                                <input
                                  type="text"
                                  value={t.role}
                                  onChange={(e) => updateItem<Testimonial>('testimonials', t.id, 'role', e.target.value)}
                                  className="w-full bg-transparent text-xs text-slate-500 border-b border-transparent focus:border-indigo-400 outline-none"
                                  placeholder="Role"
                                />
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
                </section>
              )}

              {/* FAQ */}
              {website.enabledSections.faq && (
                <section>
                   <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       <HelpCircle className="w-5 h-5 text-slate-500" /> FAQ
                    </h3>
                    <button 
                      onClick={() => addItem<FAQ>('faq', { question: 'Question?', answer: 'Answer.' })}
                      className="text-sm flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Add Item
                    </button>
                  </div>
                  <div className="space-y-3">
                     {website.content.faq.map((f) => (
                       <div key={f.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 group">
                          <div className="flex justify-between items-start">
                             <input
                              type="text"
                              value={f.question}
                              onChange={(e) => updateItem<FAQ>('faq', f.id, 'question', e.target.value)}
                              className="w-full bg-transparent font-semibold border-b border-transparent focus:border-indigo-400 outline-none mb-1"
                              placeholder="Question"
                            />
                             <button onClick={() => removeItem('faq', f.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                <Trash className="w-4 h-4" />
                              </button>
                          </div>
                          <textarea
                              value={f.answer}
                              onChange={(e) => updateItem<FAQ>('faq', f.id, 'answer', e.target.value)}
                              className="w-full bg-transparent text-sm text-slate-600 border-transparent focus:border-indigo-400 outline-none resize-none"
                              placeholder="Answer"
                            />
                       </div>
                     ))}
                  </div>
                </section>
              )}

              {/* Contact */}
              {website.enabledSections.contact && (
                 <section>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={website.content.contact.phone}
                      onChange={(e) => website && updateContent('contact', { ...website.content.contact, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={website.content.contact.email}
                      onChange={(e) => website && updateContent('contact', { ...website.content.contact, email: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={website.content.contact.address}
                      onChange={(e) => website && updateContent('contact', { ...website.content.contact, address: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </section>
              )}

              {/* Footer Configuration */}
              <section>
                <div className="mb-6">
                   <h3 className="text-lg font-bold text-slate-800">Footer Configuration</h3>
                   <p className="text-slate-500 text-sm">Customize your website footer</p>
                </div>
                
                <div className="mb-6">
                   <label className="block text-sm font-medium text-slate-700 mb-1">Footer Text</label>
                   <textarea
                    placeholder="© 2024 All rights reserved."
                    value={website.content.footerText}
                    onChange={(e) => updateContent('footerText', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none"
                  />
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-3">Social Media Links</label>
                   <div className="space-y-4">
                      {website.content.socialLinks.map((link) => (
                         <div key={link.platform} className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center text-slate-500 bg-slate-50 rounded border border-slate-200">
                               {getSocialIcon(link.platform)}
                            </div>
                            <input 
                              type="text"
                              value={link.url}
                              onChange={(e) => updateSocialLink(link.platform, 'url', e.target.value)}
                              placeholder={`https://${link.platform}.com/yourpage`}
                              className={`flex-1 px-4 py-2 border rounded-lg outline-none ${!link.enabled ? 'bg-slate-50 text-slate-400' : 'bg-white border-slate-300 focus:border-indigo-500'}`}
                              disabled={!link.enabled}
                            />
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={link.enabled}
                                onChange={(e) => updateSocialLink(link.platform, 'enabled', e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                         </div>
                      ))}
                   </div>
                </div>
              </section>

            </div>
          )}

          {/* TAB: MARKETING */}
          {activeTab === 'marketing' && (
            <div className="space-y-8">
              {/* Marketing Generator Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                   <h3 className="text-lg font-bold text-blue-900 mb-1">AI Marketing Kit</h3>
                   <p className="text-sm text-blue-700">Generate SEO metadata and social media posts based on your website content.</p>
                </div>
                <button
                  onClick={handleMarketingGenerate}
                  disabled={isGeneratingMarketing}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-sm font-medium"
                >
                  {isGeneratingMarketing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate Kit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SEO Card */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-indigo-600" />
                    SEO Settings
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                      <input
                        type="text"
                        placeholder="Page title | Brand"
                        value={website.marketing.seo.metaTitle}
                        onChange={(e) => setWebsite({ 
                          ...website, 
                          marketing: { ...website.marketing, seo: { ...website.marketing.seo, metaTitle: e.target.value } } 
                        })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <p className="text-xs text-slate-500 mt-1 flex justify-between">
                         <span>Recommended: 50-60 characters</span>
                         <span className={website.marketing.seo.metaTitle.length > 60 ? 'text-red-500' : 'text-slate-400'}>
                           {website.marketing.seo.metaTitle.length} chars
                         </span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                      <textarea
                        placeholder="A brief summary of your page content..."
                        value={website.marketing.seo.metaDescription}
                        onChange={(e) => setWebsite({ 
                          ...website, 
                          marketing: { ...website.marketing, seo: { ...website.marketing.seo, metaDescription: e.target.value } } 
                        })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <p className="text-xs text-slate-500 mt-1 flex justify-between">
                         <span>Recommended: 150-160 characters</span>
                         <span className={website.marketing.seo.metaDescription.length > 160 ? 'text-red-500' : 'text-slate-400'}>
                           {website.marketing.seo.metaDescription.length} chars
                         </span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Keywords</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {website.marketing.seo.keywords.map((kw, idx) => (
                           <span key={idx} className="bg-white border border-slate-300 px-2 py-1 rounded text-sm text-slate-700 flex items-center gap-1">
                              {kw}
                              <button 
                                onClick={() => {
                                   const newKw = [...website.marketing.seo.keywords];
                                   newKw.splice(idx, 1);
                                   setWebsite({ 
                                      ...website, 
                                      marketing: { ...website.marketing, seo: { ...website.marketing.seo, keywords: newKw } } 
                                    });
                                }}
                                className="text-slate-400 hover:text-red-500"
                              >
                                 &times;
                              </button>
                           </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add keyword and press Enter"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                             e.preventDefault();
                             const val = e.currentTarget.value.trim();
                             if (val && !website.marketing.seo.keywords.includes(val)) {
                                setWebsite({ 
                                  ...website, 
                                  marketing: { ...website.marketing, seo: { ...website.marketing.seo, keywords: [...website.marketing.seo.keywords, val] } } 
                                });
                                e.currentTarget.value = '';
                             }
                          }
                        }}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media Card */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-indigo-600" />
                    Social Media Launch Post
                  </h3>
                  
                  <div className="flex-1">
                    <div className="relative h-full">
                       <textarea
                        value={website.marketing.socialPost}
                        onChange={(e) => setWebsite({ 
                           ...website, 
                           marketing: { ...website.marketing, socialPost: e.target.value } 
                        })}
                        placeholder="Generate a post to announce your new website..."
                        className="w-full h-full min-h-[300px] p-4 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button 
                        onClick={() => copyToClipboard(website.marketing.socialPost)}
                        className="absolute top-4 right-4 p-2 bg-white border border-slate-200 rounded hover:bg-slate-100 shadow-sm transition-colors"
                        title="Copy to Clipboard"
                      >
                         {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};
