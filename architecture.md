# Architecture Overview

**Last verified**: 2025-07-27

## Project Structure

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
│   ├── analytics/        # Analytics dashboard
│   ├── builder/          # Scenario builder
│   ├── calendar/         # Campaign calendar
│   ├── players/          # Player profiles
│   │   └── [id]/        # Dynamic player profile page
│   ├── reports/          # Reports
│   ├── segments/         # Segment management
│   └── settings/         # Settings
├── components/           
│   ├── ai/              # AI-specific UI components
│   ├── analytics/       # Analytics components
│   │   ├── alerts-and-signals.tsx
│   │   ├── campaign-deep-analytics.tsx
│   │   ├── flexible-charts.tsx
│   │   ├── retention-metrics-dashboard.tsx
│   │   └── segment-metrics-table.tsx
│   ├── dashboard/       # Dashboard components
│   │   ├── full-metrics-dashboard.tsx
│   │   ├── kpi-summary.tsx
│   │   └── risks-and-warnings.tsx
│   ├── layout/          # App layout components
│   ├── players/         # Player profile components
│   ├── settings/        # Settings components
│   └── ui/              # shadcn/ui base components
│       └── enhanced-filters.tsx # Advanced filtering system
├── hooks/               # Custom React hooks
├── lib/                 
│   ├── types.ts         # TypeScript type definitions
│   │   └── PlayerFullProfile # Comprehensive player data structure
│   ├── retention-metrics-data.ts # 25 retention metrics
│   └── utils.ts         # Utility functions
└── styles/              # Global styles
```

## Key Features

### 1. **Command Center Dashboard** (`/`)
- Displays all 25 key retention metrics organized by categories
- Critical alerts at the top
- AI recommendations and quick actions
- Integration with saved filters from analytics page

### 2. **Analytics System** (`/analytics`)
- **Enhanced Filters**: Casino branding, date ranges, 19 segments, source tracking
- **KPI Summary**: Traffic light indicators (🟢🟡🔴), benchmarks, trend analysis
- **Flexible Charts**: 7 switchable metrics with period selection
- **Segment Metrics Tables**: Sortable comparison tables
- **AI-powered Alerts**: Categorized by severity with recommendations
- **Campaign Deep Analytics**: ROI and retention impact analysis

### 3. **Player 360 Profile** (`/players/[id]`)
- **8 Tab Interface**:
  1. **Main Info**: ID, geo, language, platform, KYC status, traffic sources
  2. **Financial**: Deposits, withdrawals, balance, transaction history, payment methods
  3. **Gaming**: Favorite games/providers, wagering stats, session metrics, RTP
  4. **Marketing**: Bonuses, campaigns, communication history, VIP status
  5. **Behavior**: Retention rates, churn risk, LTV, ARPU, predictive CLV
  6. **AI**: ML segments, behavioral profile, recommendations, triggers
  7. **Activity**: Login history, support tickets, manager notes
  8. **VIP**: Personal manager, limits, responsible gambling

### 4. **Retention Metrics System**
- **25 Key Metrics** across 5 categories:
  - **Retention**: Retention Rate, Churn Rate, Reactivation Rate
  - **Revenue**: LTV, ARPU, Average Deposit, ROI, Bet Size
  - **Engagement**: Deposit Frequency, Session Duration, Active Players
  - **Conversion**: Conversion Rate, Bonus Activation, VIP Conversion
  - **Satisfaction**: CSAT, NPS, Withdrawal Success, Support Rate

### 5. **Type System** (`/src/lib/types.ts`)
- **PlayerFullProfile**: Comprehensive 8-section player data structure
- **FilterConfig**: Advanced filtering with 20+ parameters
- **RetentionMetric**: Metric definitions with targets and trends
- **KPIMetric**: Traffic light status system
- **SegmentMetrics**: Segment-specific benchmarks

## Tech Stack
- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript
- **UI**: React 18.3.1 + Tailwind CSS + shadcn/ui
- **AI**: Google Genkit with Gemini 2.0 Flash
- **Charts**: Recharts
- **Flow Editor**: ReactFlow
- **Icons**: Lucide React

## Design System
- **Primary**: Blue (#2962FF)
- **Background**: Light blue-tinted (#F0F4FF)
- **Accent**: Purple (#9C27B0)
- **Font**: Inter (sans-serif)
- **Traffic Light System**: 🟢 Green (good), 🟡 Yellow (warning), 🔴 Red (critical)

## Data Flow
1. **Filters** → Saved in localStorage → Shared between pages
2. **Metrics** → Real-time calculation → AI insights generation
3. **Player Data** → Comprehensive profile → AI recommendations
4. **Segments** → Dynamic calculation → Targeted campaigns

## AI Integration Pattern
```typescript
export const flowName = ai.defineFlow({
  name: 'flowName',
  inputSchema: z.object({ /* zod schema */ }),
  outputSchema: z.object({ /* zod schema */ }),
}, async (input) => {
  // Flow implementation
});
```

## Recent Updates (2025-07-27)
1. ✅ Integrated all 25 retention metrics into main dashboard
2. ✅ Created comprehensive player profile system with 8 data sections
3. ✅ Implemented enhanced filtering with casino branding
4. ✅ Added KPI Summary with traffic light indicators
5. ✅ Built flexible charts with metric switching
6. ✅ Created AI-powered alerts and signals system
7. ✅ Implemented campaign deep analytics

## Planned Features
- [ ] PDF/Excel export functionality
- [ ] Customer.io integration (replacing SendGrid/Twilio)
- [ ] Real-time data updates via WebSocket
- [ ] A/B testing framework
- [ ] Multi-language support