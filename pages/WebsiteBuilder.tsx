import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ColorPicker } from '../components/ColorPicker';
import { Website, Product, Benefit, Testimonial, FAQ, SocialLink, GalleryItem, TeamMember, PricingPlan, CallToAction } from '../types';
import { saveWebsite, getWebsiteById, uploadImage } from '../services/supabaseService';
import { generateWebsiteContent, generateTheme, generateMarketingContent } from '../services/geminiService';
import { Save, ArrowLeft, Plus, Trash, Sparkles, Image as ImageIcon, Loader2, Lock, ExternalLink, Palette, Sun, Moon, MessageCircle, Layers, Star, HelpCircle, Heart, User, Facebook, Instagram, Twitter, Linkedin, Youtube, Link as LinkIcon, Megaphone, Copy, Check, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWebsite } from '../hooks/useWebsite';
import { DEFAULT_WEBSITE } from '../constants/websiteDefaults';
import { WebsiteBuilderHeader } from '../components/website-builder/WebsiteBuilderHeader';
import { WebsiteBuilderTabs } from '../components/website-builder/WebsiteBuilderTabs';
import { GeneralSettings } from '../components/website-builder/GeneralSettings';
import { SectionVisibility } from '../components/website-builder/SectionVisibility';
import { VisualStyle } from '../components/website-builder/VisualStyle';
import { Integrations } from '../components/website-builder/Integrations';
import { AiContentWizard } from '../components/website-builder/AiContentWizard';
import { HeroContent } from '../components/website-builder/HeroContent';
import { AboutContent } from '../components/website-builder/AboutContent';
import { ProductList } from '../components/website-builder/ProductList';
import { BenefitList } from '../components/website-builder/BenefitList';
import { TestimonialList } from '../components/website-builder/TestimonialList';
import { FaqList } from '../components/website-builder/FaqList';
import { GalleryList } from '../components/website-builder/GalleryList';
import { TeamList } from '../components/website-builder/TeamList';
import { PricingList } from '../components/website-builder/PricingList';
import { CallToActionEditor } from '../components/website-builder/CallToActionEditor';
import { ContactDetails } from '../components/website-builder/ContactDetails';
import { FooterConfig } from '../components/website-builder/FooterConfig';
import { AiMarketingKit } from '../components/website-builder/AiMarketingKit';
import { NavLinkReorder } from '../components/website-builder/NavLinkReorder'; // Import NavLinkReorder

export enum WebsiteType {
  Custom = 'Custom',
  Portfolio = 'Portfolio',
  Ecommerce = 'E-commerce/Store',
  LandingPage = 'Landing Page',
}

const WEBSITE_PRESETS: Record<WebsiteType, Partial<Website['enabledSections']>> = {
  [WebsiteType.Custom]: {},
  [WebsiteType.Portfolio]: {
    hero: true,
    gallery: true,
    about: true,
    contact: true,
    products: false,
    pricing: false,
    benefits: false,
    testimonials: false,
    faq: false,
    team: false,
    callToAction: false,
  },
  [WebsiteType.Ecommerce]: {
    hero: true,
    products: true,
    pricing: true,
    faq: true,
    gallery: false,
    about: false,
    benefits: false,
    testimonials: false,
    team: false,
    callToAction: false,
    contact: true,
  },
  [WebsiteType.LandingPage]: {
    hero: true,
    benefits: true,
    testimonials: true,
    callToAction: true,
    products: false,
    pricing: false,
    gallery: false,
    team: false,
    about: false,
    faq: false,
    contact: true,
  },
};

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
  const [isUploadingImage, setIsUploadingImage] = useState(false); // New state for image uploads
  
  // AI Content State
  const [aiPrompt, setAiPrompt] = useState({ name: '', type: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Theme State
  const [themePrompt, setThemePrompt] = useState('');
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);

  // AI Marketing State
  const [isGeneratingMarketing, setIsGeneratingMarketing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [websiteType, setWebsiteType] = useState<WebsiteType>(WebsiteType.Custom);

  // File Input Refs
  // const heroImageInputRef = useRef<HTMLInputElement>(null);

  const uploadAiImage = async (imageUrl: string, fileNamePrefix: string) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const file = new File([blob], `${fileNamePrefix}_${Date.now()}.png`, { type: blob.type });
      const publicUrl = await uploadImage(file);
      return publicUrl;
    } catch (error) {
      console.error(`Failed to upload AI-generated image (${fileNamePrefix}):`, error);
      return null; // Return null to indicate failure
    }
  };

  const handleFileUpload = (file: File, callback: (url: string) => void) => {
    if (file) {
      setIsUploadingImage(true); // Set loading state
      uploadImage(file)
        .then((url) => callback(url))
        .catch((error) => {
          console.error("Image upload failed:", error);
          // Optionally show a toast notification for upload failure
        })
        .finally(() => {
          setIsUploadingImage(false); // Unset loading state
        });
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
          // Handle legacy about data (string) vs new structure (object)
          let aboutData = existing.content.about;
          if (typeof aboutData === 'string') {
            aboutData = {
              image: DEFAULT_WEBSITE.content.about.image,
              subtitle: DEFAULT_WEBSITE.content.about.subtitle,
              title: 'About Us',
              paragraphs: aboutData ? [aboutData] : DEFAULT_WEBSITE.content.about.paragraphs,
            };
          }

          // Handle legacy footerText (string) vs new structure (object)
          let footerData = (existing.content as any).footer;
          if (!footerData && (existing.content as any).footerText) {
            footerData = {
              tagline: DEFAULT_WEBSITE.content.footer.tagline,
              exploreLinks: DEFAULT_WEBSITE.content.footer.exploreLinks,
              hours: DEFAULT_WEBSITE.content.footer.hours,
              copyright: (existing.content as any).footerText || DEFAULT_WEBSITE.content.footer.copyright,
            };
          }

          merged.content = { 
            ...DEFAULT_WEBSITE.content, 
            ...existing.content,
            about: aboutData || DEFAULT_WEBSITE.content.about,
            footer: footerData || DEFAULT_WEBSITE.content.footer,
            products: existing.content.products.map(p => ({...p, price: p.price || ''})),
            benefits: existing.content.benefits || [],
            testimonials: existing.content.testimonials || [],
            faq: existing.content.faq || [],
            gallery: existing.content.gallery || [],
            team: existing.content.team || [],
            pricing: existing.content.pricing || [],
            callToAction: existing.content.callToAction || DEFAULT_WEBSITE.content.callToAction,
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

  const handleViewSite = () => {
    if (!website) return;

    let targetUrl = '';
    if (website.status === 'published' && website.subdomain) {
      targetUrl = `https://${website.subdomain}.likhasiteworks.dev`;
    } else {
      // For drafts or sites without a subdomain, use the regular preview route
      targetUrl = `${window.location.origin}/preview/${website.id}`;
    }
    window.open(targetUrl, '_blank');
  };

  // --- Helper functions for list management ---

  // addItem provided by useWebsite

  // removeItem provided by useWebsite

  // updateItem provided by useWebsite

  // file upload handled by wrapper above using fileToBase64

  // -------------------------------------------

  const handleAiGenerate = async () => {
    if (!aiPrompt.name || !aiPrompt.type || !website) {
      return;
    }
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
          // Using placehold.co directly as AI image generation is currently unreliable
          const encodedPrompt = encodeURIComponent(prompt);
          return `https://placehold.co/${width}x${height}?text=${encodedPrompt}`;
        };

        // Asynchronously upload images and update the website object
        const processImages = async () => {
          const newWebsite = { ...prev };

          // Process Hero Image
          if (result.heroImagePrompt) {
            const heroImageUrl = generateImageUrl(result.heroImagePrompt, 1200, 600);
            const uploadedHeroUrl = await uploadAiImage(heroImageUrl, 'hero');
            if (uploadedHeroUrl) {
              newWebsite.content.hero.image = uploadedHeroUrl;
            } else {
              newWebsite.content.hero.image = `https://placehold.co/1200x600?text=Hero+Image`;
            }
          } else {
            newWebsite.content.hero.image = `https://placehold.co/1200x600?text=Hero+Image`;
          }

          // Process Product Images
          if (result.products && result.products.length > 0) {
            newWebsite.content.products = await Promise.all(result.products.map(async (p, i) => {
              const productImageUrl = p.imagePrompt
                ? generateImageUrl(p.imagePrompt, 800, 600)
                : `https://placehold.co/800x600?text=${encodeURIComponent(p.name)}`;
              const uploadedProductUrl = await uploadAiImage(productImageUrl, `product_${i}`);
              return {
                id: generateId(),
                name: p.name,
                description: p.description,
                price: p.price.includes('₱') ? p.price : `₱${p.price.replace('$', '')}`, // Ensure Peso sign
                image: uploadedProductUrl || `https://placehold.co/800x600?text=${encodeURIComponent(p.name)}`
              };
            }));
          } else {
            newWebsite.content.products = [];
          }

          // Process other content that doesn't involve images
          newWebsite.title = aiPrompt.name;
          newWebsite.content.hero.title = result.heroTitle;
          newWebsite.content.hero.subtext = result.heroSubtext;
          newWebsite.content.about = {
            image: generateImageUrl('about section image'),
            subtitle: 'OUR PHILOSOPHY',
            title: result.aboutText?.split('.')[0] || 'About Us',
            paragraphs: result.aboutText ? result.aboutText.split('.').filter(p => p.trim()).map(p => p.trim() + '.') : ['Tell your story here...']
          };
          newWebsite.content.benefits = result.benefits?.map((b) => ({
            id: generateId(),
            title: b.title,
            description: b.description,
            icon: b.icon || 'Star'
          })) || [];
          newWebsite.content.testimonials = result.testimonials?.map((t, i) => ({
            id: generateId(),
            name: t.name,
            role: t.role,
            content: t.content,
            avatar: `https://placehold.co/150x150?text=${t.name.charAt(0)}`
          })) || [];
          newWebsite.content.faq = result.faq?.map((f) => ({
            id: generateId(),
            question: f.question,
            answer: f.answer
          })) || [];
          newWebsite.enabledSections = {
            ...prev.enabledSections,
            products: (result.products?.length ?? 0) > 0,
            benefits: (result.benefits?.length ?? 0) > 0,
            testimonials: (result.testimonials?.length ?? 0) > 0,
            faq: (result.faq?.length ?? 0) > 0,
            gallery: (result.gallery?.length ?? 0) > 0,
            team: (result.team?.length ?? 0) > 0,
            pricing: (result.pricing?.length ?? 0) > 0,
            callToAction: !!(result.callToAction?.text && result.callToAction?.buttonText && result.callToAction?.buttonLink),
          };

          // Process Gallery Images
          if (result.gallery && result.gallery.length > 0) {
            newWebsite.content.gallery = await Promise.all(result.gallery.map(async (item, i) => {
              const galleryImageUrl = item.imagePrompt
                ? generateImageUrl(item.imagePrompt, 800, 600)
                : `https://placehold.co/800x600?text=${encodeURIComponent(item.caption || `Gallery ${i + 1}`)}`;
              const uploadedGalleryUrl = await uploadAiImage(galleryImageUrl, `gallery_${i}`);
              return {
                id: generateId(),
                image: uploadedGalleryUrl || `https://placehold.co/800x600?text=${encodeURIComponent(item.caption || `Gallery ${i + 1}`)}`,
                caption: item.caption
              };
            }));
          } else {
            newWebsite.content.gallery = [];
          }

          // Process Team Images
          if (result.team && result.team.length > 0) {
            newWebsite.content.team = await Promise.all(result.team.map(async (member, i) => {
              const teamImageUrl = member.imagePrompt
                ? generateImageUrl(member.imagePrompt, 150, 150)
                : `https://placehold.co/150x150?text=${encodeURIComponent(member.name.charAt(0))}`;
              const uploadedTeamUrl = await uploadAiImage(teamImageUrl, `team_${i}`);
              return {
                id: generateId(),
                name: member.name,
                role: member.role,
                image: uploadedTeamUrl || `https://placehold.co/150x150?text=${encodeURIComponent(member.name.charAt(0))}`
              };
            }));
          } else {
            newWebsite.content.team = [];
          }

          // Process Pricing Plans
          if (result.pricing && result.pricing.length > 0) {
            newWebsite.content.pricing = result.pricing.map((plan) => ({
              id: generateId(),
              name: plan.name,
              price: plan.price.includes('₱') ? plan.price : `₱${plan.price.replace('$', '')}`,
              features: plan.features || [],
              buttonText: plan.buttonText || 'Learn More',
              buttonLink: plan.buttonLink || '#'
            }));
          } else {
            newWebsite.content.pricing = [];
          }

          // Process Call to Action
          if (result.callToAction) {
            newWebsite.content.callToAction = {
              ...DEFAULT_WEBSITE.content.callToAction,
              text: result.callToAction.text || DEFAULT_WEBSITE.content.callToAction.text,
              buttonText: result.callToAction.buttonText || DEFAULT_WEBSITE.content.callToAction.buttonText,
              buttonLink: result.callToAction.buttonLink || DEFAULT_WEBSITE.content.callToAction.buttonLink,
            };
          } else {
            newWebsite.content.callToAction = DEFAULT_WEBSITE.content.callToAction;
          }

          setWebsite(newWebsite);
        };

        processImages(); // Call the async function
        return prev; // Return previous state immediately as setWebsite will be called inside processImages
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

  const handlePresetChange = (type: WebsiteType) => {
    setWebsiteType(type);
    if (type === WebsiteType.Custom) {
      return; // Do nothing for custom, user manages manually
    }
    setWebsite(prev => {
      if (!prev) return null;
      const presetSections = WEBSITE_PRESETS[type];
      return {
        ...prev,
        enabledSections: { ...prev.enabledSections, ...presetSections },
      };
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <WebsiteBuilderHeader
          website={website}
          isNew={isNew}
          isSaving={isSaving}
          handleSave={handleSave}
          handleViewSite={handleViewSite}
        />
        <WebsiteBuilderTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[500px]">
          
          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && user.role === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                {/* General Info */}
                <GeneralSettings website={website} setWebsite={setWebsite} />

                {/* Section Visibility */}
                <SectionVisibility 
                  website={website}
                  setWebsite={setWebsite}
                  websiteType={websiteType}
                  handlePresetChange={handlePresetChange}
                />
                <NavLinkReorder website={website} setWebsite={setWebsite} /> {/* Add NavLinkReorder */} 

              </div>

              {/* Right Column: Theme & Integrations */}
              <div className="space-y-8">
                {/* Visual Style */}
                <VisualStyle 
                  website={website}
                  setWebsite={setWebsite}
                  themePrompt={themePrompt}
                  setThemePrompt={setThemePrompt}
                  isGeneratingTheme={isGeneratingTheme}
                  handleThemeGenerate={handleThemeGenerate}
                  setTheme={setTheme}
                />

                {/* Integrations */}
                <Integrations website={website} setWebsite={setWebsite} />

              </div>
            </div>
          )}

          {/* TAB: CONTENT */}
          {activeTab === 'content' && (
            <div className="space-y-10">
              
              {/* AI Generator */}
              <AiContentWizard
                aiPrompt={aiPrompt}
                setAiPrompt={setAiPrompt}
                isGenerating={isGenerating}
                handleAiGenerate={handleAiGenerate}
              />

              {/* Sections List */}
              
              {/* Hero */}
              {website.enabledSections.hero && (
                <HeroContent
                  website={website}
                  updateContent={updateContent}
                  handleFileUpload={handleFileUpload}
                  isUploadingImage={isUploadingImage}
                />
              )}

              {/* About */}
              {website.enabledSections.about && (
                <AboutContent 
                  website={website} 
                  updateContent={updateContent}
                  handleFileUpload={handleFileUpload}
                  isUploadingImage={isUploadingImage}
                />
              )}

              {/* Products */}
              {website.enabledSections.products && (
                <ProductList
                  website={website}
                  addItem={addItem}
                  removeItem={removeItem}
                  updateItem={updateItem}
                  handleFileUpload={handleFileUpload}
                  isUploadingImage={isUploadingImage}
                />
              )}

              {/* Benefits */}
              {website.enabledSections.benefits && (
                <BenefitList
                  website={website}
                  addItem={addItem}
                  removeItem={removeItem}
                  updateItem={updateItem}
                />
              )}

              {/* Testimonials */}
              {website.enabledSections.testimonials && (
                <TestimonialList
                  website={website}
                  addItem={addItem}
                  removeItem={removeItem}
                  updateItem={updateItem}
                  handleFileUpload={handleFileUpload}
                  isUploadingImage={isUploadingImage}
                />
              )}

              {/* FAQ */}
              {website.enabledSections.faq && (
                <FaqList
                  website={website}
                  addItem={addItem}
                  removeItem={removeItem}
                  updateItem={updateItem}
                />
              )}

              {/* Gallery */}
              {website.enabledSections.gallery && (
                <GalleryList
                  website={website}
                  addItem={addItem}
                  removeItem={removeItem}
                  updateItem={updateItem}
                  handleFileUpload={handleFileUpload}
                  isUploadingImage={isUploadingImage}
                />
              )}

              {/* Team */}
              {website.enabledSections.team && (
                <TeamList
                  website={website}
                  addItem={addItem}
                  removeItem={removeItem}
                  updateItem={updateItem}
                  handleFileUpload={handleFileUpload}
                  isUploadingImage={isUploadingImage}
                />
              )}

              {/* Pricing */}
              {website.enabledSections.pricing && (
                <PricingList
                  website={website}
                  addItem={addItem}
                  removeItem={removeItem}
                  updateItem={updateItem}
                />
              )}

              {/* Call to Action */}
              {website.enabledSections.callToAction && (
                <CallToActionEditor
                  website={website}
                  updateContent={updateContent}
                />
              )}

              {/* Contact */}
              {website.enabledSections.contact && (
                <ContactDetails
                  content={website.content.contact}
                  onContentChange={(newContent) => updateContent('contact', newContent)}
                  isDark={website.theme.background === 'dark'}
                  theme={website.theme}
                />
              )}

              {/* Footer Configuration */}
              <FooterConfig
                website={website}
                updateContent={updateContent}
                updateSocialLink={updateSocialLink}
              />
            </div>
          )}

          {/* TAB: MARKETING */}
          {activeTab === 'marketing' && (
            <AiMarketingKit
              website={website}
              setWebsite={setWebsite}
              isGeneratingMarketing={isGeneratingMarketing}
              handleMarketingGenerate={handleMarketingGenerate}
              copied={copied}
              copyToClipboard={copyToClipboard}
            />
          )}

        </div>
      </div>
    </Layout>
  );
};
