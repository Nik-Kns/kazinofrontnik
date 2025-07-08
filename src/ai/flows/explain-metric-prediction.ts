'use server';
/**
 * @fileOverview This file defines a Genkit flow for explaining predicted metric trends.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainMetricPredictionInputSchema = z.object({
  metricName: z.string().describe('The name of the metric being predicted.'),
  currentValue: z.string().describe('The current value of the metric.'),
  predictedValue: z.string().describe('The predicted value of the metric.'),
  timePeriod: z.string().describe('The time period of the prediction (e.g., next 7 days).'),
});
export type ExplainMetricPredictionInput = z.infer<typeof ExplainMetricPredictionInputSchema>;

const ExplainMetricPredictionOutputSchema = z.object({
  explanation: z.string().describe('A detailed, data-driven explanation for the predicted trend, considering potential factors.'),
});
export type ExplainMetricPredictionOutput = z.infer<typeof ExplainMetricPredictionOutputSchema>;

export async function explainMetricPrediction(input: ExplainMetricPredictionInput): Promise<ExplainMetricPredictionOutput> {
  return explainMetricPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainMetricPredictionPrompt',
  input: {schema: ExplainMetricPredictionInputSchema},
  output: {schema: ExplainMetricPredictionOutputSchema},
  prompt: `You are an expert data analyst for a gaming CRM platform. Your task is to explain a predicted trend for a key metric.

Metric: {{{metricName}}}
Current Value: {{{currentValue}}}
Predicted Value: {{{predictedValue}}}
Prediction Period: {{{timePeriod}}}

Based on this information, provide a concise, data-driven explanation for why this trend is predicted. Consider factors like:
- Seasonality (e.g., holidays, weekends)
- Recent campaign performance and their lagging effects
- Typical user behavior patterns (e.g., weekly login cycles)
- Known market trends or upcoming game updates.

Your explanation should be insightful and help a CRM manager understand the 'why' behind the numbers.`,
});

const explainMetricPredictionFlow = ai.defineFlow(
  {
    name: 'explainMetricPredictionFlow',
    inputSchema: ExplainMetricPredictionInputSchema,
    outputSchema: ExplainMetricPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
