'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing AI-based recommendations for risks identified in the system.
 *
 * - aiRecommendationRisks - A function that takes system information and provides AI-driven recommendations for identified risks.
 * - AiRecommendationRisksInput - The input type for the aiRecommendationRisks function.
 * - AiRecommendationRisksOutput - The output type for the aiRecommendationRisks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiRecommendationRisksInputSchema = z.object({
  systemInformation: z
    .string()
    .describe('Detailed information about the current system state, including metrics, alerts, and recent changes.'),
});
export type AiRecommendationRisksInput = z.infer<typeof AiRecommendationRisksInputSchema>;

const AiRecommendationRisksOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of AI-generated recommendations to address the identified risks.'),
});
export type AiRecommendationRisksOutput = z.infer<typeof AiRecommendationRisksOutputSchema>;

export async function aiRecommendationRisks(input: AiRecommendationRisksInput): Promise<AiRecommendationRisksOutput> {
  return aiRecommendationRisksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiRecommendationRisksPrompt',
  input: {schema: AiRecommendationRisksInputSchema},
  output: {schema: AiRecommendationRisksOutputSchema},
  prompt: `You are an AI assistant specializing in providing risk mitigation recommendations for complex systems.

  Based on the following system information, identify potential risks and suggest actionable recommendations to address them.

  System Information: {{{systemInformation}}}

  Provide a list of clear and concise recommendations that can be implemented to resolve the identified risks.
  Format the recommendations as a numbered list.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const aiRecommendationRisksFlow = ai.defineFlow(
  {
    name: 'aiRecommendationRisksFlow',
    inputSchema: AiRecommendationRisksInputSchema,
    outputSchema: AiRecommendationRisksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
