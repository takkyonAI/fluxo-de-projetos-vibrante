
import { useState, useMemo } from 'react';
import { Project, ProjectFilters } from '@/types/project';

const useProjectFilters = (projects: Project[]) => {
  const [filters, setFilters] = useState<ProjectFilters>({
    deadline: 'all',
    priority: 'all',
    completion: 'all',
    teamMember: ''
  });

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Filter by deadline
      if (filters.deadline !== 'all') {
        const now = new Date();
        const dueDate = new Date(project.dueDate);
        
        switch (filters.deadline) {
          case 'overdue':
            if (dueDate >= now) return false;
            break;
          case 'this-week':
            const weekFromNow = new Date();
            weekFromNow.setDate(now.getDate() + 7);
            if (dueDate < now || dueDate > weekFromNow) return false;
            break;
          case 'this-month':
            const monthFromNow = new Date();
            monthFromNow.setMonth(now.getMonth() + 1);
            if (dueDate < now || dueDate > monthFromNow) return false;
            break;
        }
      }

      // Filter by priority
      if (filters.priority !== 'all' && project.priority.toString() !== filters.priority) {
        return false;
      }

      // Filter by completion
      if (filters.completion !== 'all') {
        switch (filters.completion) {
          case 'not-started':
            if (project.progress !== 0) return false;
            break;
          case 'in-progress':
            if (project.progress === 0 || project.progress === 100) return false;
            break;
          case 'completed':
            if (project.progress !== 100) return false;
            break;
        }
      }

      // Filter by team member
      if (filters.teamMember && !project.team.includes(filters.teamMember)) {
        return false;
      }

      return true;
    });
  }, [projects, filters]);

  return {
    filters,
    setFilters,
    filteredProjects
  };
};

export default useProjectFilters;
