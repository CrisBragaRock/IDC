export type Role = 'admin' | 'member';
export type IdeaType = 'game' | 'story';
export type IdeaStatus = 'draft' | 'published';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  pw_version: number;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  slug?: string;
  type: IdeaType;
  title: string;
  summary: string | null;
  content: string;
  status: IdeaStatus;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  idea_id: string;
  user_id: string;
  body: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  enabled: boolean;
  rollout: number;
  roles: Role[];
  created_at: string;
  updated_at: string;
}

export interface FeatureFlagOverride {
  id: string;
  flag_id: string;
  user_id: string;
  enabled: boolean;
}

export interface JwtPayload {
  userId: string;
  role: Role;
  pwv: number;
}
