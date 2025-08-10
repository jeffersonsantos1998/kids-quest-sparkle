/*
  # Criação da tabela de Cofrinho Mágico
  1. Nova Tabela: piggy_bank (id, child_id, balance, last_updated)
  2. Segurança: Habilitar RLS, política para restringir acesso à família correspondente
*/
CREATE TABLE IF NOT EXISTS piggy_bank (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL, -- Relacionado ao user_id de family_members
  balance numeric(10,2) NOT NULL DEFAULT 0.00,
  last_updated timestamptz DEFAULT now()
);
ALTER TABLE piggy_bank ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Piggy bank visible to family" ON piggy_bank FOR ALL TO authenticated USING (child_id IN (
  SELECT user_id FROM family_members WHERE family_id IN (
    SELECT family_id FROM family_members WHERE user_id = auth.uid()
  )
));