
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, FolderOpen, Moon, Sun } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import DashboardStats from './DashboardStats';
import ProjectTimeline from './ProjectTimeline';

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
  const [darkMode, setDarkMode] = useState(false);
  
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Sistema de E-commerce',
      description: 'Desenvolvimento de plataforma completa de vendas online com pagamento integrado',
      progress: 75,
      dueDate: '2024-07-15',
      tasks: [
        { id: '1', title: 'Design da interface', status: 'completed', assignee: 'Ana Silva' },
        { id: '2', title: 'Desenvolvimento frontend', status: 'in-progress', assignee: 'João Santos' },
        { id: '3', title: 'Integração de pagamento', status: 'todo', assignee: 'Carlos Oliveira' },
        { id: '4', title: 'Testes finais', status: 'todo', assignee: 'Maria Costa' }
      ],
      team: ['Ana Silva', 'João Santos', 'Carlos Oliveira', 'Maria Costa']
    },
    {
      id: '2',
      title: 'App Mobile de Delivery',
      description: 'Aplicativo móvel para delivery de comida com sistema de rastreamento em tempo real',
      progress: 40,
      dueDate: '2024-08-30',
      tasks: [
        { id: '5', title: 'Prototipagem', status: 'completed', assignee: 'Pedro Lima' },
        { id: '6', title: 'Desenvolvimento iOS', status: 'in-progress', assignee: 'Laura Mendes' },
        { id: '7', title: 'Desenvolvimento Android', status: 'in-progress', assignee: 'Ricardo Ferreira' },
        { id: '8', title: 'API Backend', status: 'todo', assignee: 'Camila Rocha' },
        { id: '9', title: 'Testes de usuário', status: 'todo', assignee: 'Thiago Alves' }
      ],
      team: ['Pedro Lima', 'Laura Mendes', 'Ricardo Ferreira', 'Camila Rocha', 'Thiago Alves']
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'completed' && project.progress === 100) ||
                         (filterStatus === 'in-progress' && project.progress > 0 && project.progress < 100) ||
                         (filterStatus === 'not-started' && project.progress === 0);
    
    return matchesSearch && matchesFilter;
  });

  const handleSaveProject = (projectData: Omit<Project, 'id'>) => {
    if (selectedProject) {
      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id ? { ...projectData, id: selectedProject.id } : p
      ));
    } else {
      const newProject = {
        ...projectData,
        id: Date.now().toString()
      };
      setProjects(prev => [...prev, newProject]);
    }
    setSelectedProject(undefined);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    ));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Header com faixa amarela */}
      <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo usando a imagem enviada */}
              <div className="bg-white rounded-lg p-2 shadow-md">
                <img 
                  src="/lovable-uploads/1f1774f4-553f-4b8e-8142-308bd1e09925.png" 
                  alt="Logo Rockfeller" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard de Projetos Rockfeller</h1>
                <p className="text-orange-100 text-sm">Gerencie seus projetos e acompanhe o progresso em tempo real</p>
              </div>
            </div>
            
            {/* Botão Dark Mode */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 dark:from-gray-900 dark:via-purple-950/30 dark:to-blue-950/30 p-6">
        <div className="max-w-7xl mx-auto">
          <DashboardStats projects={projects} />

          <div className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200/50 dark:border-purple-700/50 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Meus Projetos</h2>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className={viewMode === 'cards' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    Cards
                  </Button>
                  <Button
                    variant={viewMode === 'timeline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('timeline')}
                    className={viewMode === 'timeline' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    Timeline
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar projetos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os projetos</SelectItem>
                    <SelectItem value="completed">Concluídos</SelectItem>
                    <SelectItem value="in-progress">Em progresso</SelectItem>
                    <SelectItem value="not-started">Não iniciados</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={() => {
                    setSelectedProject(undefined);
                    setModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Projeto
                </Button>
              </div>
            </div>

            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleEditProject(project)}
                    onUpdateProject={handleUpdateProject}
                  />
                ))}
                
                {filteredProjects.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <FolderOpen className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-500 mb-2">
                      Nenhum projeto encontrado
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {searchTerm || filterStatus !== 'all' 
                        ? 'Tente ajustar os filtros de busca'
                        : 'Comece criando seu primeiro projeto'
                      }
                    </p>
                    <Button 
                      onClick={() => {
                        setSelectedProject(undefined);
                        setModalOpen(true);
                      }}
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Projeto
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <ProjectTimeline projects={filteredProjects} onEditProject={handleEditProject} />
            )}
          </div>

          <ProjectModal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedProject(undefined);
            }}
            onSave={handleSaveProject}
            project={selectedProject}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
