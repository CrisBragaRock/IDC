import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { Idea } from '../types';

export default function MyIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    api.ideas.mine().then(setIdeas).catch(() => setIdeas([]));
  }, []);

  async function remove(id: string) {
    await api.ideas.remove(id);
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Minhas ideias</h1>
      <div className="grid gap-3">
        {ideas.map((idea) => (
          <div key={idea.id} className="flex items-center justify-between p-3 rounded border border-gray-800">
            <Link to={`/idea/${idea.slug || idea.id}`} className="flex-1">
              <span className="text-xs uppercase text-indigo-400 mr-2">{idea.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
              {idea.title}
            </Link>
            <button onClick={() => remove(idea.id)} className="text-red-400 text-sm">Excluir</button>
          </div>
        ))}
        {ideas.length === 0 && <p className="text-gray-500">Você ainda não publicou nenhuma ideia.</p>}
      </div>
    </div>
  );
}
