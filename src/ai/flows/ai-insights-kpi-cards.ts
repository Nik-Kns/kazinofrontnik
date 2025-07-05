'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating AI-powered insights for KPI cards.
 *
 * The flow takes a KPI name as input and returns an AI-generated explanation of the metric.
 * This explanation can be used as a tooltip or description when users hover over the KPI card.
 *
 * @interface AiInsightsKpiCardsInput - The input type for the aiInsightsKpiCards function.
 * @interface AiInsightsKpiCardsOutput - The output type for the aiInsightsKpiCards function.
 *
 * @function aiInsightsKpiCards - The main function that triggers the AI insight generation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiInsightsKpiCardsInputSchema = z.object({
  kpiName: z.string().describe('The name of the KPI to generate insights for.'),
});
export type AiInsightsKpiCardsInput = z.infer<typeof AiInsightsKpiCardsInputSchema>;

const AiInsightsKpiCardsOutputSchema = z.object({
  explanation: z.string().describe('An AI-generated explanation of the KPI.'),
});
export type AiInsightsKpiCardsOutput = z.infer<typeof AiInsightsKpiCardsOutputSchema>;

export async function aiInsightsKpiCards(input: AiInsightsKpiCardsInput): Promise<AiInsightsKpiCardsOutput> {
  return aiInsightsKpiCardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiInsightsKpiCardsPrompt',
  input: {schema: AiInsightsKpiCardsInputSchema},
  output: {schema: AiInsightsKpiCardsOutputSchema},
  prompt: `You are an AI assistant that generates brief, informative explanations for Key Performance Indicators (KPIs) in a business context.

  Given the name of a KPI, provide a one-sentence explanation of what the KPI measures and what a healthy value for the KPI would be.

  KPI Name: {{{kpiName}}}
  Explanation: `,
});

const aiInsightsKpiCardsFlow = ai.defineFlow(
  {
    name: 'aiInsightsKpiCardsFlow',
    inputSchema: AiInsightsKpiCardsInputSchema,
    outputSchema: AiInsightsKpiCardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
