import React from 'react';
import { MessageCircle, Copy, Check, ExternalLink, X } from 'lucide-react';

interface MessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  messengerUrl: string;
  pageId: string;
}

export const MessengerModal: React.FC<MessengerModalProps> = ({
  isOpen,
  onClose,
  messengerUrl,
  pageId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold">Order Details Copied!</h3>
          <p className="text-blue-100 text-sm mt-1">Ready to send via Messenger</p>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 font-bold text-slate-600">1</div>
              <div>
                <p className="font-medium text-slate-900">Open Messenger</p>
                <p className="text-sm text-slate-500">Click the button below to start a chat.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 font-bold text-slate-600">2</div>
              <div>
                <p className="font-medium text-slate-900">Paste Your Order</p>
                <p className="text-sm text-slate-500">
                  Long press the text box and select <strong>Paste</strong> (or Ctrl+V).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 font-bold text-slate-600">3</div>
              <div>
                <p className="font-medium text-slate-900">Send Message</p>
                <p className="text-sm text-slate-500">Hit send to complete your order!</p>
              </div>
            </div>
          </div>

          <a 
            href={messengerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-200"
          >
            <MessageCircle className="w-5 h-5" />
            Open Messenger Now
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>
          
          <p className="text-xs text-center text-slate-400">
            Messaging page ID: {pageId}
          </p>
        </div>
      </div>
    </div>
  );
};
