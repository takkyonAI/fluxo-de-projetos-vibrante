
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, CheckCircle, Circle, AlertCircle } from 'lucide-react';
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

  const [newTask, setNewTask] = useState({ title: '', assignee: '', status: 'todo' as const });
  const [newMember, setNewMember] = useState('');
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);

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
    if (newTask.title && newTask.assignee) {
      const task = {
        id: Date.now().toString(),
        ...newTask
      };
      setFormData(prev => ({
        ...prev,
        tasks: [...prev.tasks, task]
      }));
      setNewTask({ title: '', assignee: '', status: 'todo' });
      setShowAssigneeDropdown(false);
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
      setShowMemberDropdown(false);
    }
  };

  const removeMember = (member: string) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter(m => m !== member)
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

  const filteredTeamMembers = formData.team.filter(member =>
    member.toLowerCase().includes(newTask.assignee.toLowerCase())
  );

  const filteredUniqueMembers = allUniqueMembers.filter(member =>
    member.toLowerCase().includes(newMember.toLowerCase()) && 
    !formData.team.includes(member)
  );

  const handleAssigneeChange = (value: string) => {
    setNewTask(prev => ({ ...prev, assignee: value }));
    setShowAssigneeDropdown(value.length > 0 && filteredTeamMembers.length > 0);
  };

  const handleMemberChange = (value: string) => {
    setNewMember(value);
    setShowMemberDropdown(value.length > 0 && filteredUniqueMembers.length > 0);
  };

  const selectAssignee = (member: string) => {
    setNewTask(prev => ({ ...prev, assignee: member }));
    setShowAssigneeDropdown(false);
  };

  const selectMember = (member: string) => {
    setNewMember(member);
    setShowMemberDropdown(false);
    setTimeout(() => {
      addTeamMember();
    }, 0);
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
              <div className="flex gap-2 mt-1">
                <div className="flex-1 relative">
                  <Input
                    value={newMember}
                    onChange={(e) => handleMemberChange(e.target.value)}
                    placeholder="Nome do membro (digite para ver sugestões)"
                    onFocus={() => setShowMemberDropdown(newMember.length > 0 && filteredUniqueMembers.length > 0)}
                  />
                  {showMemberDropdown && filteredUniqueMembers.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto">
                      {filteredUniqueMembers.map((member) => (
                        <div
                          key={member}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                          onClick={() => selectMember(member)}
                        >
                          {member}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button onClick={addTeamMember} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {allUniqueMembers.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {allUniqueMembers.length} membros disponíveis de outros projetos
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.team.map((member) => (
                  <Badge key={member} variant="secondary" className="flex items-center gap-1">
                    {member}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeMember(member)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Tarefas</Label>
              <div className="space-y-2 mt-2">
                <div className="grid grid-cols-12 gap-2">
                  <Input
                    className="col-span-5"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título da tarefa"
                  />
                  <div className="col-span-4 relative">
                    <Input
                      value={newTask.assignee}
                      onChange={(e) => handleAssigneeChange(e.target.value)}
                      placeholder="Responsável"
                      onFocus={() => setShowAssigneeDropdown(newTask.assignee.length > 0 && filteredTeamMembers.length > 0)}
                    />
                    {showAssigneeDropdown && filteredTeamMembers.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto">
                        {filteredTeamMembers.map((member) => (
                          <div
                            key={member}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => selectAssignee(member)}
                          >
                            {member}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Select value={newTask.status} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="col-span-2">
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
              </div>

              <div className="space-y-2 mt-4 max-h-60 overflow-y-auto">
                {formData.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-gray-600">Responsável: {task.assignee}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeTask(task.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
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
