
-- Adicionar coluna due_date na tabela tasks
ALTER TABLE public.tasks 
ADD COLUMN due_date DATE;

-- Comentário para documentar o campo
COMMENT ON COLUMN public.tasks.due_date IS 'Due date for the task';
