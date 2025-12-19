import { supabase } from './supabaseService';

export type ChatbotProvider = 'gemini' | 'groq';

export interface ChatbotConfig {
  provider: ChatbotProvider;
  apiKey?: string;
  botId?: string;
  webhookUrl?: string;
  config?: Record<string, any>;
  knowledgeBase?: string;
}

export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

/**
 * Get chatbot configuration for current website
 */
export async function getChatbotConfig(websiteId: string): Promise<ChatbotConfig | null> {
  try {
    if (!websiteId) return null;

    const { data, error } = await supabase
      .from('chat_support_config')
      .select('chatbot_provider, chatbot_api_key, chatbot_bot_id, chatbot_webhook_url, chatbot_config, knowledge_base')
      .eq('website_id', websiteId)
      .single();

    // Handle various error cases gracefully
    if (error) {
      // PGRST116 = no rows returned, 406 = not acceptable (table might not exist or RLS blocking)
      if (error.code === 'PGRST116' || error.code === '406' || error.message?.includes('406')) {
        return null; // Config doesn't exist, return null gracefully
      }
      console.warn('[Chatbot] Error fetching config:', error.code, error.message);
      return null;
    }

    if (!data) return null;

    // Knowledge base is now always from Google Sheets (Apps Script URL)
    let knowledgeBase = undefined;
    const kbUrl = data.knowledge_base;
    if (kbUrl && (kbUrl.startsWith('http://') || kbUrl.startsWith('https://'))) {
      // It's a Google Sheets Apps Script URL, fetch it with website parameter and mode=kb
      try {
        // Get website subdomain from database to append to URL
        const { data: websiteData } = await supabase
          .from('websites')
          .select('subdomain')
          .eq('id', websiteId)
          .single();
        
        const website = websiteData?.subdomain || 'default';
        // Use mode=kb to get raw knowledge base content as plain text
        const separator = kbUrl.includes('?') ? '&' : '?';
        const sheetsUrl = `${kbUrl}${separator}mode=kb&website=${website}`;
        
        console.log('[Chatbot] Fetching knowledge base from:', sheetsUrl);
        
        const response = await fetch(sheetsUrl, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
        });
        
        if (response.ok) {
          const kbText = await response.text();
          console.log('[Chatbot] Knowledge base fetched, length:', kbText?.length || 0);
          // Only use if we got actual content (not empty)
          if (kbText && kbText.trim().length > 0) {
            knowledgeBase = kbText.trim();
            console.log('[Chatbot] Knowledge base loaded successfully');
          } else {
            console.warn('[Chatbot] Knowledge base is empty from Google Sheets:', sheetsUrl);
          }
        } else {
          const errorText = await response.text().catch(() => '');
          console.warn('[Chatbot] Failed to fetch knowledge base:', sheetsUrl, response.status, errorText);
        }
      } catch (err) {
        console.error('[Chatbot] Error fetching knowledge base from Google Sheets:', err);
      }
    } else {
      console.log('[Chatbot] No knowledge base URL configured');
    }

    // Use environment variable for Gemini API key (same as AI content generation)
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || data.chatbot_api_key || undefined;
    const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || undefined;

    // Determine provider and key
    let provider: ChatbotProvider = 'gemini';
    let apiKey = geminiApiKey;

    // Prioritize Groq if configured in Env
    if (groqApiKey) {
      provider = 'groq';
      apiKey = groqApiKey;
    } else if (data.chatbot_provider === 'groq') {
      provider = 'groq';
      apiKey = data.chatbot_api_key || undefined;
    }

    return {
      provider: provider,
      apiKey: apiKey,
      botId: undefined,
      webhookUrl: undefined,
      config: (data.chatbot_config as Record<string, any>) || {},
      knowledgeBase: knowledgeBase,
    };
  } catch (error) {
    console.error('Error fetching chatbot config:', error);
    return null;
  }
}

/**
 * Send message to chatbot and get response
 */
export async function sendChatbotMessage(
  message: string,
  websiteId: string,
  conversationId?: string
): Promise<string> {
  console.log('[Chatbot] Sending message:', message, 'for website:', websiteId);
  
  if (config.provider === 'groq') {
    return handleGroq(message, config, conversationId);
  }

  // Default to Gemini
  return handleGemini(message, config, conversationId);
}

/**
 * Groq integration (Llama 3)
 * Documentation: https://console.groq.com/docs/api-reference
 */
async function handleGroq(
  message: string,
  config: ChatbotConfig,
  conversationId?: string
): Promise<string> {
  if (!config.apiKey) {
    console.error('Groq: Missing apiKey');
    return "I'm sorry, I'm having trouble connecting. Please make sure the Groq API key is configured.";
  }

  try {
    // Build system instruction with knowledge base if available
    let systemInstruction = config.config?.systemPrompt || 'You are a helpful customer support assistant for a business. Be friendly, concise, and accurate. Always respond naturally to greetings and questions, even simple ones like "hello" or "hi".';
    
    if (config.knowledgeBase) {
      console.log('[Chatbot] Including knowledge base in prompt (Groq)');
      systemInstruction = `${systemInstruction}\n\nKnowledge Base:\n${config.knowledgeBase}\n\nUse the knowledge base above to answer questions accurately. Always respond naturally to greetings (like "hello", "hi", "helo") with a friendly greeting back. If the information is not in the knowledge base, politely say you don't have that information and suggest contacting support directly.`;
    }

    console.log('[Chatbot] Sending message to Groq:', message.substring(0, 50) + '...');

    const model = config.config?.model || 'llama3-8b-8192';
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    };

    const body = {
      model: model,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: message }
      ],
      temperature: config.config?.temperature || 0.7,
      max_tokens: config.config?.maxTokens || 500,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Chatbot] Groq API error:', response.status, errorData);
      throw new Error(`Groq API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('[Chatbot] Groq API response received');

    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message?.content;
      if (content) {
        return content;
      }
    }

    console.warn('[Chatbot] No valid response from Groq');
    return 'I received your message.';

  } catch (error) {
    console.error('Groq error:', error);
    return "I'm sorry, I'm having trouble processing your message. Please try again later.";
  }
  if (!config) {
    console.error('[Chatbot] No config found for website:', websiteId);
    return "I'm sorry, I'm having trouble connecting. Please try again later.";
  }

  if (!config.apiKey) {
    console.error('[Chatbot] No API key configured');
    return "I'm sorry, I'm having trouble connecting. Please make sure the chatbot is properly configured.";
  }

  console.log('[Chatbot] Config loaded, API key present, knowledge base:', config.knowledgeBase ? 'Yes' : 'No');

  // Only Gemini is supported now
  return handleGemini(message, config, conversationId);
}

/**
 * Google Gemini integration
 * Documentation: https://ai.google.dev/docs
 * Free tier: High limits, $0 cost
 */
async function handleGemini(
  message: string,
  config: ChatbotConfig,
  conversationId?: string
): Promise<string> {
  if (!config.apiKey) {
    console.error('Gemini: Missing apiKey');
    return "I'm sorry, I'm having trouble connecting. Please make sure the Gemini API key is configured.";
  }

  try {
    // Build system instruction with knowledge base if available
    let systemInstruction = config.config?.systemPrompt || 'You are a helpful customer support assistant for a business. Be friendly, concise, and accurate. Always respond naturally to greetings and questions, even simple ones like "hello" or "hi".';
    
    // If knowledge base exists, prepend it to system instruction
    if (config.knowledgeBase) {
      console.log('[Chatbot] Including knowledge base in prompt, length:', config.knowledgeBase.length);
      systemInstruction = `${systemInstruction}\n\nKnowledge Base:\n${config.knowledgeBase}\n\nUse the knowledge base above to answer questions accurately. Always respond naturally to greetings (like "hello", "hi", "helo") with a friendly greeting back. If the information is not in the knowledge base, politely say you don't have that information and suggest contacting support directly.`;
    } else {
      console.log('[Chatbot] No knowledge base available, using default system prompt');
    }
    
    console.log('[Chatbot] Sending message to Gemini:', message.substring(0, 50) + '...');

    // Use Gemini API via server proxy or direct API call
    const model = config.config?.model || 'gemini-1.5-flash';
    
    // Direct API call (for development)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: config.config?.temperature || 0.7,
        topK: config.config?.topK || 40,
        topP: config.config?.topP || 0.95,
        maxOutputTokens: config.config?.maxTokens || 500,
      }
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Chatbot] Gemini API error:', response.status, errorData);
      throw new Error(`Gemini API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('[Chatbot] Gemini API response received');
    
    // Extract response text from Gemini API response
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const responseText = candidate.content.parts[0].text;
        console.log('[Chatbot] Gemini response:', responseText.substring(0, 100) + '...');
        return responseText;
      }
    }
    
    console.warn('[Chatbot] No valid response from Gemini, returning default');
    return 'I received your message.';
  } catch (error) {
    console.error('Gemini error:', error);
    return "I'm sorry, I'm having trouble processing your message. Please try again later.";
  }
}
