import { useEffect, useState } from 'react';
import { api } from '../../api';
import type { FeatureFlag } from '../../types';

export default function AdminFeatures() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);

  useEffect(() => {
    api.features.adminList().then(setFlags).catch(() => setFlags([]));
  }, []);

  async function toggle(flag: FeatureFlag) {
    const updated = await api.features.update(flag.id, { enabled: !flag.enabled });
    setFlags((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  }

  async function setRollout(flag: FeatureFlag, rollout: number) {
    const updated = await api.features.update(flag.id, { rollout });
    setFlags((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Feature Toggles</h1>
      <div className="grid gap-3">
        {flags.map((flag) => (
          <div key={flag.id} className="flex items-center justify-between p-3 rounded border border-gray-800">
            <div>
              <p className="font-mono text-sm">{flag.key}</p>
              <p className="text-xs text-gray-500">roles: {flag.roles.join(', ')}</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number" min={0} max={100} value={flag.rollout}
                onChange={(e) => setRollout(flag, Number(e.target.value))}
                className="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
              />
              <button
                onClick={() => toggle(flag)}
                className={`px-3 py-1 rounded text-sm ${flag.enabled ? 'bg-green-700' : 'bg-gray-700'}`}
              >
                {flag.enabled ? 'Ativo' : 'Inativo'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
