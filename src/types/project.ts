export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignees: string[];
  assignee?: string; // Tornando opcional para compatibilidade
  dueDate?: string; // Nova propriedade para prazo final da tarefa
  completedAt?: string; // Data de conclusão da tarefa
}

export interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  tasks: Task[];
  team: string[];
  priority: number;
}

export interface ProjectFilters {
  deadline: 'all' | 'overdue' | 'this-week' | 'this-month';
  priority: 'all' | '1' | '2' | '3' | '4' | '5';
  completion: 'all' | 'not-started' | 'in-progress' | 'completed';
  teamMember: string;
}
