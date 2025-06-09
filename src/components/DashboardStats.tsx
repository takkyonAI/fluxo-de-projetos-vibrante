
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FolderOpen, CheckCircle, Clock, Users } from 'lucide-react';

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

interface DashboardStatsProps {
  projects: Project[];
}

const DashboardStats = ({ projects }: DashboardStatsProps) => {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.progress === 100).length;
  const inProgressProjects = projects.filter(p => p.progress > 0 && p.progress < 100).length;
  const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0);
  const completedTasks = projects.reduce((acc, project) => 
    acc + project.tasks.filter(task => task.status === 'completed').length, 0
  );
  const uniqueTeamMembers = new Set(
    projects.flatMap(project => project.team)
  ).size;

  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: 'Total de Projetos',
      value: totalProjects,
      icon: FolderOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Projetos Concluídos',
      value: completedProjects,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Em Progresso',
      value: inProgressProjects,
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Membros da Equipe',
      value: uniqueTeamMembers,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Progresso Geral dos Projetos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {completedTasks} de {totalTasks} tarefas concluídas
              </span>
              <span className="font-semibold text-blue-600">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-400">{totalTasks - completedTasks - projects.reduce((acc, project) => acc + project.tasks.filter(task => task.status === 'in-progress').length, 0)}</p>
                <p className="text-xs text-gray-600">A Fazer</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{projects.reduce((acc, project) => acc + project.tasks.filter(task => task.status === 'in-progress').length, 0)}</p>
                <p className="text-xs text-gray-600">Em Progresso</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                <p className="text-xs text-gray-600">Concluídas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
