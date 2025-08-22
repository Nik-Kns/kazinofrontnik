import type { 
  CompanyAnalytics, 
  SegmentAnalytics, 
  TemplateAnalytics, 
  CampaignKPI, 
  CampaignFunnel, 
  CohortData, 
  BreakdownItem,
  TemplateVersion,
  SavedAnalyticsView,
  AnalyticsFilters 
} from '@/lib/types';

// Mock Company Analytics Data
export const companyAnalyticsData: CompanyAnalytics = {
  kpis: [
    {
      id: 'ggr',
      name: 'GGR',
      value: '€125,340',
      unit: '€',
      change: 18.2,
      trend: 'up',
      status: 'good',
      benchmark: 120000,
      target: 130000,
      description: 'Gross Gaming Revenue'
    },

    {
      id: 'retention_d7',
      name: 'Retention D7',
      value: '62.3%',
      unit: '%',
      change: -2.1,
      trend: 'down',
      status: 'warning',
      benchmark: 65,
      target: 70
    },
    {
      id: 'arpu',
      name: 'ARPU',
      value: '€125',
      unit: '€',
      change: 0.2,
      trend: 'stable',
      status: 'good',
      benchmark: 120,
      target: 150
    },
    {
      id: 'conversion_rate',
      name: 'Conversion Rate',
      value: '52.4%',
      unit: '%',
      change: 3.1,
      trend: 'up',
      status: 'good',
      benchmark: 50,
      target: 55
    },
    {
      id: 'ltv',
      name: 'LTV',
      value: '€2,450',
      unit: '€',
      change: 12.5,
      trend: 'up',
      status: 'good',
      benchmark: 2200,
      target: 2500
    }
  ],
  funnels: [
    {
      id: 'acquisition',
      name: 'Acquisition Funnel',
      totalUsers: 10000,
      conversionRate: 15.2,
      steps: [
        { id: 'visitors', name: 'Visitors', value: 10000, rate: 100, benchmark: 100, target: 100 },
        { id: 'signups', name: 'Sign-ups', value: 3500, rate: 35, benchmark: 32, target: 40 },
        { id: 'first_deposit', name: 'First Deposit', value: 1520, rate: 15.2, benchmark: 12, target: 18 },
        { id: 'second_deposit', name: 'Second Deposit', value: 760, rate: 7.6, benchmark: 8, target: 10 }
      ]
    },
    {
      id: 'retention',
      name: 'Retention Funnel',
      totalUsers: 1520,
      conversionRate: 62.3,
      steps: [
        { id: 'd1', name: 'Day 1', value: 1520, rate: 100, benchmark: 100, target: 100 },
        { id: 'd7', name: 'Day 7', value: 1140, rate: 75, benchmark: 72, target: 80 },
        { id: 'd30', name: 'Day 30', value: 950, rate: 62.3, benchmark: 60, target: 70 },
        { id: 'd90', name: 'Day 90', value: 684, rate: 45, benchmark: 42, target: 50 }
      ]
    },
    {
      id: 'bonus',
      name: 'Bonus Funnel',
      totalUsers: 2500,
      conversionRate: 45.2,
      steps: [
        { id: 'sent', name: 'Bonus Sent', value: 2500, rate: 100, benchmark: 100, target: 100 },
        { id: 'claimed', name: 'Claimed', value: 1750, rate: 70, benchmark: 68, target: 75 },
        { id: 'wagered', name: 'Wagered', value: 1400, rate: 56, benchmark: 52, target: 60 },
        { id: 'completed', name: 'Completed', value: 1130, rate: 45.2, benchmark: 40, target: 50 }
      ]
    },
    {
      id: 'reactivation',
      name: 'Reactivation Funnel',
      totalUsers: 5000,
      conversionRate: 8.5,
      steps: [
        { id: 'targeted', name: 'Targeted', value: 5000, rate: 100, benchmark: 100, target: 100 },
        { id: 'opened', name: 'Opened', value: 2000, rate: 40, benchmark: 35, target: 45 },
        { id: 'clicked', name: 'Clicked', value: 600, rate: 12, benchmark: 10, target: 15 },
        { id: 'deposited', name: 'Deposited', value: 425, rate: 8.5, benchmark: 7, target: 12 }
      ]
    }
  ],
  trends: [
    { date: '2024-01-01', value: 115000 },
    { date: '2024-01-02', value: 118000 },
    { date: '2024-01-03', value: 122000 },
    { date: '2024-01-04', value: 119000 },
    { date: '2024-01-05', value: 125340 }
  ],
  breakdowns: {
    geo: [
      { id: 'DE', name: 'Germany', value: 45230, percentage: 36.1, change: 12.5, trend: 'up' },
      { id: 'RU', name: 'Russia', value: 32140, percentage: 25.6, change: -3.2, trend: 'down' },
      { id: 'EN', name: 'UK', value: 28450, percentage: 22.7, change: 8.7, trend: 'up' },
      { id: 'FR', name: 'France', value: 19520, percentage: 15.6, change: 15.3, trend: 'up' }
    ],
    devices: [
      { id: 'mobile', name: 'Mobile', value: 87740, percentage: 70.1, change: 22.1, trend: 'up' },
      { id: 'desktop', name: 'Desktop', value: 25120, percentage: 20.0, change: -8.5, trend: 'down' },
      { id: 'tablet', name: 'Tablet', value: 12480, percentage: 9.9, change: 5.2, trend: 'up' }
    ],
    channels: [
      { id: 'email', name: 'Email', value: 52340, percentage: 41.8, change: 8.9, trend: 'up' },
      { id: 'push', name: 'Push', value: 38750, percentage: 30.9, change: 18.7, trend: 'up' },
      { id: 'sms', name: 'SMS', value: 23100, percentage: 18.4, change: -2.3, trend: 'down' },
      { id: 'inapp', name: 'In-App', value: 11150, percentage: 8.9, change: 25.6, trend: 'up' }
    ]
  },
  insights: [
    'Mobile traffic shows strongest growth (+22.1%) driven by improved push notifications',
    'German market outperforming with 36.1% revenue share and +12.5% growth',
    'Bonus completion rate exceeds benchmark by 5.2 percentage points',
    'Reactivation campaigns show promising results with 8.5% conversion rate'
  ]
};

// Mock Segment Analytics Data
export const segmentAnalyticsData: SegmentAnalytics = {
  segmentId: 'vip_players',
  segmentName: 'VIP Players',
  totalUsers: 1250,
  kpis: [
    {
      id: 'retention_d30',
      name: 'Retention D30',
      value: '75%',
      unit: '%',
      change: 5.2,
      trend: 'up',
      status: 'good',
      benchmark: 72,
      target: 80
    },
    {
      id: 'arpu',
      name: 'ARPU',
      value: '€1,250',
      unit: '€',
      change: 8.7,
      trend: 'up',
      status: 'good',
      benchmark: 1100,
      target: 1300
    },
    {
      id: 'deposit_frequency',
      name: 'Deposit Frequency',
      value: '3.2/month',
      unit: '/month',
      change: 12.5,
      trend: 'up',
      status: 'good',
      benchmark: 2.8,
      target: 3.5
    }
  ],
  funnels: [
    {
      id: 'vip_retention',
      name: 'VIP Retention',
      totalUsers: 1250,
      conversionRate: 75,
      steps: [
        { id: 'd1', name: 'Day 1', value: 1250, rate: 100, benchmark: 100, target: 100 },
        { id: 'd7', name: 'Day 7', value: 1125, rate: 90, benchmark: 88, target: 92 },
        { id: 'd30', name: 'Day 30', value: 938, rate: 75, benchmark: 72, target: 80 },
        { id: 'd90', name: 'Day 90', value: 750, rate: 60, benchmark: 55, target: 65 }
      ]
    }
  ],
  cohorts: [
    {
      period: '2024-01',
      totalUsers: 320,
      retention: [100, 90, 75, 68, 62, 58, 55],
      periods: ['Week 0', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6']
    },
    {
      period: '2024-02',
      totalUsers: 280,
      retention: [100, 92, 78, 70, 65, 60, 57],
      periods: ['Week 0', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6']
    }
  ],
  comparison: {
    segment: [
      {
        id: 'arpu_segment',
        name: 'ARPU',
        value: '€1,250',
        unit: '€',
        change: 8.7,
        trend: 'up',
        status: 'good'
      }
    ],
    base: [
      {
        id: 'arpu_base',
        name: 'ARPU',
        value: '€125',
        unit: '€',
        change: 0.2,
        trend: 'stable',
        status: 'good'
      }
    ]
  },
  topPlayers: [],
  abResults: []
};

// Mock Template Analytics Data
export const templateAnalyticsData: TemplateAnalytics = {
  templateId: 'welcome_chain',
  templateName: 'Welcome Chain Template',
  type: 'event',
  currentVersion: 'v2.1',
  kpis: [
    {
      id: 'delivery_rate',
      name: 'Delivery Rate',
      value: '96.8%',
      unit: '%',
      change: 2.1,
      trend: 'up',
      status: 'good',
      benchmark: 95,
      target: 98
    },
    {
      id: 'open_rate',
      name: 'Open Rate',
      value: '42.5%',
      unit: '%',
      change: 5.8,
      trend: 'up',
      status: 'good',
      benchmark: 38,
      target: 45
    },
    {
      id: 'click_rate',
      name: 'Click Rate',
      value: '18.7%',
      unit: '%',
      change: 12.3,
      trend: 'up',
      status: 'good',
      benchmark: 15,
      target: 20
    },
    {
      id: 'conversion_rate',
      name: 'Conversion Rate',
      value: '8.2%',
      unit: '%',
      change: 18.5,
      trend: 'up',
      status: 'good',
      benchmark: 6,
      target: 10
    }
  ],
  funnel: {
    id: 'template_funnel',
    name: 'Template Performance',
    totalUsers: 5000,
    conversionRate: 8.2,
    steps: [
      { id: 'sent', name: 'Sent', value: 5000, rate: 100, benchmark: 100, target: 100 },
      { id: 'delivered', name: 'Delivered', value: 4840, rate: 96.8, benchmark: 95, target: 98 },
      { id: 'opened', name: 'Opened', value: 2125, rate: 42.5, benchmark: 38, target: 45 },
      { id: 'clicked', name: 'Clicked', value: 935, rate: 18.7, benchmark: 15, target: 20 },
      { id: 'converted', name: 'Converted', value: 410, rate: 8.2, benchmark: 6, target: 10 }
    ]
  },
  breakdowns: {
    geo: [
      { id: 'DE', name: 'Germany', value: 2100, percentage: 42, change: 15.2, trend: 'up' },
      { id: 'RU', name: 'Russia', value: 1500, percentage: 30, change: -5.1, trend: 'down' },
      { id: 'EN', name: 'UK', value: 900, percentage: 18, change: 8.7, trend: 'up' },
      { id: 'FR', name: 'France', value: 500, percentage: 10, change: 22.1, trend: 'up' }
    ],
    channels: [
      { id: 'email', name: 'Email', value: 3000, percentage: 60, change: 8.5, trend: 'up' },
      { id: 'push', name: 'Push', value: 1500, percentage: 30, change: 15.2, trend: 'up' },
      { id: 'sms', name: 'SMS', value: 500, percentage: 10, change: -12.3, trend: 'down' }
    ],
    devices: [
      { id: 'mobile', name: 'Mobile', value: 3500, percentage: 70, change: 18.9, trend: 'up' },
      { id: 'desktop', name: 'Desktop', value: 1000, percentage: 20, change: -8.2, trend: 'down' },
      { id: 'tablet', name: 'Tablet', value: 500, percentage: 10, change: 5.1, trend: 'up' }
    ],
    projects: [
      { id: 'casinox', name: 'CasinoX', value: 2500, percentage: 50, change: 12.5, trend: 'up' },
      { id: 'luckywheel', name: 'LuckyWheel', value: 1500, percentage: 30, change: 8.7, trend: 'up' },
      { id: 'goldenplay', name: 'GoldenPlay', value: 1000, percentage: 20, change: 15.2, trend: 'up' }
    ]
  },
  versions: [
    {
      id: 'v2.1',
      version: 'v2.1',
      createdAt: '2024-01-15',
      performance: [
        { id: 'open_rate', name: 'Open Rate', value: '42.5%', unit: '%', change: 5.8, trend: 'up', status: 'good' },
        { id: 'click_rate', name: 'Click Rate', value: '18.7%', unit: '%', change: 12.3, trend: 'up', status: 'good' }
      ]
    },
    {
      id: 'v2.0',
      version: 'v2.0',
      createdAt: '2024-01-01',
      performance: [
        { id: 'open_rate', name: 'Open Rate', value: '38.2%', unit: '%', change: -2.1, trend: 'down', status: 'warning' },
        { id: 'click_rate', name: 'Click Rate', value: '15.4%', unit: '%', change: 1.2, trend: 'up', status: 'good' }
      ]
    }
  ],
  topCampaigns: [],
  insights: [
    'Version 2.1 shows significant improvement in open rates (+5.8%)',
    'Mobile performance outpaces desktop by 18.9%',
    'German market shows highest engagement with 42% of total volume',
    'Email channel maintains strong performance with 60% share'
  ]
};

// Mock Saved Views
export const savedAnalyticsViews: SavedAnalyticsView[] = [
  {
    id: 'view1',
    name: 'Monthly Executive Summary',
    type: 'company',
    filters: {
      period: { type: 'MTD' },
      projects: ['casinox', 'luckywheel'],
      geo: ['DE', 'RU'],
      channels: ['email', 'push'],
      devices: [],
      vipLevels: [],
      languages: [],
      gameProviders: []
    },
    selectedKpis: ['ggr', 'retention_d7', 'arpu'],
    createdAt: '2024-01-15T10:00:00Z',
    userId: 'user1'
  },
  {
    id: 'view2',
    name: 'VIP Segment Performance',
    type: 'segment',
    filters: {
      period: { type: 'D30' },
      projects: ['casinox'],
      geo: ['DE'],
      channels: [],
      devices: [],
      vipLevels: ['vip', 'super_vip'],
      languages: [],
      gameProviders: []
    },
    selectedKpis: ['retention_d30', 'arpu', 'ltv'],
    createdAt: '2024-01-10T14:30:00Z',
    userId: 'user1'
  }
];
