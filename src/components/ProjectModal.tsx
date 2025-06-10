import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, X, CheckCircle, Circle, AlertCircle, ChevronDown, Users } from 'lucide-react';
import { Task, Project } from '@/types/project';

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>) => void;
  project?: Project;
  allProjects?: Project[];
}

const ProjectModal = ({ open, onClose, onSave, project, allProjects = [] }: ProjectModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 3,
    tasks: [] as Task[],
    team: [] as string[]
  });

  const [newTask, setNewTask] = useState({ title: '', assignees: [] as string[], status: 'todo' as const, dueDate: '' });
  const [newMember, setNewMember] = useState('');
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const [taskAssigneeDropdownOpen, setTaskAssigneeDropdownOpen] = useState(false);

  const getAllUniqueMembers = () => {
    const allMembers = new Set<string>();
    allProjects.forEach(proj => {
      proj.team.forEach(member => allMembers.add(member));
    });
    return Array.from(allMembers).sort();
  };

  const allUniqueMembers = getAllUniqueMembers();

  React.useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        dueDate: project.dueDate,
        priority: project.priority || 3,
        tasks: project.tasks,
        team: project.team
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 3,
        tasks: [],
        team: []
      });
    }
  }, [project, open]);

  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 1: return '🔴';
      case 2: return '🟠';
      case 3: return '🟡';
      case 4: return '🔵';
      case 5: return '⚪';
      default: return '🟡';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Muito Alta';
      case 2: return 'Alta';
      case 3: return 'Média';
      case 4: return 'Baixa';
      case 5: return 'Muito Baixa';
      default: return 'Média';
    }
  };

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

  const addTask = () => {
    if (newTask.title && newTask.assignees.length > 0) {
      const task = {
        id: Date.now().toString(),
        ...newTask
      };
      setFormData(prev => ({
        ...prev,
        tasks: [...prev.tasks, task]
      }));
      setNewTask({ title: '', assignees: [], status: 'todo', dueDate: '' });
      setTaskAssigneeDropdownOpen(false);
    }
  };

  const removeTask = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }));
  };

  const addTeamMember = () => {
    if (newMember && !formData.team.includes(newMember)) {
      setFormData(prev => ({
        ...prev,
        team: [...prev.team, newMember]
      }));
      setNewMember('');
    }
  };

  const toggleTeamMember = (member: string) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.includes(member)
        ? prev.team.filter(m => m !== member)
        : [...prev.team, member]
    }));
  };

  const toggleTaskAssignee = (member: string) => {
    setNewTask(prev => ({
      ...prev,
      assignees: prev.assignees.includes(member)
        ? prev.assignees.filter(m => m !== member)
        : [...prev.assignees, member]
    }));
  };

  const removeMember = (member: string) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter(m => m !== member)
    }));
  };

  const removeTaskAssignee = (member: string) => {
    setNewTask(prev => ({
      ...prev,
      assignees: prev.assignees.filter(m => m !== member)
    }));
  };

  const handleSave = () => {
    const completedTasks = formData.tasks.filter(task => task.status === 'completed').length;
    const progress = formData.tasks.length > 0 ? Math.round((completedTasks / formData.tasks.length) * 100) : 0;
    
    onSave({
      ...formData,
      progress
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {project ? 'Editar Projeto' : 'Novo Projeto'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Projeto</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Digite o título do projeto"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o projeto"
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate">Data de Entrega</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={formData.priority.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: parseInt(value) }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">🔴 Muito Alta (1)</SelectItem>
                    <SelectItem value="2">🟠 Alta (2)</SelectItem>
                    <SelectItem value="3">🟡 Média (3)</SelectItem>
                    <SelectItem value="4">🔵 Baixa (4)</SelectItem>
                    <SelectItem value="5">⚪ Muito Baixa (5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Equipe</Label>
              <div className="space-y-3 mt-1">
                <div className="flex gap-2">
                  <Input
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    placeholder="Nome do novo membro"
                    className="flex-1"
                  />
                  <Button onClick={addTeamMember} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {allUniqueMembers.length > 0 && (
                  <div>
                    <Popover open={teamDropdownOpen} onOpenChange={setTeamDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Selecionar membros existentes ({formData.team.length} selecionados)
                          </div>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar membros..." />
                          <CommandList>
                            <CommandEmpty>Nenhum membro encontrado.</CommandEmpty>
                            <CommandGroup>
                              <ScrollArea className="h-40">
                                {allUniqueMembers.map((member) => (
                                  <CommandItem key={member} className="flex items-center space-x-2">
                                    <Checkbox
                                      checked={formData.team.includes(member)}
                                      onCheckedChange={() => toggleTeamMember(member)}
                                    />
                                    <span className="flex-1">{member}</span>
                                  </CommandItem>
                                ))}
                              </ScrollArea>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {formData.team.map((member) => (
                    <Badge key={member} variant="secondary" className="flex items-center gap-1">
                      {member}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeMember(member)} />
                    </Badge>
                  ))}
                </div>

                {allUniqueMembers.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {allUniqueMembers.length} membros disponíveis de outros projetos
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Tarefas</Label>
              <div className="space-y-2 mt-2">
                <div className="grid grid-cols-12 gap-2">
                  <Input
                    className="col-span-3"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título da tarefa"
                  />
                  <Input
                    className="col-span-2"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    placeholder="Prazo"
                  />
                  <div className="col-span-3">
                    <Popover open={taskAssigneeDropdownOpen} onOpenChange={setTaskAssigneeDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between text-sm">
                          <span className="truncate">
                            {newTask.assignees.length === 0 
                              ? 'Responsáveis' 
                              : `${newTask.assignees.length} selecionado${newTask.assignees.length > 1 ? 's' : ''}`
                            }
                          </span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar membros..." />
                          <CommandList>
                            <CommandEmpty>Nenhum membro encontrado.</CommandEmpty>
                            <CommandGroup>
                              <ScrollArea className="h-32">
                                {formData.team.map((member) => (
                                  <CommandItem key={member} className="flex items-center space-x-2">
                                    <Checkbox
                                      checked={newTask.assignees.includes(member)}
                                      onCheckedChange={() => toggleTaskAssignee(member)}
                                    />
                                    <span className="flex-1">{member}</span>
                                  </CommandItem>
                                ))}
                              </ScrollArea>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Select value={newTask.status} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">A Fazer</SelectItem>
                      <SelectItem value="in-progress">Em Progresso</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addTask} size="sm" className="col-span-1">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {newTask.assignees.length > 0 && (
                  <div className="flex flex-wrap gap-1 px-2">
                    {newTask.assignees.map((assignee) => (
                      <Badge key={assignee} variant="outline" className="text-xs flex items-center gap-1">
                        {assignee}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeTaskAssignee(assignee)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Label className="mb-2 block">Tarefas</Label>
                <div className="space-y-2">
                  {formData.tasks.map((task, idx) => (
                    <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(task.status)}
                        <div>
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs px-2 py-1 bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-800"
                          onClick={() => {
                            setFormData(prev => {
                              const newTasks = prev.tasks.map((t, i) => {
                                if (i !== idx) return t;
                                let newStatus: 'todo' | 'in-progress' | 'completed' = t.status === 'todo' ? 'in-progress' : t.status === 'in-progress' ? 'completed' : 'todo';
                                let completedAt = t.completedAt;
                                if (newStatus === 'completed') completedAt = new Date().toISOString();
                                if (t.status === 'completed' && newStatus !== 'completed') completedAt = undefined;
                                return { ...t, status: newStatus, completedAt };
                              });
                              return { ...prev, tasks: newTasks };
                            });
                          }}
                        >
                          {task.status === 'todo' ? '▶️ Iniciar' : task.status === 'in-progress' ? '✅ Concluir' : '🔄 Reiniciar'}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)}>
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {project ? 'Atualizar' : 'Criar'} Projeto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
