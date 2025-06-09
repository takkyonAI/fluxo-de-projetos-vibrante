
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter } from 'lucide-react';
import { ProjectFilters, Project } from '@/types/project';

interface ProjectFiltersProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  projects: Project[];
}

const ProjectFiltersComponent = ({ filters, onFiltersChange, projects }: ProjectFiltersProps) => {
  const allTeamMembers = Array.from(
    new Set(projects.flatMap(project => project.team))
  ).sort();

  const handleFilterChange = (key: keyof ProjectFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-600" />
        <h3 className="font-medium text-gray-900">Filtros</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="deadline-filter">Prazo</Label>
          <Select value={filters.deadline} onValueChange={(value) => handleFilterChange('deadline', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="overdue">Atrasados</SelectItem>
              <SelectItem value="this-week">Esta semana</SelectItem>
              <SelectItem value="this-month">Este mês</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority-filter">Prioridade</Label>
          <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="1">🔴 Muito Alta (1)</SelectItem>
              <SelectItem value="2">🟠 Alta (2)</SelectItem>
              <SelectItem value="3">🟡 Média (3)</SelectItem>
              <SelectItem value="4">🔵 Baixa (4)</SelectItem>
              <SelectItem value="5">⚪ Muito Baixa (5)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="completion-filter">Progresso</Label>
          <Select value={filters.completion} onValueChange={(value) => handleFilterChange('completion', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="not-started">Não iniciados</SelectItem>
              <SelectItem value="in-progress">Em progresso</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="team-member-filter">Membro da Equipe</Label>
          <Select value={filters.teamMember} onValueChange={(value) => handleFilterChange('teamMember', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar membro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {allTeamMembers.map((member) => (
                <SelectItem key={member} value={member}>
                  {member}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProjectFiltersComponent;
