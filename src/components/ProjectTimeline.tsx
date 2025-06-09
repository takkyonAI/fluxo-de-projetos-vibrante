
import React, { useMemo } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface ProjectTimelineProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
}

const ProjectTimeline = ({ projects, onEditProject }: ProjectTimelineProps) => {
  const timelineData = useMemo(() => {
    const months = [];
    const currentDate = new Date();
    
    // Generate next 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      months.push({
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        fullDate: date
      });
    }

    return months;
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'in-progress':
        return <AlertCircle className="w-3 h-3 text-orange-500" />;
      default:
        return <Circle className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-200';
      case 'in-progress':
        return 'bg-orange-200';
      default:
        return 'bg-gray-200';
    }
  };

  const getProjectPosition = (project: Project) => {
    const dueDate = new Date(project.dueDate);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2); // Start 2 months ago
    
    const duration = 6; // 6 months duration
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration);

    return {
      start: Math.max(0, Math.min(11, Math.floor((startDate.getTime() - new Date().getTime()) / (30 * 24 * 60 * 60 * 1000)) + 2)),
      duration: Math.min(6, Math.max(1, duration))
    };
  };

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="grid grid-cols-[300px_1fr] gap-4">
        <div className="font-semibold text-gray-700 p-4">
          <div className="text-sm text-gray-500 mb-2">PROJETO</div>
          <div className="text-xs text-gray-400">Progresso | Início | Término</div>
        </div>
        <div className="grid grid-cols-12 gap-1">
          {timelineData.map((month) => (
            <div key={month.key} className="text-center">
              <div className="text-xs font-medium text-gray-600 p-2 border-l border-gray-200">
                {month.label}
              </div>
              <div className="grid grid-cols-4 gap-px">
                {[1, 2, 3, 4].map((week) => (
                  <div key={week} className="text-xs text-gray-400 p-1 border-l border-gray-100">
                    w{week}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Timeline */}
      <div className="space-y-4">
        {projects.map((project) => {
          const projectPos = getProjectPosition(project);
          const startDate = new Date(project.dueDate);
          startDate.setMonth(startDate.getMonth() - 3);
          
          return (
            <div key={project.id} className="grid grid-cols-[300px_1fr] gap-4 group">
              {/* Project Info */}
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onEditProject(project)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800 group-hover:text-blue-600">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{project.progress}%</span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(project.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {project.tasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-center gap-2 text-xs">
                        {getStatusIcon(task.status)}
                        <span className="flex-1 truncate">{task.title}</span>
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {task.assignee.split(' ')[0]}
                        </Badge>
                      </div>
                    ))}
                    {project.tasks.length > 3 && (
                      <div className="text-xs text-gray-400">
                        +{project.tasks.length - 3} mais tarefas
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Bars */}
              <div className="grid grid-cols-12 gap-1 items-center min-h-[120px]">
                {timelineData.map((month, monthIndex) => (
                  <div key={month.key} className="relative h-full border-l border-gray-200">
                    <div className="grid grid-cols-4 gap-px h-full">
                      {[1, 2, 3, 4].map((week, weekIndex) => {
                        const weekStart = monthIndex * 4 + weekIndex;
                        const projectStart = Math.floor(projectPos.start * 4);
                        const projectEnd = projectStart + (projectPos.duration * 4);
                        
                        const isInProject = weekStart >= projectStart && weekStart < projectEnd;
                        const progressWeeks = Math.floor((project.progress / 100) * (projectPos.duration * 4));
                        const isCompleted = weekStart < projectStart + progressWeeks;
                        
                        return (
                          <div
                            key={week}
                            className={`h-8 border-l border-gray-100 ${
                              isInProject
                                ? isCompleted
                                  ? 'bg-green-200'
                                  : weekStart < projectStart + progressWeeks + 2
                                  ? 'bg-orange-200'
                                  : 'bg-gray-200'
                                : ''
                            }`}
                          />
                        );
                      })}
                    </div>
                    
                    {/* Task indicators */}
                    <div className="absolute top-0 left-0 w-full h-full">
                      {project.tasks.map((task, taskIndex) => {
                        const taskWeek = projectPos.start * 4 + (taskIndex * 2);
                        if (Math.floor(taskWeek / 4) === monthIndex) {
                          const weekPos = taskWeek % 4;
                          return (
                            <div
                              key={task.id}
                              className={`absolute top-2 h-4 w-4 rounded-sm ${getStatusColor(task.status)} border border-white flex items-center justify-center`}
                              style={{ left: `${weekPos * 25}%` }}
                              title={`${task.title} - ${task.assignee}`}
                            >
                              {getStatusIcon(task.status)}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-gray-600 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 rounded"></div>
          <span>Concluído</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-200 rounded"></div>
          <span>Em progresso</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span>Planejado</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
