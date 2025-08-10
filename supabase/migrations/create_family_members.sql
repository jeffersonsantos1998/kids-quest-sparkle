/*
  # Criação da tabela de Membros da Família
  1. Nova Tabela: family_members (id, family_id, user_id, role, created_at)
  2. Segurança: Habilitar RLS, política para restringir acesso aos membros da própria família
*/
CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid REFERENCES family_accounts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL, -- Relacionado ao auth.users do Supabase
  role text NOT NULL DEFAULT 'child', -- 'parent' ou 'child'
  created_at timestamptz DEFAULT now()
);
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family members visible to family" ON family_members FOR ALL TO authenticated USING (auth.uid() = user_id OR family_id IN (
  SELECT id FROM family_accounts WHERE id IN (
    SELECT family_id FROM family_members WHERE user_id = auth.uid()
  )
));