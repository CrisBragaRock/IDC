import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { IdeaType } from '../types';

export default function NewIdea() {
  const navigate = useNavigate();
  const [type, setType] = useState<IdeaType>('game');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent, publish: boolean) {
    e.preventDefault();
    setError('');
    try {
      const idea = await api.ideas.create({ type, title, summary, content });
      if (publish) await api.ideas.update(idea.id, { status: 'published' });
      navigate(`/idea/${idea.slug || idea.id}`);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <form className="flex flex-col gap-3 max-w-2xl">
      <h1 className="text-xl font-bold mb-2">Nova ideia</h1>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-2">
        {(['game', 'story'] as const).map((t) => (
          <button
            key={t} type="button" onClick={() => setType(t)}
            className={`px-3 py-1 rounded text-sm border ${type === t ? 'bg-indigo-600 border-indigo-600' : 'border-gray-700'}`}
          >
            {t === 'game' ? 'Jogo' : 'História'}
          </button>
        ))}
      </div>
      <input
        required placeholder="Título" value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-gray-900 border border-gray-700 rounded px-3 py-2"
      />
      <input
        placeholder="Resumo curto" value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="bg-gray-900 border border-gray-700 rounded px-3 py-2"
      />
      <textarea
        required placeholder="Conte sua ideia..." value={content} rows={10}
        onChange={(e) => setContent(e.target.value)}
        className="bg-gray-900 border border-gray-700 rounded px-3 py-2"
      />
      <div className="flex gap-2">
        <button onClick={(e) => handleSubmit(e, false)} className="border border-gray-700 rounded px-4 py-2">
          Salvar rascunho
        </button>
        <button onClick={(e) => handleSubmit(e, true)} className="bg-indigo-600 hover:bg-indigo-500 rounded px-4 py-2">
          Publicar
        </button>
      </div>
    </form>
  );
}
