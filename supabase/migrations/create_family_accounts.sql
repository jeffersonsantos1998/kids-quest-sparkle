/*
  # Criação da tabela de Contas Familiares
  1. Nova Tabela: family_accounts (id, name, plan_type, created_at)
  2. Segurança: Habilitar RLS, política para que apenas usuários autenticados da conta familiar possam visualizar ou modificar
*/
CREATE TABLE IF NOT EXISTS family_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  plan_type text NOT NULL DEFAULT 'free', -- 'free' ou 'premium'
  created_at timestamptz DEFAULT now()
);
ALTER TABLE family_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family accounts visible to authenticated users" ON family_accounts FOR ALL TO authenticated USING (auth.uid() IN (
  SELECT user_id FROM family_members WHERE family_id = family_accounts.id
));