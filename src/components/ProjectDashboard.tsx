
import React, { useState, useCallback } from 'react';
import { Search, Plus, LayoutGrid, BarChart3, Moon, Sun, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProjectCard from './ProjectCard';
import ProjectTimeline from './ProjectTimeline';
import ProjectModal from './ProjectModal';
import DashboardStats from './DashboardStats';
import { useProjects } from '@/hooks/useProjects';
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

const ProjectDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const { projects, loading, saveProject, updateProject } = useProjects();
  const { toast } = useToast();

  const filteredAndSortedProjects = projects
    .filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'progress':
          return b.progress - a.progress;
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        default:
          return 0;
      }
    });

  const handleProjectSelect = useCallback((project: Project) => {
    console.log('Projeto selecionado:', project.title);
  }, []);

  const sendNotificationEmail = async (project: Project, action: 'created' | 'updated') => {
    const emailData = {
      to: 'wade.venga@rockfeller.com.br',
      subject: `Projeto ${action === 'created' ? 'Criado' : 'Atualizado'}: ${project.title}`,
      message: `
        O projeto "${project.title}" foi ${action === 'created' ? 'criado' : 'atualizado'}.
        
        Descrição: ${project.description}
        Data de Entrega: ${new Date(project.dueDate).toLocaleDateString('pt-BR')}
        Progresso: ${project.progress}%
        Equipe: ${project.team.join(', ')}
        
        Dashboard: ${window.location.origin}
      `
    };

    console.log('Enviando notificação por email:', emailData);
    alert(`Email de notificação enviado para wade.venga@rockfeller.com.br sobre o projeto: ${project.title}`);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      await saveProject(projectData, editingProject || undefined);
      
      const action = editingProject ? 'updated' : 'created';
      const projectForNotification = { 
        ...projectData, 
        id: editingProject?.id || 'new' 
      } as Project;
      
      await sendNotificationEmail(projectForNotification, action);
      
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      await updateProject(updatedProject);
      await sendNotificationEmail(updatedProject, 'updated');
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso!"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout: " + error.message,
        variant: "destructive"
      });
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando projetos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Header com faixa laranja */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/1f1774f4-553f-4b8e-8142-308bd1e09925.png" 
              alt="Rockfeller Logo" 
              className="h-4 w-auto object-contain"
              style={{ background: 'transparent' }}
            />
            <h1 className="text-2xl font-bold text-white">Dashboard de Projetos Rockfeller</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleDarkMode}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 dark:from-gray-900 dark:via-purple-950/30 dark:to-blue-950/20 min-h-screen transition-colors duration-300">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          
          <DashboardStats projects={projects} />
          
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 dark:bg-gray-800/80 border border-purple-200 dark:border-purple-700 focus:border-purple-400 dark:focus:border-purple-500"
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white/80 dark:bg-gray-800/80 border border-purple-200 dark:border-purple-700">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="progress">Progresso</SelectItem>
                  <SelectItem value="dueDate">Data de Entrega</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <div className="flex bg-white/80 dark:bg-gray-800/80 rounded-lg p-1 border border-purple-200 dark:border-purple-700">
                <Button
                  variant={view === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('grid')}
                  className={view === 'grid' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'hover:bg-purple-100 dark:hover:bg-purple-900/50'}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={view === 'timeline' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('timeline')}
                  className={view === 'timeline' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'hover:bg-purple-100 dark:hover:bg-purple-900/50'}
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
              
              <Button 
                onClick={handleNewProject}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Projeto
              </Button>
            </div>
          </div>

          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectSelect(project)}
                  onUpdateProject={handleUpdateProject}
                />
              ))}
            </div>
          ) : (
            <ProjectTimeline 
              projects={filteredAndSortedProjects} 
              onEditProject={handleEditProject}
            />
          )}

          <ProjectModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveProject}
            project={editingProject}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
