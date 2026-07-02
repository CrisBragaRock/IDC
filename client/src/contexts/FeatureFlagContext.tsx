import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api, getToken } from '../api';

const FeatureFlagContext = createContext<Record<string, boolean>>({});

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!getToken()) return;
    api.features.list()
      .then((list) => setFlags(Object.fromEntries(list.map((f) => [f.key, f.enabled]))))
      .catch(() => setFlags({}));
  }, []);

  return <FeatureFlagContext.Provider value={flags}>{children}</FeatureFlagContext.Provider>;
}

export function useFeatureFlag(key: string): boolean {
  const flags = useContext(FeatureFlagContext);
  return flags[key] ?? false;
}
