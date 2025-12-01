import React from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  showScrollTop: boolean;
  scrollToTop: () => void;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  showScrollTop,
  scrollToTop,
}) => {
  return (
    <>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 p-3 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-700 transition-all z-40 opacity-90"
          title="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};
