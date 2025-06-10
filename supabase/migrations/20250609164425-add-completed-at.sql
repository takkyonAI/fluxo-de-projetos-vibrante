-- Adicionar coluna completed_at na tabela tasks
ALTER TABLE public.tasks 
ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;

-- Comentário para documentar o campo
COMMENT ON COLUMN public.tasks.completed_at IS 'Data e hora em que a tarefa foi concluída'; 