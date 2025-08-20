"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useClipboard } from "@/contexts/clipboard-context";
import type { ClipboardItem, ClipboardItemType, DropZoneInfo } from "@/lib/types";

interface DragDropWrapperProps {
  children: React.ReactNode;
  item: {
    id: string;
    type: ClipboardItemType;
    data: any;
    name?: string;
  };
  sourceId?: string;
  className?: string;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

interface DropZoneProps {
  children: React.ReactNode;
  dropZone: DropZoneInfo;
  onDrop: (item: ClipboardItem, targetId: string, targetType: ClipboardItemType) => void;
  className?: string;
  disabled?: boolean;
}

// Draggable wrapper component
export function DragDropWrapper({
  children,
  item,
  sourceId,
  className,
  draggable = true,
  onDragStart,
  onDragEnd,
}: DragDropWrapperProps) {
  const { isItemCut } = useClipboard();
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable) return;

    setIsDragging(true);
    onDragStart?.();

    // Set drag data
    const dragData = {
      id: item.id,
      type: item.type,
      data: item.data,
      sourceId,
      operation: 'cut', // Drag is always a move operation
      timestamp: Date.now(),
    };

    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';

    // Add visual feedback
    if (e.dataTransfer.setDragImage) {
      const dragImage = document.createElement('div');
      dragImage.className = 'bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg';
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      dragImage.textContent = `${getItemTypeLabel(item.type)}: ${item.name || item.id}`;
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  const isCut = isItemCut(item.id);

  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        draggable && "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 scale-95 transition-all",
        isCut && "opacity-50",
        className
      )}
      data-clipboard-item={JSON.stringify({ id: item.id, type: item.type, data: item.data, sourceId })}
    >
      {children}
    </div>
  );
}

// Drop zone component
export function DropZone({
  children,
  dropZone,
  onDrop,
  className,
  disabled = false,
}: DropZoneProps) {
  const { validateCopyMove } = useClipboard();
  const [isOver, setIsOver] = React.useState(false);
  const [canDrop, setCanDrop] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;

    e.preventDefault();
    e.stopPropagation();

    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (dragData) {
        const validation = validateCopyMove(dragData.type, dropZone.type);
        setCanDrop(validation.allowed && dropZone.accepts.includes(dragData.type));
        e.dataTransfer.dropEffect = validation.allowed ? 'move' : 'none';
      }
    } catch (error) {
      setCanDrop(false);
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Only set isOver to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsOver(false);
      setCanDrop(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return;

    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    setCanDrop(false);

    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (dragData) {
        const validation = validateCopyMove(dragData.type, dropZone.type);
        if (validation.allowed && dropZone.accepts.includes(dragData.type)) {
          onDrop(dragData, dropZone.id, dropZone.type);
        }
      }
    } catch (error) {
      console.error('Failed to process drop:', error);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "transition-all duration-200",
        isOver && canDrop && "bg-primary/10 border-2 border-primary/30 border-dashed",
        isOver && !canDrop && "bg-destructive/10 border-2 border-destructive/30 border-dashed",
        className
      )}
      data-paste-target={JSON.stringify({ id: dropZone.id, type: dropZone.type })}
    >
      {children}
      
      {/* Drop indicator */}
      {isOver && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center pointer-events-none z-10",
          canDrop ? "bg-primary/5" : "bg-destructive/5"
        )}>
          <div className={cn(
            "px-4 py-2 rounded-lg shadow-lg font-medium",
            canDrop 
              ? "bg-primary text-primary-foreground" 
              : "bg-destructive text-destructive-foreground"
          )}>
            {canDrop 
              ? `Перенести в ${getItemTypeLabel(dropZone.type).toLowerCase()}` 
              : 'Нельзя перенести сюда'
            }
          </div>
        </div>
      )}
    </div>
  );
}

function getItemTypeLabel(type: ClipboardItemType): string {
  switch (type) {
    case 'campaign':
      return 'Кампания';
    case 'scenario':
      return 'Сценарий';
    case 'communication':
      return 'Коммуникация';
    case 'ab_test':
      return 'A/B тест';
    case 'ab_variant':
      return 'Вариант';
    default:
      return 'Элемент';
  }
}

// Helper hook for managing drag and drop state
export function useDragDropState() {
  const [draggedItem, setDraggedItem] = React.useState<ClipboardItem | null>(null);
  const [dropTarget, setDropTarget] = React.useState<DropZoneInfo | null>(null);

  const startDrag = React.useCallback((item: ClipboardItem) => {
    setDraggedItem(item);
  }, []);

  const endDrag = React.useCallback(() => {
    setDraggedItem(null);
    setDropTarget(null);
  }, []);

  const setDrop = React.useCallback((target: DropZoneInfo) => {
    setDropTarget(target);
  }, []);

  return {
    draggedItem,
    dropTarget,
    startDrag,
    endDrag,
    setDrop,
    isDragging: !!draggedItem,
  };
}
