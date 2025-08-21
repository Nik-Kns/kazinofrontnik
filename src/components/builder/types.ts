export interface ScenarioData {
    id: string;
    name: string;
    description: string;
    status: 'draft' | 'active' | 'archived';
    createdAt: string;
    updatedAt: string;
    stats: {
      total_users: number;
      in_progress: number;
      completed: number;
      conversion_rate: number;
    };
    nodes: any[]; 
    edges: any[];
}
