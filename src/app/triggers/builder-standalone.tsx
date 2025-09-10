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
    Activity,
    GitBranch,
    CheckCircle,
    Mail,
    Gift,
    Sparkles,
    ArrowLeft,
    BotMessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScenarioBuilderSidebar, elementLibrary } from '@/components/builder/sidebar';
import { ScenarioBuilderCanvas } from '@/components/builder/canvas';
import { NodeConfigPanel } from '@/components/builder/settings';
import { AiCopilotChat } from '@/components/ai/ai-copilot-chat';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { FunnelOverlay } from '@/components/builder/funnel-overlay';
import { TemplateData } from '@/lib/types';

// Mock data, to be replaced with API calls
const initialNodes: Node[] = [
    { id: '1', type: 'custom', position: { x: 250, y: 5 }, data: { label: 'Триггер: Попал в сегмент', description: 'Сегмент: Риск оттока (предиктивный)', icon: GitBranch, configType: 'segmentTrigger', stats: { entered: 5000, exited: 4500, conversion: 90 } } },
    { id: '2', type: 'custom', position: { x: 250, y: 155 }, data: { label: 'Условие: VIP игрок?', description: 'Если Lifetime Spend > €1000', icon: GitBranch, configType: 'ifElseLogic', stats: { entered: 4500, exited: 4500, conversion: 100 } } },
    { id: '3', type: 'custom', position: { x: 50, y: 305 }, data: { label: 'Действие: Начислить бонус', description: 'Тип: Кэшбек, Кол-во: 10%', icon: Gift, configType: 'bonusAction', stats: { entered: 500, exited: 480, conversion: 96 } } },
    { id: '4', type: 'custom', position: { x: 450, y: 305 }, data: { label: 'Логика: A/B тест', description: 'Разделение 50% / 50%', icon: Activity, configType: 'abTestLogic', stats: { entered: 4000, exited: 4000, conversion: 100 } } },
    { id: '5', type: 'custom', position: { x: 350, y: 455 }, data: { label: 'Действие: Email (Скидка)', description: 'Шаблон: "Скидка 15%"', icon: Mail, configType: 'emailAction', stats: { entered: 2000, exited: 500, conversion: 25 } } },
    { id: '6', type: 'custom', position: { x: 550, y: 455 }, data: { label: 'Действие: Email (Бонус)', description: 'Шаблон: "Бонус 25 FS"', icon: Mail, configType: 'emailAction', stats: { entered: 2000, exited: 800, conversion: 40 } } },
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

const BuilderHeader = ({ onExit, scenario, onCopilotOpen }: { onExit: () => void; scenario: TemplateData | null; onCopilotOpen: () => void }) => (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-6 flex-wrap gap-2 z-10">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={onExit}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
                <h1 className="text-xl font-bold tracking-tight">{scenario?.name || "Новый сценарий"}</h1>
                <p className="text-sm text-muted-foreground">Создавайте автоматизированные CRM-цепочки</p>
            </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm"> <Sparkles className="mr-2 h-4 w-4" />Prettify</Button>
            <Button variant="outline">Сохранить как черновик</Button>
            <Button>Активировать сценарий</Button>
            <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={onCopilotOpen}>
                <BotMessageSquare className="mr-2 h-4 w-4" />
                AI Co-pilot
            </Button>
        </div>
    </header>
);

const Builder = ({ onExit, scenario }: { onExit: () => void; scenario: TemplateData | null }) => {
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

    const funnelStats = React.useMemo(() => {
        const sourceNodeIds = new Set(edges.map(e => e.source));
        const terminalNodes = nodes.filter(n => !sourceNodeIds.has(n.id));

        const totalEntered = nodes[0]?.data.stats.entered || 0;
        const totalCompleted = terminalNodes.reduce((sum, node) => sum + (node.data.stats?.exited || 0), 0);
        const totalConversion = totalEntered > 0 ? (totalCompleted / totalEntered) * 100 : 0;
        
        return { totalEntered, totalCompleted, totalConversion };
    }, [nodes, edges]);

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
            <BuilderHeader onExit={onExit} scenario={scenario} onCopilotOpen={() => setIsCopilotOpen(true)} />
            <div className="flex flex-1 flex-row overflow-hidden">
                <ScenarioBuilderSidebar />
                <main className="flex-1 relative">
                    <ScenarioBuilderCanvas
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={handleNodeClick}
                        setNodes={setNodes}
                    />
                    <FunnelOverlay stats={funnelStats} />
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


const BuilderWrapper = (props: { onExit: () => void; scenario: TemplateData | null }) => (
    <ReactFlowProvider>
        <Builder {...props} />
    </ReactFlowProvider>
);

// Экспортируем BuilderWrapper как дефолтный экспорт для использования в основной странице
export default BuilderWrapper;
