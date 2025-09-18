import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import * as Icons from "lucide-react";
import { Card } from "@/components/ui/card";

interface LogicNodeData {
  type: string;
  name: string;
  description: string;
  icon: string;
  config: any;
}

interface LogicNodeProps {
  data: LogicNodeData;
  selected: boolean;
}

export const LogicNodeComponent = memo(({ data, selected }: LogicNodeProps) => {
  const Icon = (Icons as any)[data.icon] || Icons.GitBranch;
  const isCondition = data.type === "condition";
  const isSplit = data.type === "split";

  return (
    <Card className={`
      min-w-[200px] border-2 transition-all
      ${selected ? 'border-purple-500 shadow-lg' : 'border-purple-200 dark:border-purple-800'}
      bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900
    `}>
      {/* Точка входа слева */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-purple-600 !w-3 !h-3 !border-2 !border-white"
      />
      
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-purple-600 text-white">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{data.name}</h3>
            <p className="text-xs text-muted-foreground">{data.description}</p>
          </div>
        </div>
        
        {/* Конфигурация */}
        {data.config?.delayTime && (
          <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
            Ждать: {data.config.delayTime} {
              data.config.delayUnit === 'minutes' ? 'мин' : 
              data.config.delayUnit === 'hours' ? 'ч' : 'д'
            }
          </div>
        )}
        {data.config?.condition && (
          <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
            Условие: {data.config.condition}
          </div>
        )}
        {data.config?.splitRatio && (
          <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
            Разделение: {data.config.splitRatio.join('/')}
          </div>
        )}
      </div>
      
      {/* Точки выхода для условий и разделений */}
      {(isCondition || isSplit) ? (
        <>
          <Handle
            id="yes"
            type="source"
            position={Position.Right}
            style={{ top: '35%' }}
            className="!bg-green-600 !w-3 !h-3 !border-2 !border-white"
          />
          <Handle
            id="no"
            type="source"
            position={Position.Right}
            style={{ top: '65%' }}
            className="!bg-red-600 !w-3 !h-3 !border-2 !border-white"
          />
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-purple-600 !w-3 !h-3 !border-2 !border-white"
        />
      )}
    </Card>
  );
});

LogicNodeComponent.displayName = "LogicNode";