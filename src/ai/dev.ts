import { config } from 'dotenv';
config();

import '@/ai/flows/generate-churn-scenario.ts';
import '@/ai/flows/explain-metric-drop.ts';
import '@/ai/flows/ai-copilot-generate-scenario.ts';
import '@/ai/flows/ai-insights-kpi-cards.ts';
import '@/ai/flows/generate-segments.ts';
import '@/ai/flows/ai-copilot-improvement.ts';
import '@/ai/flows/ai-insights-retention.ts';
import '@/ai/flows/ai-recommendation-risks.ts';