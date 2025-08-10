/*
  # Criação da tabela de Recompensas
  1. Nova Tabela: rewards (id, family_id, title, cost, created_at)
  2. Segurança: Habilitar RLS, política para restringir acesso à família correspondente
*/
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid REFERENCES family_accounts(id) ON DELETE CASCADE,
  title text NOT NULL,
  cost int NOT NULL DEFAULT 0, -- Custo em estrelas/pontos
  created_at timestamptz DEFAULT now()
);
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rewards visible to family" ON rewards FOR ALL TO authenticated USING (family_id IN (
  SELECT id FROM family_accounts WHERE id IN (
    SELECT family_id FROM family_members WHERE user_id = auth.uid()
  )
));