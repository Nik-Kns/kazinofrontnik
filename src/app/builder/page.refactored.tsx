"use client";

import React from 'react';
import {
    Node,
    Edge,
    OnConnect,
    useNodesState,
    useEdgesState,
    addEdge,
    ReactFlowProvider,
} from 'reactflow';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
    Activity,
    GitBranch,
    CheckCircle,
    Mail,
    Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScenarioBuilderSidebar, elementLibrary } from '@/components/builder/sidebar';
import { ScenarioBuilderCanvas } from '@/components/builder/canvas';
import { NodeConfigPanel } from '@/components/builder/settings';
import { AiCopilotChat } from '@/components/ai/ai-copilot-chat';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { BotMessageSquare } from 'lucide-react';

// Mock data, to be replaced with API calls
const initialNodes: Node[] = [
    { id: '1', type: 'custom', position: { x: 250, y: 5 }, data: { label: 'Триггер: Попал в сегмент', description: 'Сегмент: Риск оттока (предиктивный)', icon: GitBranch, configType: 'segmentTrigger' } },
    { id: '2', type: 'custom', position: { x: 250, y: 155 }, data: { label: 'Условие: VIP игрок?', description: 'Если Lifetime Spend > €1000', icon: GitBranch, configType: 'ifElseLogic' } },
    { id: '3', type: 'custom', position: { x: 50, y: 305 }, data: { label: 'Действие: Начислить бонус', description: 'Тип: Кэшбек, Кол-во: 10%', icon: Gift, configType: 'bonusAction' } },
    { id: '4', type: 'custom', position: { x: 450, y: 305 }, data: { label: 'Логика: A/B тест', description: 'Разделение 50% / 50%', icon: Activity, configType: 'abTestLogic' } },
    { id: '5', type: 'custom', position: { x: 350, y: 455 }, data: { label: 'Действие: Email (Скидка)', description: 'Шаблон: "Скидка 15%"', icon: Mail, configType: 'emailAction' } },
    { id: '6', type: 'custom', position: { x: 550, y: 455 }, data: { label: 'Действие: Email (Бонус)', description: 'Шаблон: "Бонус 25 FS"', icon: Mail, configType: 'emailAction' } },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, type: 'custom' },
    { id: 'e2-3', source: '2', target: '3', label: 'Да', type: 'custom' },
    { id: 'e2-4', source: '2', target: '4', label: 'Нет', type: 'custom' },
    { id: 'e4-5', source: '4', target: '5', label: 'Ветка A', type: 'custom' },
    { id: 'e4-6', source: '4', target: '6', label: 'Ветка B', type: 'custom' },
];

interface ScenarioData {
    id: string;
    name: string;
}

const Builder = ({ onExit, scenario }: { onExit: () => void; scenario: ScenarioData | null }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);
    const [isCopilotOpen, setIsCopilotOpen] = React.useState(false);

    const onConnect: OnConnect = React.useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'custom' }, eds)),
        [setEdges]
    );

    const handleNodeClick = React.useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
        setIsSheetOpen(true);
    }, []);

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
             <ScenarioBuilderCanvas
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                setNodes={setNodes}
                onExit={onExit}
                scenario={scenario}
                onCopilotOpen={() => setIsCopilotOpen(true)}
            />
            <div className="flex flex-1 flex-row overflow-hidden">
                <ScenarioBuilderSidebar />
                <main className="flex-1">
                    {/* The canvas is now a separate component, this main area might be used for other things or removed */}
                </main>
            </div>
            <NodeConfigPanel node={selectedNode} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} />
            <Sheet open={isCopilotOpen} onOpenChange={setIsCopilotOpen}>
                <SheetContent className="sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2"><BotMessageSquare /> AI Co-pilot</SheetTitle>
                        <SheetDescription>
                            Ваш помощник в создании эффективных сценариев. Опишите задачу, и AI предложит решение.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-4 h-[calc(100%-80px)]">
                        <AiCopilotChat copilotType="scenario_builder" />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};


const BuilderWrapper = (props: { onExit: () => void; scenario: ScenarioData | null }) => (
    <ReactFlowProvider>
        <Builder {...props} />
    </ReactFlowProvider>
);

const scenarios: ScenarioData[] = [
    { id: '1', name: 'Событие: Первый депозит' },
    { id: '2', name: 'Условие: VIP игрок' },
    { id: '3', name: 'Логика: A/B тест' },
];

export default function BuilderPage() {
    const [activeScenario, setActiveScenario] = React.useState<ScenarioData | null>(scenarios[0]);
    const [isBuilderActive, setIsBuilderActive] = React.useState(false);

    if (isBuilderActive) {
        return <BuilderWrapper onExit={() => setIsBuilderActive(false)} scenario={activeScenario} />;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Конструктор сценариев</h1>
            <div className="space-y-4">
                {scenarios.map(s => (
                    <div key={s.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                            <h2 className="font-semibold">{s.name}</h2>
                        </div>
                        <Button onClick={() => {
                            setActiveScenario(s);
                            setIsBuilderActive(true);
                        }}>Редактировать</Button>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <Button onClick={() => {
                    setActiveScenario(null);
                    setIsBuilderActive(true);
                }}>Создать новый сценарий</Button>
            </div>
        </div>
    );
}
