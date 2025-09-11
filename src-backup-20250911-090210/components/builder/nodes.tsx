"use client";

import React from 'react';
import { Handle, Position, useReactFlow, getBezierPath, BaseEdge, EdgeLabelRenderer } from 'reactflow';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CustomNodeData {
    label: string;
    description: string;
    icon: React.ElementType;
    stats?: {
        entered: number;
        exited: number;
        conversion: number;
    }
}

export const CustomNode = ({ data }: { data: CustomNodeData }) => {
    const Icon = data.icon;
    return (
        <>
            <Handle type="target" position={Position.Top} className="!bg-primary" />
            <Card className="w-72 shadow-lg hover:shadow-xl transition-shadow bg-card z-10 hover:border-primary">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">{data.label}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{data.description}</p>
                    {data.stats && (
                        <>
                            <Separator className="my-3" />
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center text-muted-foreground">
                                        <Users className="h-3 w-3 mr-1.5" />
                                        Вошло
                                    </span>
                                    <span className="font-mono font-semibold">{data.stats.entered.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center text-muted-foreground">
                                        <ArrowRight className="h-3 w-3 mr-1.5" />
                                        Вышло
                                    </span>
                                    <span className="font-mono font-semibold">{data.stats.exited.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center text-muted-foreground">
                                        <TrendingUp className="h-3 w-3 mr-1.5" />
                                        Конверсия
                                    </span>
                                    <span className="font-mono font-semibold text-green-600">{data.stats.conversion}%</span>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
            <Handle type="source" position={Position.Bottom} className="!bg-primary" />
        </>
    );
};

export function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, label }: any) {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const onEdgeClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    };

    return (
        <>
            <BaseEdge path={edgePath} style={style} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan bg-background p-1 rounded-md text-xs font-semibold"
                >
                    {label}
                </div>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan group"
                >
                    <Button
                        variant="destructive"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        size="icon"
                        onClick={onEdgeClick}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}

export const nodeTypes = {
    custom: CustomNode,
};

export const edgeTypes = {
    custom: CustomEdge,
};
