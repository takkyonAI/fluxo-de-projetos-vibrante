-- Adicionar coluna completed_at na tabela tasks
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Atualizar tarefas existentes que estão como completed
UPDATE public.tasks 
SET completed_at = updated_at 
WHERE status = 'completed' AND completed_at IS NULL;

-- Comentário para documentar o campo
COMMENT ON COLUMN public.tasks.completed_at IS 'Data e hora em que a tarefa foi concluída'; 