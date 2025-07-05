// src/ai/flows/generate-segments.ts
'use server';

/**
 * @fileOverview AI-powered segment generation flow.
 *
 * This file defines a Genkit flow that takes a description of desired user segments
 * and returns a structured segment definition.
 *
 * @interface GenerateSegmentsInput - The input type for the generateSegments function.
 * @interface GenerateSegmentsOutput - The output type for the generateSegments function.
 *
 * @function generateSegments - A function that generates user segments based on natural language descriptions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the segment generation.
const GenerateSegmentsInputSchema = z.object({
  segmentDescription: z
    .string()
    .describe(
      'A natural language description of the desired user segment (e.g., high-spending players at risk of churn).'
    ),
});

export type GenerateSegmentsInput = z.infer<typeof GenerateSegmentsInputSchema>;

// Define the output schema for the generated segment.
const GenerateSegmentsOutputSchema = z.object({
  segmentName: z.string().describe('A concise name for the generated segment.'),
  segmentCriteria: z
    .string()
    .describe(
      'A structured representation of the segment criteria (e.g., JSON or a query language).'
    ),
  rationale: z
    .string()
    .describe(
      'A brief explanation of why this segment is valuable or how it can be used.'
    ),
});

export type GenerateSegmentsOutput = z.infer<typeof GenerateSegmentsOutputSchema>;

// Exported function to generate segments
export async function generateSegments(
  input: GenerateSegmentsInput
): Promise<GenerateSegmentsOutput> {
  return generateSegmentsFlow(input);
}

const generateSegmentsPrompt = ai.definePrompt({
  name: 'generateSegmentsPrompt',
  input: {schema: GenerateSegmentsInputSchema},
  output: {schema: GenerateSegmentsOutputSchema},
  prompt: `You are an expert CRM data analyst, skilled at translating user needs into segment definitions.

  Based on the provided description, create a segment definition that can be used to target users for campaigns.

  Segment Description: {{{segmentDescription}}}

  Output a JSON object with the following keys:
  - segmentName: A concise name for the segment.
  - segmentCriteria: A structured representation of the segment criteria that can be used in a database query.
  - rationale: A brief explanation of why this segment is valuable or how it can be used.
  `,
});

// Define the Genkit flow for generating segments.
const generateSegmentsFlow = ai.defineFlow(
  {
    name: 'generateSegmentsFlow',
    inputSchema: GenerateSegmentsInputSchema,
    outputSchema: GenerateSegmentsOutputSchema,
  },
  async input => {
    const {output} = await generateSegmentsPrompt(input);
    return output!;
  }
);
