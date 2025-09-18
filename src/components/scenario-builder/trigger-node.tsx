import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import * as Icons from "lucide-react";
import { Card } from "@/components/ui/card";

interface TriggerNodeData {
  type: string;
  name: string;
  description: string;
  icon: string;
  config: any;
}

interface TriggerNodeProps {
  data: TriggerNodeData;
  selected: boolean;
}

export const TriggerNodeComponent = memo(({ data, selected }: TriggerNodeProps) => {
  const Icon = (Icons as any)[data.icon] || Icons.Zap;

  return (
    <Card className={`
      min-w-[200px] border-2 transition-all
      ${selected ? 'border-blue-500 shadow-lg' : 'border-blue-200 dark:border-blue-800'}
      bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900
    `}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-600 text-white">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{data.name}</h3>
            <p className="text-xs text-muted-foreground">{data.description}</p>
          </div>
        </div>
        
        {/* Конфигурация */}
        {data.config?.eventType && (
          <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
            Событие: {data.config.eventType}
          </div>
        )}
        {data.config?.schedule && (
          <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
            Расписание: {data.config.schedule}
          </div>
        )}
      </div>
      
      {/* Точка выхода справа */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-blue-600 !w-3 !h-3 !border-2 !border-white"
      />
    </Card>
  );
});

TriggerNodeComponent.displayName = "TriggerNode";