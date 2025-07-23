# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Retentlytics AI (AIGAMING.BOT)** - AI-powered retention analytics platform for gaming that provides comprehensive player analytics, segmentation, scenario building, and predictive insights.

## Development Commands

```bash
# Development
npm run dev          # Start Next.js dev server on port 9002 with Turbopack
npm run genkit:dev   # Start Genkit AI development server
npm run genkit:watch # Start Genkit AI with hot reload

# Build & Production
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking (tsc --noEmit)
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript
- **UI**: React 18.3.1 + Tailwind CSS + shadcn/ui
- **AI**: Google Genkit with Gemini 2.0 Flash
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Flow Editor**: ReactFlow
- **Icons**: Lucide React

### Core Features

1. **Command Center Dashboard** (`/analytics`)
   - KPI cards with AI-generated insights
   - Dynamic retention graphs with predictive analytics
   - Segment performance tables

2. **Segment Management** (`/segments`)
   - Dynamic player segmentation
   - Segment analytics and export
   - AI-powered segment generation

3. **Scenario Builder** (`/builder`)
   - Drag-and-drop campaign flow editor
   - Conditional logic and A/B testing
   - AI Copilot for scenario creation

4. **Player 360** (`/players`)
   - Individual player profiles
   - Activity history and CRM logs
   - Segment memberships and campaign participation

5. **AI Insights** (across all features)
   - Metric explanations and predictions
   - Risk detection and recommendations
   - Automated scenario generation

### Directory Structure

```
src/
├── ai/                    # Genkit AI configuration and flows
│   ├── flows/            # AI workflow definitions
│   │   ├── ai-copilot-*.ts      # Scenario builder AI
│   │   ├── ai-insights-*.ts     # Analytics insights
│   │   ├── explain-metric-*.ts  # Metric explanations
│   │   └── generate-*.ts        # Content generation
│   └── genkit.ts         # AI configuration
├── app/                  # Next.js pages (App Router)
├── components/           
│   ├── ai/              # AI-specific UI components
│   ├── analytics/       # Dashboard components
│   ├── dashboard/       # Command center components
│   ├── layout/          # App layout components
│   ├── players/         # Player profile components
│   ├── settings/        # Settings components
│   └── ui/              # shadcn/ui base components
├── hooks/               # Custom React hooks
└── lib/                 
    ├── types.ts         # TypeScript type definitions
    └── utils.ts         # Utility functions
```

### Key Implementation Details

#### AI Integration Pattern
All AI features use Google Genkit with structured flows:
```typescript
// Example from src/ai/flows/
export const flowName = ai.defineFlow({
  name: 'flowName',
  inputSchema: z.object({ /* zod schema */ }),
  outputSchema: z.object({ /* zod schema */ }),
}, async (input) => {
  // Flow implementation
});
```

#### Component Structure
- Components follow compound pattern (e.g., `Card`, `CardHeader`, `CardContent`)
- All components use TypeScript with explicit prop types
- Tailwind CSS with custom theme variables in CSS custom properties

#### State Management
- Form state: React Hook Form with Zod schemas
- UI state: Local React state (useState, useReducer)
- No global state management library currently

### Important Notes

1. **Type Safety**: TypeScript errors are currently ignored in builds (`ignoreBuildErrors: true`). Consider enabling for production.

2. **Linting**: ESLint is configured but ignored during builds (`ignoreDuringBuilds: true`).

3. **Testing**: No testing framework is currently configured. Consider adding Jest/Vitest for unit tests and Playwright/Cypress for E2E.

4. **AI Development**: Use `npm run genkit:watch` for hot-reloading AI flows during development.

5. **Design System**:
   - Primary: Blue (#2962FF)
   - Background: Light blue-tinted (#F0F4FF)
   - Accent: Purple (#9C27B0)
   - Font: Inter (sans-serif)

6. **Deployment**: Configured for Firebase App Hosting (see `apphosting.yaml`)

### Common Development Tasks

#### Adding a New AI Flow
1. Create new flow file in `src/ai/flows/`
2. Define input/output schemas with Zod
3. Implement flow logic using `ai.defineFlow`
4. Import in `src/ai/dev.ts` for development server

#### Creating New Components
1. Add to appropriate directory in `src/components/`
2. Use existing UI components from `src/components/ui/`
3. Follow compound component pattern
4. Include Russian comments for complex logic

#### Adding New Pages
1. Create directory in `src/app/`
2. Add `page.tsx` for the route
3. Use layout components from `src/components/layout/`
4. Integrate AI features where appropriate