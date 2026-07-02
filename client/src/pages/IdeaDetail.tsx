import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureFlag } from '../contexts/FeatureFlagContext';
import type { Comment, Idea } from '../types';

export default function IdeaDetail() {
  const { ideaSlug } = useParams<{ ideaSlug: string }>();
  const { user } = useAuth();
  const commentsEnabled = useFeatureFlag('idea_comments');
  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ideaSlug) return;
    api.ideas.get(ideaSlug).then((i) => {
      setIdea(i);
      api.comments.listByIdea(i.id).then(setComments).catch(() => setComments([]));
    }).catch((e) => setError(e.message));
  }, [ideaSlug]);

  async function submitComment(e: FormEvent) {
    e.preventDefault();
    if (!idea) return;
    try {
      const comment = await api.comments.create(idea.id, body);
      setComments((prev) => [...prev, comment]);
      setBody('');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (error) return <p className="text-red-400">{error}</p>;
  if (!idea) return null;

  return (
    <article>
      <span className="text-xs uppercase text-indigo-400">{idea.type === 'game' ? 'Jogo' : 'História'}</span>
      <h1 className="text-2xl font-bold mt-1">{idea.title}</h1>
      <div
        className="mt-4 whitespace-pre-wrap text-gray-300"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(idea.content) }}
      />

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Comentários</h2>
        {commentsEnabled && user && (
          <form onSubmit={submitComment} className="flex gap-2 mb-4">
            <input
              required value={body} onChange={(e) => setBody(e.target.value)}
              placeholder="Escreva um comentário..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 rounded px-4">Enviar</button>
          </form>
        )}
        <div className="flex flex-col gap-2">
          {comments.map((c) => (
            <div key={c.id} className="p-2 rounded border border-gray-800 text-sm">{c.body}</div>
          ))}
        </div>
      </section>
    </article>
  );
}
