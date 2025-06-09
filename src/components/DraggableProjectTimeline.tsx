
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import ProjectTimeline from './ProjectTimeline';
import { Project } from '@/types/project';

interface DraggableProjectTimelineProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onReorder: (reorderedProjects: Project[]) => void;
}

const DraggableProjectTimeline = ({ projects, onEditProject, onReorder }: DraggableProjectTimelineProps) => {
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="projects">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {projects.map((project, index) => (
              <Draggable key={project.id} draggableId={project.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.8 : 1,
                    }}
                  >
                    <ProjectTimeline 
                      projects={[project]} 
                      onEditProject={onEditProject} 
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableProjectTimeline;
