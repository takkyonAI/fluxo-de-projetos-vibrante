
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, CheckCircle, Circle, AlertCircle } from 'lucide-react';

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

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>) => void;
  project?: Project;
}

const ProjectModal = ({ open, onClose, onSave, project }: ProjectModalProps) => {
  // Resetar dados quando abrir modal para novo projeto
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    tasks: [] as Task[],
    team: [] as string[]
  });

  const [newTask, setNewTask] = useState({ title: '', assignee: '', status: 'todo' as const });
  const [newMember, setNewMember] = useState('');
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  // Atualizar dados quando project mudar
  React.useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        dueDate: project.dueDate,
        tasks: project.tasks,
        team: project.team
      });
    } else {
      // Limpar campos para novo projeto
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        tasks: [],
        team: []
      });
    }
  }, [project, open]);

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

  // Filtrar membros da equipe baseado no que o usuário está digitando
  const filteredTeamMembers = formData.team.filter(member =>
    member.toLowerCase().includes(newTask.assignee.toLowerCase())
  );

  const handleAssigneeChange = (value: string) => {
    setNewTask(prev => ({ ...prev, assignee: value }));
    setShowAssigneeDropdown(value.length > 0 && filteredTeamMembers.length > 0);
  };

  const selectAssignee = (member: string) => {
    setNewTask(prev => ({ ...prev, assignee: member }));
    setShowAssigneeDropdown(false);
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
              <Label>Equipe</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="Nome do membro"
                />
                <Button onClick={addTeamMember} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
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
