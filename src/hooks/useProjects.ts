
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignee: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  tasks: Task[];
  team: string[];
}

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

      // Carregar projetos
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Carregar tarefas de todos os projetos
      const projectIds = projectsData?.map(p => p.id) || [];
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .in('project_id', projectIds);

      if (tasksError) throw tasksError;

      // Carregar membros da equipe
      const { data: teamData, error: teamError } = await supabase
        .from('project_team_members')
        .select('*')
        .in('project_id', projectIds);

      if (teamError) throw teamError;

      // Combinar dados
      const formattedProjects: Project[] = projectsData?.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description || '',
        progress: project.progress,
        dueDate: project.due_date || '',
        tasks: tasksData?.filter(task => task.project_id === project.id).map(task => ({
          id: task.id,
          title: task.title,
          status: task.status as 'todo' | 'in-progress' | 'completed',
          assignee: task.assignee
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
        // Atualizar projeto existente
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            title: projectData.title,
            description: projectData.description,
            progress: projectData.progress,
            due_date: projectData.dueDate || null
          })
          .eq('id', editingProject.id);

        if (updateError) throw updateError;
        projectId = editingProject.id;

        // Deletar tarefas e membros existentes para recriar
        await supabase.from('tasks').delete().eq('project_id', projectId);
        await supabase.from('project_team_members').delete().eq('project_id', projectId);
      } else {
        // Criar novo projeto
        const { data: newProject, error: insertError } = await supabase
          .from('projects')
          .insert({
            title: projectData.title,
            description: projectData.description,
            progress: projectData.progress,
            due_date: projectData.dueDate || null,
            user_id: user.user.id
          })
          .select()
          .single();

        if (insertError) throw insertError;
        projectId = newProject.id;
      }

      // Inserir tarefas
      if (projectData.tasks.length > 0) {
        const { error: tasksError } = await supabase
          .from('tasks')
          .insert(
            projectData.tasks.map(task => ({
              project_id: projectId,
              title: task.title,
              status: task.status,
              assignee: task.assignee
            }))
          );

        if (tasksError) throw tasksError;
      }

      // Inserir membros da equipe
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
      await saveProject(updatedProject, updatedProject);
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
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
    loadProjects
  };
};
