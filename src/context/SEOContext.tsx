import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, SeoSetting } from '../services/api';

interface SEOContextValue {
  settings: SeoSetting[];
  loading: boolean;
  refresh: () => void;
}

const SEOContext = createContext<SEOContextValue>({ settings: [], loading: true, refresh: () => {} });

export function SEOProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SeoSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.getSeoSettings()
      .then(setSettings)
      .catch((err) => {
        console.error('[SEO] Failed to load settings from API:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <SEOContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </SEOContext.Provider>
  );
}

export function useSEO() {
  return useContext(SEOContext);
}
