import { useState } from 'react';
import { Save, Eye, Undo, Redo, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { HeroSection } from './sections/HeroSection.jsx';
import { ImageTextSection } from './sections/ImageTextSection.jsx';
import { ProductGridSection } from './sections/ProductGridSection.jsx';
import { TestimonialsSection } from './sections/TestimonialsSection.jsx';
import { NewsletterSection } from './sections/NewsletterSection.jsx';
import { VideoSection } from './sections/VideoSection.jsx';
import { TextSection } from './sections/TextSection.jsx';

import api from '../../services/api.js';

/**
 * Website Builder Component - Shopify-style drag-and-drop page editor
 */
export function WebsiteBuilder({ storeId, storefrontId, onSave, initialSections = [] }) {
  const [sections, setSections] = useState(initialSections);
  const [selectedSection, setSelectedSection] = useState(null);
  const [history, setHistory] = useState([initialSections]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);


  const availableSections = [
    { id: 'hero', name: 'Hero Banner', icon: '🎯', component: HeroSection },
    { id: 'image-text', name: 'Image with Text', icon: '🖼️', component: ImageTextSection },
    { id: 'product-grid', name: 'Product Grid', icon: '📦', component: ProductGridSection },
    { id: 'testimonials', name: 'Testimonials', icon: '💬', component: TestimonialsSection },
    { id: 'newsletter', name: 'Newsletter', icon: '📧', component: NewsletterSection },
    { id: 'video', name: 'Video', icon: '🎥', component: VideoSection },
    { id: 'text', name: 'Text Block', icon: '📝', component: TextSection },
  ];

  const addSection = (sectionType) => {
    const section = {
      id: `section-${Date.now()}`,
      type: sectionType,
      settings: getDefaultSettings(sectionType),
    };
    const newSections = [...sections, section];
    setSections(newSections);
    addToHistory(newSections);
  };

  const getDefaultSettings = (type) => {
    const defaults = {
      hero: {
        title: 'Welcome to Our Store',
        subtitle: 'Discover amazing products',
        backgroundImage: '',
        buttonText: 'Shop Now',
        buttonLink: '/products',
      },
      'image-text': {
        image: '',
        text: 'Add your text here',
        alignment: 'left',
        buttonText: 'Learn More',
        buttonLink: '#',
      },
      'product-grid': {
        title: 'Featured Products',
        collection: null,
        limit: 8,
        columns: 4,
      },
      testimonials: {
        title: 'What Our Customers Say',
        testimonials: [],
      },
      newsletter: {
        title: 'Subscribe to Our Newsletter',
        subtitle: 'Get the latest updates and offers',
        placeholder: 'Enter your email',
      },
      video: {
        videoUrl: '',
        title: '',
        autoplay: false,
        loop: false,
      },
      text: {
        content: 'Add your text content here',
        alignment: 'center',
      },
    };
    return defaults[type] || {};
  };

  const updateSection = (sectionId, settings) => {
    const newSections = sections.map(section =>
      section.id === sectionId ? { ...section, settings: { ...section.settings, ...settings } } : section
    );
    setSections(newSections);
    addToHistory(newSections);
  };

  const deleteSection = (sectionId) => {
    const newSections = sections.filter(section => section.id !== sectionId);
    setSections(newSections);
    addToHistory(newSections);
    if (selectedSection === sectionId) {
      setSelectedSection(null);
    }
  };

  const moveSection = (sectionId, direction) => {
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    
    const newSections = [...sections];
    [newSections[currentIndex], newSections[newIndex]] = [newSections[newIndex], newSections[currentIndex]];
    setSections(newSections);
    addToHistory(newSections);
  };

  const addToHistory = (newSections) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newSections);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setSections(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setSections(history[newIndex]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    
    try {
      if (storefrontId) {
        // Save sections to storefront via API
        const response = await api.storefronts.saveWebsiteSections(storefrontId, sections);
        if (response.success) {
          setSaveMessage({ type: 'success', text: 'Website sections saved successfully!' });
          // Also update the storefront design object
          await api.storefronts.updateStorefront(storefrontId, {
            'design.sections': sections,
          });
        } else {
          setSaveMessage({ type: 'error', text: response.message || 'Failed to save sections' });
        }
      } else if (onSave) {
        // Fallback to callback if no storefrontId
        await onSave(sections);
        setSaveMessage({ type: 'success', text: 'Website sections saved!' });
      } else {
        setSaveMessage({ type: 'error', text: 'No storefront ID provided' });
      }
    } catch (error) {
      console.error('Error saving website sections:', error);
      setSaveMessage({ type: 'error', text: error.message || 'Failed to save sections' });
    } finally {
      setSaving(false);
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const renderSection = (section) => {
    const sectionConfig = availableSections.find(s => s.id === section.type);
    if (!sectionConfig) return null;

    const SectionComponent = sectionConfig.component;
    return (
      <SectionComponent
        key={section.id}
        settings={section.settings}
        isSelected={selectedSection === section.id}
        onSelect={() => setSelectedSection(section.id)}
        onUpdate={(settings) => updateSection(section.id, settings)}
        onDelete={() => deleteSection(section.id)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-midnight">
      {/* Toolbar */}
      <div className="border-b border-white/10 bg-ocean/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white font-display">Website Builder</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={historyIndex === 0}
              className="p-2 rounded-2xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white/60 hover:text-white"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="p-2 rounded-2xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white/60 hover:text-white"
            >
              <Redo className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <div className={`px-4 py-2 rounded-2xl text-sm ${
              saveMessage.type === 'success' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {saveMessage.text}
            </div>
          )}
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white"
          >
            <Eye className="w-5 h-5" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-2xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Section Library */}
        {!previewMode && (
          <div className="w-64 rounded-[32px] border-r border-white/10 bg-ocean/75 backdrop-blur-xl p-4">
            <h2 className="font-semibold text-white mb-4 font-display">Add Section</h2>
            <div className="space-y-2">
              {availableSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => addSection(section.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left border border-white/10 rounded-2xl hover:bg-white/10 hover:border-brand-400/50 transition text-white/80 hover:text-white"
                >
                  <span className="text-2xl">{section.icon}</span>
                  <span className="text-sm font-medium">{section.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1">
          {previewMode ? (
            <div className="p-8 bg-white">
              {sections.map(renderSection)}
            </div>
          ) : (
            <div className="p-8 space-y-4">
              {sections.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-white/60 mb-4">No sections yet. Add a section to get started!</p>
                </div>
              ) : (
                sections.map((section, index) => (
                  <SectionWrapper
                    key={section.id}
                    section={section}
                    index={index}
                    totalSections={sections.length}
                    isSelected={selectedSection === section.id}
                    onSelect={() => setSelectedSection(section.id)}
                    onDelete={() => deleteSection(section.id)}
                    onMoveUp={() => moveSection(section.id, 'up')}
                    onMoveDown={() => moveSection(section.id, 'down')}
                  >
                    {renderSection(section)}
                  </SectionWrapper>
                ))
              )}
            </div>
          )}
        </div>

        {/* Settings Panel */}
        {!previewMode && selectedSection && (
          <div className="w-80 rounded-[32px] border-l border-white/10 bg-ocean/75 backdrop-blur-xl p-6 overflow-y-auto">
            <SectionSettings
              section={sections.find(s => s.id === selectedSection)}
              onUpdate={(settings) => updateSection(selectedSection, settings)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Section Wrapper
function SectionWrapper({ section, index, totalSections, isSelected, onSelect, onDelete, onMoveUp, onMoveDown, children }) {
  return (
    <div className={`relative group ${isSelected ? 'ring-2 ring-brand-400' : ''}`}>
      <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-2 bg-ocean/95 rounded-2xl shadow-lg hover:bg-ocean border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Move up"
        >
          <ChevronUp className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === totalSections - 1}
          className="p-2 bg-ocean/95 rounded-2xl shadow-lg hover:bg-ocean border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Move down"
        >
          <ChevronDown className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={onSelect}
          className="p-2 bg-ocean/95 rounded-2xl shadow-lg hover:bg-ocean border border-white/10"
          title="Edit"
        >
          <span className="text-white">✏️</span>
        </button>
        <button
          onClick={onDelete}
          className="p-2 bg-ocean/95 rounded-2xl shadow-lg hover:bg-rose-500/20 border border-white/10"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-rose-400" />
        </button>
      </div>
      {children}
    </div>
  );
}

// Section Settings Panel
function SectionSettings({ section, onUpdate }) {
  if (!section) return null;

  const handleChange = (key, value) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-white font-display">Section Settings</h3>
      <div className="space-y-4">
        {Object.entries(section.settings).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-white/80 mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            {typeof value === 'boolean' ? (
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleChange(key, e.target.checked)}
                className="w-5 h-5 text-brand-400 rounded border-white/20 bg-white/5"
              />
            ) : typeof value === 'number' ? (
              <input
                type="number"
                value={value}
                onChange={(e) => handleChange(key, parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-white/10 bg-white/5 rounded-2xl text-white"
              />
            ) : (
              <input
                type="text"
                value={value || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-3 py-2 border border-white/10 bg-white/5 rounded-2xl text-white placeholder-white/40"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

