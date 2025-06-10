import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Project, Task } from '@/types/project';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        setProjects([]);
        return;
      }

      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      const projectIds = projectsData?.map(p => p.id) || [];
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .in('project_id', projectIds);

      if (tasksError) throw tasksError;

      const { data: teamData, error: teamError } = await supabase
        .from('project_team_members')
        .select('*')
        .in('project_id', projectIds);

      if (teamError) throw teamError;

      const formattedProjects: Project[] = projectsData?.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description || '',
        progress: project.progress,
        dueDate: project.due_date || '',
        priority: project.priority || 3,
        tasks: tasksData?.filter(task => task.project_id === project.id).map(task => ({
          id: task.id,
          title: task.title,
          status: task.status as 'todo' | 'in-progress' | 'completed',
          assignees: task.assignee ? task.assignee.split(',').map((a: string) => a.trim()) : [],
          assignee: task.assignee || '', // Mantendo para compatibilidade
          dueDate: task.due_date || undefined,
          completedAt: task.completed_at || undefined
        })) || [],
        team: teamData?.filter(member => member.project_id === project.id).map(member => member.member_name) || []
      })) || [];

      setProjects(formattedProjects);
    } catch (error: any) {
      console.error('Erro ao carregar projetos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar projetos: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async (projectData: Omit<Project, 'id'>, editingProject?: Project) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }

      let projectId: string;

      if (editingProject) {
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            title: projectData.title,
            description: projectData.description,
            progress: projectData.progress,
            priority: projectData.priority,
            due_date: projectData.dueDate || null
          })
          .eq('id', editingProject.id);

        if (updateError) throw updateError;
        projectId = editingProject.id;

        await supabase.from('tasks').delete().eq('project_id', projectId);
        await supabase.from('project_team_members').delete().eq('project_id', projectId);
      } else {
        const { data: newProject, error: insertError } = await supabase
          .from('projects')
          .insert({
            title: projectData.title,
            description: projectData.description,
            progress: projectData.progress,
            priority: projectData.priority,
            due_date: projectData.dueDate || null,
            user_id: user.user.id
          })
          .select()
          .single();

        if (insertError) throw insertError;
        projectId = newProject.id;
      }

      if (projectData.tasks.length > 0) {
        const { error: tasksError } = await supabase
          .from('tasks')
          .insert(
            projectData.tasks.map(task => ({
              project_id: projectId,
              title: task.title,
              status: task.status,
              assignee: task.assignees.join(', '),
              due_date: task.dueDate || null,
              completed_at: task.status === 'completed' ? new Date().toISOString() : null
            }))
          );

        if (tasksError) throw tasksError;
      }

      if (projectData.team.length > 0) {
        const { error: teamError } = await supabase
          .from('project_team_members')
          .insert(
            projectData.team.map(member => ({
              project_id: projectId,
              member_name: member
            }))
          );

        if (teamError) throw teamError;
      }

      await loadProjects();
      
      toast({
        title: "Sucesso",
        description: `Projeto ${editingProject ? 'atualizado' : 'criado'} com sucesso!`
      });

      return projectId;
    } catch (error: any) {
      console.error('Erro ao salvar projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar projeto: " + error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProject = async (updatedProject: Project) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }

      // Atualizar o projeto
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          title: updatedProject.title,
          description: updatedProject.description,
          progress: updatedProject.progress,
          priority: updatedProject.priority,
          due_date: updatedProject.dueDate || null
        })
        .eq('id', updatedProject.id);

      if (updateError) throw updateError;

      // Atualizar as tarefas
      for (const task of updatedProject.tasks) {
        const { error: taskError } = await supabase
          .from('tasks')
          .update({
            title: task.title,
            status: task.status,
            assignee: task.assignees.join(', '),
            due_date: task.dueDate || null,
            completed_at: task.status === 'completed' ? new Date().toISOString() : null
          })
          .eq('id', task.id);

        if (taskError) throw taskError;
      }

      await loadProjects();
      
      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso!"
      });
    } catch (error: any) {
      console.error('Erro ao atualizar projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar projeto: " + error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      // Deletar tarefas do projeto
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('project_id', projectId);

      if (tasksError) throw tasksError;

      // Deletar membros da equipe do projeto
      const { error: teamError } = await supabase
        .from('project_team_members')
        .delete()
        .eq('project_id', projectId);

      if (teamError) throw teamError;

      // Deletar o projeto
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (projectError) throw projectError;

      await loadProjects();
      
      toast({
        title: "Sucesso",
        description: "Projeto excluído com sucesso!"
      });
    } catch (error: any) {
      console.error('Erro ao excluir projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir projeto: " + error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    loading,
    saveProject,
    updateProject,
    deleteProject,
    loadProjects
  };
};
