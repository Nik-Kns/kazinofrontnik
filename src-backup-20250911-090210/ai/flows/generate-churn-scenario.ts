// use server'
'use server';

/**
 * @fileOverview A flow to generate a churn prevention scenario using AI.
 *
 * - generateChurnPreventionScenario - A function that generates a churn prevention scenario.
 * - GenerateChurnPreventionScenarioInput - The input type for the generateChurnPreventionScenario function.
 * - GenerateChurnPreventionScenarioOutput - The return type for the generateChurnPreventionScenario function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChurnPreventionScenarioInputSchema = z.object({
  playerSegment: z
    .string()
    .describe('The segment of players to target with the churn prevention scenario.'),
  goal: z.string().describe('The primary goal of the churn prevention scenario.'),
  preferredChannels: z
    .string()
    .describe('The preferred communication channels for the scenario (e.g., Email, Push, SMS).'),
});

export type GenerateChurnPreventionScenarioInput = z.infer<
  typeof GenerateChurnPreventionScenarioInputSchema
>;

const GenerateChurnPreventionScenarioOutputSchema = z.object({
  scenarioDescription: z.string().describe('A detailed description of the generated churn prevention scenario.'),
  scenarioSteps: z.string().describe('The steps involved in the churn prevention scenario.'),
});

export type GenerateChurnPreventionScenarioOutput = z.infer<
  typeof GenerateChurnPreventionScenarioOutputSchema
>;

export async function generateChurnPreventionScenario(
  input: GenerateChurnPreventionScenarioInput
): Promise<GenerateChurnPreventionScenarioOutput> {
  return generateChurnPreventionScenarioFlow(input);
}

const generateChurnPreventionScenarioPrompt = ai.definePrompt({
  name: 'generateChurnPreventionScenarioPrompt',
  input: {schema: GenerateChurnPreventionScenarioInputSchema},
  output: {schema: GenerateChurnPreventionScenarioOutputSchema},
  prompt: `You are an AI assistant specializing in generating churn prevention scenarios for online gaming platforms.

  Based on the provided information, create a comprehensive churn prevention scenario that includes a description of the scenario and the detailed steps to be taken.

  Player Segment: {{{playerSegment}}}
  Goal: {{{goal}}}
  Preferred Channels: {{{preferredChannels}}}

  Scenario Description:
  Scenario Steps:`,
});

const generateChurnPreventionScenarioFlow = ai.defineFlow(
  {
    name: 'generateChurnPreventionScenarioFlow',
    inputSchema: GenerateChurnPreventionScenarioInputSchema,
    outputSchema: GenerateChurnPreventionScenarioOutputSchema,
  },
  async input => {
    const {output} = await generateChurnPreventionScenarioPrompt(input);
    return output!;
  }
);
