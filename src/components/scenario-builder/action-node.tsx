import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import * as Icons from "lucide-react";
import { Card } from "@/components/ui/card";

interface ActionNodeData {
  type: string;
  name: string;
  description: string;
  icon: string;
  config: any;
}

interface ActionNodeProps {
  data: ActionNodeData;
  selected: boolean;
}

export const ActionNodeComponent = memo(({ data, selected }: ActionNodeProps) => {
  const Icon = (Icons as any)[data.icon] || Icons.Zap;

  return (
    <Card className={`
      min-w-[200px] border-2 transition-all
      ${selected ? 'border-green-500 shadow-lg' : 'border-green-200 dark:border-green-800'}
      bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900
    `}>
      {/* Точка входа слева */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-green-600 !w-3 !h-3 !border-2 !border-white"
      />
      
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-green-600 text-white">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{data.name}</h3>
            <p className="text-xs text-muted-foreground">{data.description}</p>
          </div>
        </div>
        
        {/* Конфигурация */}
        {data.config?.template && (
          <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
            Шаблон: {data.config.template}
          </div>
        )}
        {data.config?.message && (
          <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
            {data.config.message}
          </div>
        )}
        {data.config?.bonusAmount && (
          <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
            Бонус: {data.config.bonusAmount}%
          </div>
        )}
        {data.config?.segmentAction && (
          <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
            {data.config.segmentAction === 'add' ? 'Добавить в' : 'Удалить из'} сегмент
          </div>
        )}
      </div>
      
      {/* Точка выхода справа */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-green-600 !w-3 !h-3 !border-2 !border-white"
      />
    </Card>
  );
});

ActionNodeComponent.displayName = "ActionNode";