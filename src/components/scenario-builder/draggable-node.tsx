import React from "react";
import * as Icons from "lucide-react";
import { Card } from "@/components/ui/card";

interface DraggableNodeProps {
  type: string;
  subtype: string;
  name: string;
  icon: string;
  description: string;
}

export function DraggableNode({ type, subtype, name, icon, description }: DraggableNodeProps) {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type, subtype, name, icon, description })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  // Динамический импорт иконки
  const Icon = (Icons as any)[icon] || Icons.Circle;

  return (
    <Card
      className="p-3 cursor-move hover:shadow-md transition-shadow"
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex items-center gap-3">
        <div className={`
          p-2 rounded-lg
          ${type === 'trigger' ? 'bg-blue-100 dark:bg-blue-900' : ''}
          ${type === 'action' ? 'bg-green-100 dark:bg-green-900' : ''}
          ${type === 'logic' ? 'bg-purple-100 dark:bg-purple-900' : ''}
        `}>
          <Icon className={`
            h-4 w-4
            ${type === 'trigger' ? 'text-blue-600 dark:text-blue-400' : ''}
            ${type === 'action' ? 'text-green-600 dark:text-green-400' : ''}
            ${type === 'logic' ? 'text-purple-600 dark:text-purple-400' : ''}
          `} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}