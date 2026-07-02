-- Senha padrão para os usuários de seed: "changeme123" (bcrypt salt-10) — trocar em produção
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Admin', 'admin@example.com', '$2b$10$ZzNgCAkZuvV62lAxWHY76uN2h66zZ4n0b2BvHsHcDjFJbbZHkf5B2', 'admin'),
  ('Criador', 'creator@example.com', '$2b$10$ZzNgCAkZuvV62lAxWHY76uN2h66zZ4n0b2BvHsHcDjFJbbZHkf5B2', 'member')
ON CONFLICT (email) DO NOTHING;

INSERT INTO feature_flags (key, enabled, rollout, roles) VALUES
  ('idea_comments', true, 100, ARRAY['admin','member']::user_role[]),
  ('beta_story_drafts', false, 0, ARRAY['admin']::user_role[])
ON CONFLICT (key) DO NOTHING;
