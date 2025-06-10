import React, { useState } from 'react';
import { Clock, Users, CheckCircle, Circle, AlertCircle, Plus, Edit3, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onUpdateProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
}

const ProjectCard = ({ project, onEdit, onUpdateProject, onDeleteProject }: ProjectCardProps) => {
  const [isManagingTasks, setIsManagingTasks] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', assignees: [] as string[], status: 'todo' as const, dueDate: '' });
  const [localProject, setLocalProject] = useState(project);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const addTask = () => {
    if (newTask.title && newTask.assignees.length > 0) {
      const task = {
        id: Date.now().toString(),
        ...newTask
      };
      const updatedProject = {
        ...localProject,
        tasks: [...localProject.tasks, task]
      };
      
      // Recalcular progresso
      const completedTasks = updatedProject.tasks.filter(t => t.status === 'completed').length;
      updatedProject.progress = updatedProject.tasks.length > 0 ? 
        Math.round((completedTasks / updatedProject.tasks.length) * 100) : 0;
      
      setLocalProject(updatedProject);
      onUpdateProject?.(updatedProject);
      setNewTask({ title: '', assignees: [], status: 'todo', dueDate: '' });
    }
  };

  const updateTaskStatus = (taskId: string, status: 'todo' | 'in-progress' | 'completed') => {
    const updatedProject = {
      ...localProject,
      tasks: localProject.tasks.map(task => 
        task.id === taskId ? { 
          ...task, 
          status,
          completedAt: status === 'completed' ? new Date().toISOString() : undefined
        } : task
      )
    };
    
    // Recalcular progresso
    const completedTasks = updatedProject.tasks.filter(t => t.status === 'completed').length;
    updatedProject.progress = updatedProject.tasks.length > 0 ? 
      Math.round((completedTasks / updatedProject.tasks.length) * 100) : 0;
    
    setLocalProject(updatedProject);
    onUpdateProject?.(updatedProject);
  };

  const completedTasks = localProject.tasks.filter(task => task.status === 'completed').length;
  const totalTasks = localProject.tasks.length;

  return (
    <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white/90 via-blue-50/60 to-purple-50/40 dark:from-gray-800/90 dark:via-purple-900/20 dark:to-blue-900/20 border border-blue-200/50 hover:border-purple-300/60 dark:border-purple-700/30 dark:hover:border-purple-500/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle 
            className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors cursor-pointer"
            onClick={() => onEdit(localProject)}
          >
            {localProject.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/40 dark:to-purple-900/40 border-purple-200 dark:border-purple-600 text-purple-700 dark:text-purple-300">
              {localProject.progress}% concluído
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsManagingTasks(!isManagingTasks);
              }}
              className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/50"
            >
              <Edit3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/50"
                >
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Projeto</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o projeto "{localProject.title}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDeleteProject?.(localProject.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2" onClick={() => onEdit(localProject)}>{localProject.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2" onClick={() => onEdit(localProject)}>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progresso</span>
            <span className="font-medium text-purple-700 dark:text-purple-300">{completedTasks}/{totalTasks} tarefas</span>
          </div>
          <Progress value={localProject.progress} className="h-2 bg-gray-100 dark:bg-gray-700" />
        </div>

        {isManagingTasks && (
          <div className="space-y-3 pt-3 border-t border-purple-100 dark:border-purple-800">
            <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300">Gerenciar Etapas</h4>
            
            {/* Nova tarefa */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Nome da etapa"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="text-sm dark:bg-gray-800/50 dark:border-gray-600"
                />
                <Input
                  type="date"
                  placeholder="Prazo"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="text-sm dark:bg-gray-800/50 dark:border-gray-600"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Responsáveis (separados por vírgula)"
                  value={newTask.assignees.join(', ')}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assignees: e.target.value.split(',').map(a => a.trim()).filter(a => a) }))}
                  className="text-sm flex-1 dark:bg-gray-800/50 dark:border-gray-600"
                />
                <Select value={newTask.status} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="w-32 text-sm dark:bg-gray-800/50 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">A Fazer</SelectItem>
                    <SelectItem value="in-progress">Em Progresso</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addTask} size="sm" className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Lista de tarefas */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {localProject.tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between p-3 bg-purple-50/80 dark:bg-purple-900/30 rounded-lg border border-purple-100 dark:border-purple-800"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium dark:text-gray-200">{task.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{task.assignees.join(', ')}</p>
                      {task.dueDate && (
                        <p className="text-xs text-orange-500 dark:text-orange-400">Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</p>
                      )}
                      {task.status === 'completed' && task.completedAt && (
                        <p className="text-xs text-emerald-500 dark:text-emerald-400">Concluído em: {new Date(task.completedAt).toLocaleDateString('pt-BR')}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1 bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newStatus = task.status === 'todo' ? 'in-progress' : 
                                        task.status === 'in-progress' ? 'completed' : 'todo';
                        updateTaskStatus(task.id, newStatus);
                      }}
                    >
                      {task.status === 'todo' ? '▶️ Iniciar' : 
                       task.status === 'in-progress' ? '✅ Concluir' : '🔄 Reiniciar'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700" onClick={() => onEdit(localProject)}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{localProject.dueDate}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <div className="flex -space-x-2">
              {localProject.team.slice(0, 3).map((member, index) => (
                <div
                  key={index}
                  className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white dark:border-gray-800"
                >
                  {member.charAt(0).toUpperCase()}
                </div>
              ))}
              {localProject.team.length > 3 && (
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 font-medium border-2 border-white dark:border-gray-800">
                  +{localProject.team.length - 3}
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
