
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import DashboardStats from './DashboardStats';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Projetos</h1>
          <p className="text-gray-600">Gerencie seus projetos e acompanhe o progresso em tempo real</p>
        </div>

        <DashboardStats projects={projects} />

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Meus Projetos</h2>
            
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
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Projeto
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleEditProject(project)}
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
  );
};

export default ProjectDashboard;
