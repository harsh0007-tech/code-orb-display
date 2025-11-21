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
    // Track page visit
    const trackPageVisit = async () => {
      try {
        const visitorId = getVisitorId();
        const pagePath = location.pathname;
        const userAgent = navigator.userAgent;
        const referrer = document.referrer || 'direct';

        // Insert page visit asynchronously (fire and forget)
        await supabase.from('page_visits').insert({
          visitor_id: visitorId,
          page_path: pagePath,
          user_agent: userAgent,
          referrer: referrer,
        });
      } catch (error) {
        // Silently fail - don't break the app if tracking fails
        console.error('Page tracking error:', error);
      }
    };

    trackPageVisit();
  }, [location.pathname]);
};
