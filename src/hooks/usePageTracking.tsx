import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const VISITOR_ID_KEY = 'visitor_id';

// Generate a unique visitor ID
const generateVisitorId = (): string => {
  return `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

// Get or create visitor ID
const getVisitorId = (): string => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
};

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page visit - deferred to avoid blocking critical rendering
    const trackPageVisit = () => {
      try {
        const visitorId = getVisitorId();
        const pagePath = location.pathname;
        const userAgent = navigator.userAgent;
        const referrer = document.referrer || 'direct';

        // Use saved native XHR to bypass any patching by lovable.js
        const NativeXHR = (window as any).__nativeXHR || XMLHttpRequest;
        const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/page_visits`;
        const xhr = new NativeXHR();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('apikey', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
        xhr.setRequestHeader('Authorization', `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`);
        xhr.setRequestHeader('Prefer', 'return=minimal');
        xhr.send(JSON.stringify({
          visitor_id: visitorId,
          page_path: pagePath,
          user_agent: userAgent,
          referrer: referrer,
        }));
      } catch (error) {
        console.error('Page tracking error:', error);
      }
    };

    // Defer tracking to avoid blocking critical path
    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => trackPageVisit(), { timeout: 2000 });
    } else {
      setTimeout(trackPageVisit, 100);
    }
  }, [location.pathname]);
};
