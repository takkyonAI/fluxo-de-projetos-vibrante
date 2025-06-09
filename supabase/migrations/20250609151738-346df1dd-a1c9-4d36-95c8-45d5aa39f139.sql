
-- Adicionar campo de prioridade na tabela projects
ALTER TABLE public.projects 
ADD COLUMN priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5);

-- Adicionar comentário para documentar o campo
COMMENT ON COLUMN public.projects.priority IS 'Priority level from 1 (highest) to 5 (lowest)';
