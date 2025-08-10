/*
  # Criação da tabela de Missões
  1. Nova Tabela: missions (id, family_id, title, description, points, recurrence, created_at)
  2. Segurança: Habilitar RLS, política para restringir acesso à família correspondente
*/
CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid REFERENCES family_accounts(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  points int NOT NULL DEFAULT 0,
  recurrence text NOT NULL DEFAULT 'once', -- 'once', 'daily', 'weekly'
  created_at timestamptz DEFAULT now()
);
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Missions visible to family" ON missions FOR ALL TO authenticated USING (family_id IN (
  SELECT id FROM family_accounts WHERE id IN (
    SELECT family_id FROM family_members WHERE user_id = auth.uid()
  )
));