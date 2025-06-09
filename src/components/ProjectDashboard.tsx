
import React, { useState } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import DashboardStats from './DashboardStats';
import ProjectTimeline from './ProjectTimeline';
import ProjectFilters from './ProjectFilters';
import { useProjects } from '@/hooks/useProjects';
import useProjectFilters from '@/hooks/useProjectFilters';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types/project';

const ProjectDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { projects, loading, saveProject } = useProjects();
  const { filters, setFilters, filteredProjects } = useProjectFilters(projects);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleSaveProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      await saveProject(projectData, editingProject || undefined);
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando projetos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard de Projetos
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats projects={projects} />
        
        <ProjectFilters 
          filters={filters}
          onFiltersChange={setFilters}
          projects={projects}
        />
        
        <ProjectTimeline projects={filteredProjects} onEditProject={handleEditProject} />

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Meus Projetos {filteredProjects.length !== projects.length && `(${filteredProjects.length} de ${projects.length})`}
            </h2>
            <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {projects.length === 0 ? 'Nenhum projeto ainda' : 'Nenhum projeto encontrado'}
              </h3>
              <p className="text-gray-500 mb-4">
                {projects.length === 0 ? 'Comece criando seu primeiro projeto' : 'Tente ajustar os filtros para encontrar seus projetos'}
              </p>
              {projects.length === 0 && (
                <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ProjectModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        project={editingProject}
        allProjects={projects}
      />
    </div>
  );
};

export default ProjectDashboard;
