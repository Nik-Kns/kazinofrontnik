// 'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a CRM scenario using AI co-pilot based on user instructions.
 *
 * - aiCopilotScenarioGeneration - A function that generates a CRM scenario based on user instructions.
 * - AiCopilotScenarioGenerationInput - The input type for the aiCopilotScenarioGeneration function.
 * - AiCopilotScenarioGenerationOutput - The output type for the aiCopilotScenarioGeneration function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiCopilotScenarioGenerationInputSchema = z.object({
  instructions: z
    .string()
    .describe(
      'Instructions for generating the scenario, including the target audience, goal, and preferred channels.'
    ),
});
export type AiCopilotScenarioGenerationInput = z.infer<typeof AiCopilotScenarioGenerationInputSchema>;

const AiCopilotScenarioGenerationOutputSchema = z.object({
  scenarioDescription: z
    .string()
    .describe('A detailed description of the generated scenario, including steps, conditions, and actions.'),
});
export type AiCopilotScenarioGenerationOutput = z.infer<typeof AiCopilotScenarioGenerationOutputSchema>;

export async function aiCopilotScenarioGeneration(
  input: AiCopilotScenarioGenerationInput
): Promise<AiCopilotScenarioGenerationOutput> {
  return aiCopilotScenarioGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCopilotScenarioGenerationPrompt',
  input: {schema: AiCopilotScenarioGenerationInputSchema},
  output: {schema: AiCopilotScenarioGenerationOutputSchema},
  prompt: `You are an AI co-pilot assisting in the creation of CRM scenarios.

  Based on the user's instructions, generate a detailed scenario description that includes the steps, conditions, and actions involved.

  Instructions: {{{instructions}}}
  `,
});

const aiCopilotScenarioGenerationFlow = ai.defineFlow(
  {
    name: 'aiCopilotScenarioGenerationFlow',
    inputSchema: AiCopilotScenarioGenerationInputSchema,
    outputSchema: AiCopilotScenarioGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
