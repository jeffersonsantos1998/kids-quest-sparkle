/*
  # Criação da tabela de Progresso das Crianças
  1. Nova Tabela: child_progress (id, child_id, mission_id, completed_at, points_earned)
  2. Segurança: Habilitar RLS, política para restringir acesso à família correspondente
*/
CREATE TABLE IF NOT EXISTS child_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL, -- Relacionado ao user_id de family_members
  mission_id uuid REFERENCES missions(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  points_earned int NOT NULL DEFAULT 0
);
ALTER TABLE child_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Progress visible to family" ON child_progress FOR ALL TO authenticated USING (child_id IN (
  SELECT user_id FROM family_members WHERE family_id IN (
    SELECT family_id FROM family_members WHERE user_id = auth.uid()
  )
));