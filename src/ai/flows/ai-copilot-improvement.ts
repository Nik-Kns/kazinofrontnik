// This is an AI-powered assistant that provides actionable advice for scenario improvement.
// It helps users to improve their existing scenarios and increase the efficiency of each step.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiCopilotImprovementInputSchema = z.object({
  scenarioDescription: z.string().describe('The description of the existing scenario.'),
  scenarioSteps: z.array(z.string()).describe('The steps of the existing scenario.'),
  targetSegment: z.string().describe('The target segment of the scenario.'),
  goal: z.string().describe('The goal of the scenario (e.g., deposit, reactivation).'),
});

export type AiCopilotImprovementInput = z.infer<typeof AiCopilotImprovementInputSchema>;

const AiCopilotImprovementOutputSchema = z.object({
  improvementSuggestions: z.array(
    z.object({
      step: z.string().describe('The step in the scenario to improve.'),
      suggestion: z.string().describe('The actionable suggestion for improvement.'),
      rationale: z.string().describe('The rationale behind the suggestion.'),
    })
  ).describe('The list of improvement suggestions for each step in the scenario.'),
});

export type AiCopilotImprovementOutput = z.infer<typeof AiCopilotImprovementOutputSchema>;

export async function getAiCopilotImprovement(input: AiCopilotImprovementInput): Promise<AiCopilotImprovementOutput> {
  return aiCopilotImprovementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCopilotImprovementPrompt',
  input: {schema: AiCopilotImprovementInputSchema},
  output: {schema: AiCopilotImprovementOutputSchema},
  prompt: `You are an AI co-pilot specializing in CRM scenario optimization. Given a scenario description, its steps, target segment, and goal, provide actionable advice to improve the efficiency of each step.

Scenario Description: {{{scenarioDescription}}}
Scenario Steps:
{{#each scenarioSteps}}- {{{this}}}
{{/each}}
Target Segment: {{{targetSegment}}}
Goal: {{{goal}}}

Provide a list of improvement suggestions, including the step to improve, the suggestion itself, and the rationale behind the suggestion.

Format your response as a JSON object that matches the following schema:
${JSON.stringify(AiCopilotImprovementOutputSchema.describe, null, 2)}`,
});

const aiCopilotImprovementFlow = ai.defineFlow(
  {
    name: 'aiCopilotImprovementFlow',
    inputSchema: AiCopilotImprovementInputSchema,
    outputSchema: AiCopilotImprovementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
