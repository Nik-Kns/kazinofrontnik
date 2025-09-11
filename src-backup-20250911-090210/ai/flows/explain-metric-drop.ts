// src/ai/flows/explain-metric-drop.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for explaining drops in metrics.
 *
 * - explainMetricDrop - A function that takes a metric name and returns an explanation for its drop.
 * - ExplainMetricDropInput - The input type for the explainMetricDrop function.
 * - ExplainMetricDropOutput - The return type for the explainMetricDrop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainMetricDropInputSchema = z.object({
  metricName: z.string().describe('The name of the metric that experienced a drop.'),
});
export type ExplainMetricDropInput = z.infer<typeof ExplainMetricDropInputSchema>;

const ExplainMetricDropOutputSchema = z.object({
  explanation: z.string().describe('The explanation for the drop in the specified metric.'),
});
export type ExplainMetricDropOutput = z.infer<typeof ExplainMetricDropOutputSchema>;

export async function explainMetricDrop(input: ExplainMetricDropInput): Promise<ExplainMetricDropOutput> {
  return explainMetricDropFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainMetricDropPrompt',
  input: {schema: ExplainMetricDropInputSchema},
  output: {schema: ExplainMetricDropOutputSchema},
  prompt: `You are an expert data analyst specializing in explaining drops in key performance indicators (KPIs).\
\
You will receive the name of a metric that has experienced a drop. Provide a concise explanation for why this drop may have occurred. Consider potential factors such as recent changes in campaigns, segment performance, or external events. Be specific and provide actionable insights. If the metric is conversion rate, make sure to mention how it is calculated.
\
Metric Name: {{{metricName}}}`,
});

const explainMetricDropFlow = ai.defineFlow(
  {
    name: 'explainMetricDropFlow',
    inputSchema: ExplainMetricDropInputSchema,
    outputSchema: ExplainMetricDropOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
