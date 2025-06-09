
import React from 'react';
import { Clock, Users, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
  const totalTasks = project.tasks.length;

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-blue-50/50 border border-blue-100">
      <CardHeader className="pb-3" onClick={onClick}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {project.title}
          </CardTitle>
          <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
            {project.progress}% concluído
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-2">{project.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4" onClick={onClick}>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progresso</span>
            <span className="font-medium">{completedTasks}/{totalTasks} tarefas</span>
          </div>
          <Progress value={project.progress} className="h-2 bg-gray-100" />
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{project.dueDate}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <div className="flex -space-x-2">
              {project.team.slice(0, 3).map((member, index) => (
                <div
                  key={index}
                  className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white"
                >
                  {member.charAt(0).toUpperCase()}
                </div>
              ))}
              {project.team.length > 3 && (
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600 font-medium border-2 border-white">
                  +{project.team.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
