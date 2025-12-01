import React, { useState, useEffect } from 'react';
import { MessageCircle, Save, Loader2, Check, Bot, ExternalLink } from 'lucide-react';
import { supabase } from '../../services/supabaseService';

interface ChatSupportConfigProps {
  websiteId: string;
}

interface ChatConfig {
  is_enabled: boolean;
  greeting_message: string;
  knowledge_base: string;
  chatbot_config: string; // JSON string for editing
}

export const ChatSupportConfig: React.FC<ChatSupportConfigProps> = ({ websiteId }) => {
  const [config, setConfig] = useState<ChatConfig>({
    is_enabled: false,
    greeting_message: 'Hi! How can we help you today?',
    knowledge_base: '',
    chatbot_config: '{\n  "model": "gemini-2.0-flash",\n  "temperature": 0.7\n}',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (websiteId) {
      fetchConfig();
    }
  }, [websiteId]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_support_config')
        .select('*')
        .eq('website_id', websiteId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching chat config:', error);
        return;
      }

      if (data) {
        setConfig({
          is_enabled: data.is_enabled,
          greeting_message: data.greeting_message || '',
          knowledge_base: data.knowledge_base || '',
          chatbot_config: JSON.stringify(data.chatbot_config || {}, null, 2),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);

      let parsedConfig = {};
      try {
        parsedConfig = JSON.parse(config.chatbot_config);
      } catch (e) {
        alert('Invalid JSON in Advanced Config');
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('chat_support_config')
        .upsert({
          website_id: websiteId,
          is_enabled: config.is_enabled,
          greeting_message: config.greeting_message,
          knowledge_base: config.knowledge_base,
          chatbot_config: parsedConfig,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'website_id' });

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving chat config:', error);
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-500" />
          Chat Support
        </h3>
        <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
                {config.is_enabled ? 'Enabled' : 'Disabled'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                type="checkbox"
                className="sr-only peer"
                checked={config.is_enabled}
                onChange={(e) => setConfig({ ...config, is_enabled: e.target.checked })}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Greeting Message</label>
          <input
            type="text"
            value={config.greeting_message}
            onChange={(e) => setConfig({ ...config, greeting_message: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            placeholder="Hi! How can we help you today?"
          />
          <p className="text-xs text-slate-500 mt-1">This message will be shown when users first open the chat widget.</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
                <Bot className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                    <h4 className="text-sm font-semibold text-blue-900">Using Google Gemini</h4>
                    <p className="text-xs text-blue-700 mt-1">
                        API Key is automatically loaded from VITE_GEMINI_API_KEY environment variable (same as AI content generation).
                    </p>
                </div>
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Knowledge Base (Google Sheets)</label>
          <input
            type="text"
            value={config.knowledge_base}
            onChange={(e) => setConfig({ ...config, knowledge_base: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-mono"
            placeholder="https://script.google.com/macros/s/..."
          />
          <div className="mt-2 text-xs text-slate-500 space-y-1">
            <p className="flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Paste your Google Apps Script Web App URL here.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Advanced Config (JSON)</label>
          <textarea
            value={config.chatbot_config}
            onChange={(e) => setConfig({ ...config, chatbot_config: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-mono h-32"
          />
          <p className="text-xs text-slate-500 mt-1">Gemini-specific configuration. Example: {"{\"model\": \"gemini-2.0-flash\", \"temperature\": 0.7}"}</p>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};
