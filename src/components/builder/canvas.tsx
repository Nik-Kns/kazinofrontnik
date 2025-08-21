"use client";

import React from 'react';
import ReactFlow, {
    Controls,
    MiniMap,
    Background,
    Node,
    Edge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    NodeMouseHandler,
    ReactFlowProvider,
    useReactFlow,
    useNodesState,
    addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes, edgeTypes } from './nodes';
import { ScenarioData } from './types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BotMessageSquare, Sparkles } from 'lucide-react';
import { elementLibrary } from './sidebar';


let id = 7;
const getId = () => `dndnode_${id++}`;

interface ScenarioBuilderCanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    onNodeClick: NodeMouseHandler;
    setNodes: React.Dispatch<React.SetStateAction<Node<any>[]>>;
}

const ScenarioBuilderCanvasComponent = ({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    setNodes
}: ScenarioBuilderCanvasProps) => {
    const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
    const { screenToFlowPosition } = useReactFlow();

    const onDragOver = React.useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = React.useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!reactFlowWrapper.current) return;
            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const elementInfo = elementLibrary[type as keyof typeof elementLibrary];

            if (!elementInfo) return;

            const newNode: Node = {
                id: getId(),
                type: 'custom',
                position,
                data: {
                    label: (elementInfo as any).name,
                    description: (elementInfo as any).description,
                    icon: (elementInfo as any).icon,
                    configType: (elementInfo as any).type
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes]
    );

    return (
        <main className="flex-1" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onDrop={onDrop}
                onDragOver={onDragOver}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background gap={16} />
            </ReactFlow>
        </main>
    )
}

export const ScenarioBuilderCanvas = (props: any) => ( // Simplified props for wrapper
    <ReactFlowProvider>
        <ScenarioBuilderCanvasComponent {...props} />
    </ReactFlowProvider>
);
