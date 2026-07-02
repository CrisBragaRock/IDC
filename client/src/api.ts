import type { AuditLog, Comment, FeatureFlag, Idea, User } from './types';

const BASE = (import.meta.env.VITE_API_URL || '') + '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(method: string, path: string, body?: unknown, isFormData = false): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isFormData ? (body as BodyInit) : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new TypeError(`Non-JSON response: HTTP ${res.status}`);
  }

  if (res.status === 401) {
    const isAuthRoute = path === '/auth/login' || path === '/auth/register';
    if (!isAuthRoute) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired');
    }
    throw new Error((data as { error?: string }).error || 'Credenciais inválidas');
  }

  if (!res.ok) throw new Error((data as { error?: string }).error || 'Request failed');
  return data as T;
}

export const api = {
  auth: {
    login: (b: { email: string; password: string }) =>
      request<{ token: string; user: User }>('POST', '/auth/login', b),
    register: (b: { name: string; email: string; password: string }) =>
      request<{ token: string; user: User }>('POST', '/auth/register', b),
    me: () => request<User>('GET', '/auth/me'),
    changePassword: (b: { currentPassword: string; newPassword: string }) =>
      request<{ token: string }>('POST', '/auth/change-password', b),
  },
  ideas: {
    list: (type?: 'game' | 'story') => request<Idea[]>('GET', `/ideas${type ? `?type=${type}` : ''}`),
    mine: () => request<Idea[]>('GET', '/ideas/mine'),
    get: (idOrSlug: string) => request<Idea>('GET', `/ideas/${idOrSlug}`),
    create: (b: { type: 'game' | 'story'; title: string; summary?: string; content: string }) =>
      request<Idea>('POST', '/ideas', b),
    update: (id: string, b: Partial<{ title: string; summary: string; content: string; status: 'draft' | 'published' }>) =>
      request<Idea>('PATCH', `/ideas/${id}`, b),
    remove: (id: string) => request<void>('DELETE', `/ideas/${id}`),
  },
  comments: {
    listByIdea: (ideaId: string) => request<Comment[]>('GET', `/comments/idea/${ideaId}`),
    create: (ideaId: string, body: string) => request<Comment>('POST', `/comments/idea/${ideaId}`, { body }),
    remove: (id: string) => request<void>('DELETE', `/comments/${id}`),
  },
  features: {
    list: () => request<{ key: string; enabled: boolean }[]>('GET', '/features'),
    adminList: () => request<FeatureFlag[]>('GET', '/features/admin'),
    update: (id: string, b: Partial<{ enabled: boolean; rollout: number; roles: string[] }>) =>
      request<FeatureFlag>('PATCH', `/features/admin/${id}`, b),
  },
  audit: {
    list: (params?: { action?: string; from?: string; to?: string }) => {
      const qs = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      return request<AuditLog[]>('GET', `/audit${qs ? `?${qs}` : ''}`);
    },
  },
};

export { getToken };
