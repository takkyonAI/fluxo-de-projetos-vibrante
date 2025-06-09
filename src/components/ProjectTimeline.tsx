
import React, { useMemo, useState } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Circle, ChevronDown, ChevronRight } from 'lucide-react';
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
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

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

  const toggleProjectExpansion = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-emerald-400" />;
      case 'in-progress':
        return <AlertCircle className="w-3 h-3 text-cyan-400" />;
      default:
        return <Circle className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-emerald-400 to-teal-400';
      case 'in-progress':
        return 'bg-gradient-to-r from-cyan-400 to-blue-500';
      default:
        return 'bg-gradient-to-r from-gray-300 to-gray-400';
    }
  };

  const getProjectStatus = (progress: number) => {
    if (progress === 100) return 'Concluído';
    if (progress > 0) return 'Em Progresso';
    return 'Não Iniciado';
  };

  const getProjectPosition = (project: Project) => {
    const dueDate = new Date(project.dueDate);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2);
    
    const duration = 6;
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
          <div className="text-sm text-purple-600 mb-2 font-bold">PROJETO</div>
          <div className="text-xs text-gray-400">Progresso | Início | Término</div>
        </div>
        <div className="grid grid-cols-12 gap-1">
          {timelineData.map((month) => (
            <div key={month.key} className="text-center">
              <div className="text-xs font-medium text-purple-700 p-2 border-l border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                {month.label}
              </div>
              <div className="grid grid-cols-4 gap-px">
                {[1, 2, 3, 4].map((week) => (
                  <div key={week} className="text-xs text-gray-400 p-1 border-l border-purple-100 bg-purple-50/30">
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
          const isExpanded = expandedProjects.has(project.id);
          
          return (
            <div key={project.id} className="grid grid-cols-[300px_1fr] gap-4 group">
              {/* Project Info - Compact or Expanded */}
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 border border-purple-200/50">
                <CardHeader className="pb-2">
                  <div 
                    className="flex items-center justify-between"
                    onClick={() => toggleProjectExpansion(project.id)}
                  >
                    <CardTitle className="text-sm font-medium text-gray-800 group-hover:text-purple-600 flex-1">
                      {project.title}
                    </CardTitle>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-purple-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  
                  {/* Status always visible */}
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-700">
                      {getProjectStatus(project.progress)}
                    </Badge>
                    <span className="text-purple-600 font-bold">{project.progress}%</span>
                  </div>
                </CardHeader>
                
                {/* Expanded Content */}
                {isExpanded && (
                  <CardContent className="space-y-2 animate-fade-in">
                    <p className="text-xs text-gray-600">{project.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-3 h-3 text-cyan-500" />
                        <span>{new Date(startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3 text-pink-500" />
                        <span>{new Date(project.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {project.tasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center gap-2 text-xs">
                          {getStatusIcon(task.status)}
                          <span className="flex-1 truncate">{task.title}</span>
                          <Badge variant="outline" className="text-xs px-1 py-0 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                            {task.assignee.split(' ')[0]}
                          </Badge>
                        </div>
                      ))}
                      {project.tasks.length > 3 && (
                        <div className="text-xs text-purple-500 font-medium">
                          +{project.tasks.length - 3} mais tarefas
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-purple-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProject(project);
                        }}
                        className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Editar Projeto
                      </button>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Timeline Bars */}
              <div className="grid grid-cols-12 gap-1 items-center min-h-[80px]">
                {timelineData.map((month, monthIndex) => (
                  <div key={month.key} className="relative h-full border-l border-purple-200">
                    <div className="grid grid-cols-4 gap-px h-full">
                      {[1, 2, 3, 4].map((week, weekIndex) => {
                        const weekStart = monthIndex * 4 + weekIndex;
                        const projectStart = Math.floor(projectPos.start * 4);
                        const projectEnd = projectStart + (projectPos.duration * 4);
                        
                        const isInProject = weekStart >= projectStart && weekStart < projectEnd;
                        const progressWeeks = Math.floor((project.progress / 100) * (projectPos.duration * 4));
                        const isCompleted = weekStart < projectStart + progressWeeks;
                        
                        let barClass = '';
                        if (isInProject) {
                          if (isCompleted) {
                            barClass = 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200';
                          } else if (weekStart < projectStart + progressWeeks + 2) {
                            barClass = 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-200';
                          } else {
                            barClass = 'bg-gradient-to-r from-gray-300 to-gray-400 shadow-sm';
                          }
                        }
                        
                        return (
                          <div
                            key={week}
                            className={`h-6 border-l border-purple-100 transition-all duration-300 hover:scale-105 ${barClass}`}
                          />
                        );
                      })}
                    </div>
                    
                    {/* Task indicators - only show if expanded or limited view */}
                    {(isExpanded || !isExpanded) && (
                      <div className="absolute top-0 left-0 w-full h-full">
                        {project.tasks.slice(0, isExpanded ? project.tasks.length : 2).map((task, taskIndex) => {
                          const taskWeek = projectPos.start * 4 + (taskIndex * 2);
                          if (Math.floor(taskWeek / 4) === monthIndex) {
                            const weekPos = taskWeek % 4;
                            return (
                              <div
                                key={task.id}
                                className={`absolute top-1 h-3 w-3 rounded-full ${getStatusColor(task.status)} border-2 border-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110`}
                                style={{ left: `${weekPos * 25}%` }}
                                title={`${task.title} - ${task.assignee}`}
                              >
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-gray-600 pt-4 border-t border-purple-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded shadow-lg"></div>
          <span className="text-emerald-600 font-medium">Concluído</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded shadow-lg"></div>
          <span className="text-cyan-600 font-medium">Em progresso</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded"></div>
          <span className="text-gray-500 font-medium">Planejado</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
