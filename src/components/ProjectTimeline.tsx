
import React, { useMemo, useState } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Circle, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/types/project';

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
        return 'bg-emerald-400';
      case 'in-progress':
        return 'bg-cyan-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getProjectStatus = (progress: number) => {
    if (progress === 100) return 'Concluído';
    if (progress > 0) return 'Em Progresso';
    return 'Não Iniciado';
  };

  const getProjectTimelineData = (project: Project) => {
    const today = new Date();
    const dueDate = new Date(project.dueDate);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // Start 1 month ago
    
    // Calculate project duration in weeks from start to due date
    const projectDurationWeeks = Math.ceil((dueDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const maxDurationWeeks = Math.min(projectDurationWeeks, 48); // Max 12 months (48 weeks)
    
    // Calculate weeks from current date
    const weeksFromStart = Math.floor((startDate.getTime() - new Date().getTime()) / (7 * 24 * 60 * 60 * 1000)) + 4;
    
    return {
      start: Math.max(0, weeksFromStart),
      duration: Math.max(1, maxDurationWeeks),
      dueDate,
      today
    };
  };

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="grid grid-cols-[300px_1fr] gap-4">
        <div className="font-semibold text-gray-700 dark:text-gray-300 p-4">
          <div className="text-sm text-purple-600 dark:text-purple-400 mb-2 font-bold">PROJETO</div>
          <div className="text-xs text-gray-400">Progresso | Início | Término</div>
        </div>
        <div className="grid grid-cols-12 gap-1">
          {timelineData.map((month) => (
            <div key={month.key} className="text-center">
              <div className="text-xs font-medium text-purple-700 dark:text-purple-300 p-2 border-l border-purple-200 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                {month.label}
              </div>
              <div className="grid grid-cols-4 gap-px">
                {[1, 2, 3, 4].map((week) => (
                  <div key={week} className="text-xs text-gray-400 p-1 border-l border-purple-100 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-900/10">
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
          const projectTimeline = getProjectTimelineData(project);
          const isExpanded = expandedProjects.has(project.id);
          
          return (
            <div key={project.id} className="grid grid-cols-[300px_1fr] gap-4 group">
              {/* Project Info */}
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white/90 via-purple-50/30 to-blue-50/30 dark:from-gray-900/90 dark:via-purple-900/20 dark:to-blue-900/20 border border-purple-200/50 dark:border-purple-700/30 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div 
                    className="flex items-center justify-between"
                    onClick={() => toggleProjectExpansion(project.id)}
                  >
                    <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 flex-1">
                      {project.title}
                    </CardTitle>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/40 dark:to-blue-900/40 border-purple-200 dark:border-purple-600 text-purple-700 dark:text-purple-300">
                      {getProjectStatus(project.progress)}
                    </Badge>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">{project.progress}%</span>
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="space-y-2 animate-fade-in">
                    <p className="text-xs text-gray-600 dark:text-gray-400">{project.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3 text-cyan-500" />
                        <span>{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3 text-pink-500" />
                        <span>{new Date(project.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {project.tasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center gap-2 text-xs">
                          {getStatusIcon(task.status)}
                          <span className="flex-1 truncate text-gray-700 dark:text-gray-300">{task.title}</span>
                          <Badge variant="outline" className="text-xs px-1 py-0 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/40 dark:to-blue-900/40 border-purple-200 dark:border-purple-600 text-purple-700 dark:text-purple-300">
                            {task.assignee.split(' ')[0]}
                          </Badge>
                        </div>
                      ))}
                      {project.tasks.length > 3 && (
                        <div className="text-xs text-purple-500 dark:text-purple-400 font-medium">
                          +{project.tasks.length - 3} mais tarefas
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-purple-100 dark:border-purple-800">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProject(project);
                        }}
                        className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium"
                      >
                        Editar Projeto
                      </button>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Timeline Bars - Only until project due date */}
              <div className="grid grid-cols-12 gap-1 items-center min-h-[80px]">
                {timelineData.map((month, monthIndex) => {
                  const monthDate = new Date(month.fullDate);
                  const projectDueDate = new Date(project.dueDate);
                  
                  // Don't show timeline blocks after project due date
                  if (monthDate > projectDueDate) {
                    return (
                      <div key={month.key} className="relative h-full border-l border-purple-200 dark:border-purple-700">
                        <div className="grid grid-cols-4 gap-px h-full">
                          {[1, 2, 3, 4].map((week) => (
                            <div key={week} className="h-6 border-l border-purple-100 dark:border-purple-800" />
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={month.key} className="relative h-full border-l border-purple-200 dark:border-purple-700">
                      <div className="grid grid-cols-4 gap-px h-full">
                        {[1, 2, 3, 4].map((week, weekIndex) => {
                          const weekStart = monthIndex * 4 + weekIndex;
                          const projectStart = Math.floor(projectTimeline.start);
                          const projectEnd = projectStart + Math.floor(projectTimeline.duration / 4);
                          
                          const isInProject = weekStart >= projectStart && weekStart < projectEnd;
                          const progressWeeks = Math.floor((project.progress / 100) * projectTimeline.duration);
                          const isCompleted = weekStart < projectStart + Math.floor(progressWeeks / 4);
                          
                          // Check if this week is after today for in-progress tasks
                          const weekDate = new Date(monthDate);
                          weekDate.setDate(weekDate.getDate() + (weekIndex * 7));
                          const today = new Date();
                          const isAfterToday = weekDate > today;
                          
                          let barClass = '';
                          if (isInProject) {
                            if (isCompleted) {
                              barClass = 'bg-emerald-400'; // Completed tasks in green
                            } else if (weekStart < projectStart + Math.floor(progressWeeks / 4) + 2 && !isAfterToday) {
                              barClass = 'bg-cyan-400'; // In progress, but not after today
                            } else {
                              barClass = 'bg-gray-400'; // Planned
                            }
                          }
                          
                          return (
                            <div
                              key={week}
                              className={`h-6 border-l border-purple-100 dark:border-purple-800 transition-all duration-300 hover:scale-105 ${barClass}`}
                            />
                          );
                        })}
                      </div>
                      
                      {/* Task indicators */}
                      {(isExpanded || !isExpanded) && (
                        <div className="absolute top-0 left-0 w-full h-full">
                          {project.tasks.slice(0, isExpanded ? project.tasks.length : 2).map((task, taskIndex) => {
                            const taskWeek = projectTimeline.start + (taskIndex * 2);
                            if (Math.floor(taskWeek / 4) === monthIndex) {
                              const weekPos = taskWeek % 4;
                              return (
                                <div
                                  key={task.id}
                                  className={`absolute top-1 h-3 w-3 rounded-full ${getStatusColor(task.status)} border-2 border-white dark:border-gray-900 flex items-center justify-center transition-all duration-300 hover:scale-110`}
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
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-gray-600 dark:text-gray-400 pt-4 border-t border-purple-200 dark:border-purple-700">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-400 rounded"></div>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Concluído</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cyan-400 rounded"></div>
          <span className="text-cyan-600 dark:text-cyan-400 font-medium">Em progresso</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span className="text-gray-500 font-medium">Planejado</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
