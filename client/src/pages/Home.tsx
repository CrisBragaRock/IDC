import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { Idea, IdeaType } from '../types';

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [type, setType] = useState<IdeaType | undefined>(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    api.ideas.list(type).then(setIdeas).catch((e) => setError(e.message));
  }, [type]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ideias da comunidade</h1>
      <div className="flex gap-2 mb-6">
        {(['game', 'story'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(type === t ? undefined : t)}
            className={`px-3 py-1 rounded text-sm border ${type === t ? 'bg-indigo-600 border-indigo-600' : 'border-gray-700'}`}
          >
            {t === 'game' ? 'Jogos' : 'Histórias'}
          </button>
        ))}
      </div>
      {error && <p className="text-red-400">{error}</p>}
      <div className="grid gap-4">
        {ideas.map((idea) => (
          <Link
            key={idea.id}
            to={`/idea/${idea.slug || idea.id}`}
            className="block p-4 rounded border border-gray-800 hover:border-gray-600"
          >
            <span className="text-xs uppercase text-indigo-400">{idea.type === 'game' ? 'Jogo' : 'História'}</span>
            <h2 className="text-lg font-semibold">{idea.title}</h2>
            {idea.summary && <p className="text-gray-400 text-sm mt-1">{idea.summary}</p>}
          </Link>
        ))}
        {!error && ideas.length === 0 && <p className="text-gray-500">Nenhuma ideia publicada ainda.</p>}
      </div>
    </div>
  );
}
