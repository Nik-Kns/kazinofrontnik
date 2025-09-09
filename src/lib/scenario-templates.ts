// Шаблоны сценариев для разных типов ИИ-рекомендаций

export interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  category: 'reactivation' | 'vip-optimization' | 'risk-prevention' | 'engagement' | 'conversion';
  trigger: {
    type: string;
    conditions: any;
  };
  actions: Array<{
    type: string;
    config: any;
  }>;
  segments: string[];
  expectedMetrics: {
    conversion: string;
    revenue: string;
    roi: string;
  };
}

export const scenarioTemplates: Record<string, ScenarioTemplate> = {
  'dormant-reactivation': {
    id: 'dormant-reactivation',
    name: 'Кампания реактивации спящих игроков',
    description: 'Автоматическая последовательность для возвращения игроков без активности 30+ дней',
    category: 'reactivation',
    trigger: {
      type: 'inactivity',
      conditions: {
        days: 30,
        lastLTV: { min: 100 },
        registrationDays: { min: 60 }
      }
    },
    actions: [
      {
        type: 'email',
        config: {
          template: 'reactivation-offer',
          subject: '🎰 {name}, мы скучали! Возвращайтесь с бонусом 100%',
          content: 'Специальное предложение: 100% бонус до €500 на первый депозит после возвращения',
          delay: 0
        }
      },
      {
        type: 'push',
        config: {
          message: '💰 Ваш персональный бонус 100% ждет! Только 48 часов',
          delay: 24
        }
      },
      {
        type: 'bonus',
        config: {
          type: 'deposit',
          percentage: 100,
          maxAmount: 500,
          wagering: 20,
          validDays: 7
        }
      },
      {
        type: 'sms',
        config: {
          message: 'Последний день! Ваш бонус €500 сгорит через 24 часа',
          delay: 48
        }
      }
    ],
    segments: ['dormant_high_value', 'dormant_30_days'],
    expectedMetrics: {
      conversion: '8-12%',
      revenue: '€142,350',
      roi: '320%'
    }
  },

  'vip-bonus-optimization': {
    id: 'vip-bonus-optimization',
    name: 'Оптимизация бонусной программы VIP',
    description: 'Персонализированные бонусы для VIP игроков на основе их предпочтений',
    category: 'vip-optimization',
    trigger: {
      type: 'segment_entry',
      conditions: {
        segment: 'vip_players',
        bonusUtilization: { max: 50 }
      }
    },
    actions: [
      {
        type: 'analyze',
        config: {
          metrics: ['game_preferences', 'deposit_patterns', 'bonus_history'],
          aiModel: 'personalization'
        }
      },
      {
        type: 'bonus',
        config: {
          type: 'cashback',
          percentage: 15,
          frequency: 'weekly',
          minLoss: 100,
          instantWithdrawal: true
        }
      },
      {
        type: 'tournament_invite',
        config: {
          type: 'exclusive',
          prizePool: 10000,
          entryFee: 0,
          frequency: 'weekly'
        }
      },
      {
        type: 'personal_manager',
        config: {
          assign: true,
          contactMethod: 'telegram',
          welcomeBonus: 100
        }
      }
    ],
    segments: ['vip_players', 'high_rollers'],
    expectedMetrics: {
      conversion: '35%',
      revenue: '€85,000/мес',
      roi: '230%'
    }
  },

  'churn-risk-prevention': {
    id: 'churn-risk-prevention',
    name: 'Предотвращение оттока высокоценных игроков',
    description: 'Срочные меры для удержания игроков с высоким риском ухода',
    category: 'risk-prevention',
    trigger: {
      type: 'risk_score',
      conditions: {
        riskScore: { min: 7.5 },
        playerValue: 'high',
        daysToChurn: { max: 7 }
      }
    },
    actions: [
      {
        type: 'alert',
        config: {
          urgency: 'critical',
          assignTo: 'vip_manager',
          action: 'immediate_contact'
        }
      },
      {
        type: 'bonus',
        config: {
          type: 'no_deposit',
          amount: 50,
          wagering: 1,
          games: 'favorite',
          validHours: 72
        }
      },
      {
        type: 'personal_call',
        config: {
          timing: 'immediate',
          script: 'retention_critical',
          offerAuthority: 'high'
        }
      },
      {
        type: 'loyalty_boost',
        config: {
          multiplier: 3,
          duration: 30,
          retroactive: true
        }
      }
    ],
    segments: ['at_risk_high_value', 'churning_vip'],
    expectedMetrics: {
      conversion: '65%',
      revenue: 'Сохранение €68,000',
      roi: '450%'
    }
  },

  'tournament-engagement': {
    id: 'tournament-engagement',
    name: 'Увеличение вовлеченности через турниры',
    description: 'Привлечение игроков к участию в турнирах для повышения активности',
    category: 'engagement',
    trigger: {
      type: 'behavior',
      conditions: {
        tournamentParticipation: { max: 1 },
        monthlyDeposits: { min: 2 },
        accountAge: { min: 30 }
      }
    },
    actions: [
      {
        type: 'tournament_ticket',
        config: {
          value: 10,
          tournamentType: 'daily',
          games: 'slots',
          expiryDays: 7
        }
      },
      {
        type: 'email',
        config: {
          template: 'tournament_invitation',
          subject: '🏆 Бесплатный билет на турнир с призовым фондом €5,000!',
          personalized: true
        }
      },
      {
        type: 'in_app_message',
        config: {
          placement: 'lobby',
          design: 'animated_banner',
          cta: 'Участвовать бесплатно'
        }
      },
      {
        type: 'leaderboard_boost',
        config: {
          points_multiplier: 2,
          duration_hours: 24,
          notification: true
        }
      }
    ],
    segments: ['active_non_tournament', 'mid_value_players'],
    expectedMetrics: {
      conversion: '25%',
      revenue: '+18% DAU',
      roi: '380%'
    }
  },

  'new-player-conversion': {
    id: 'new-player-conversion',
    name: 'Конверсия новых игроков',
    description: 'Оптимизация воронки для новых регистраций',
    category: 'conversion',
    trigger: {
      type: 'registration',
      conditions: {
        hoursAfter: 1,
        depositMade: false,
        emailVerified: true
      }
    },
    actions: [
      {
        type: 'welcome_bonus',
        config: {
          type: 'first_deposit',
          percentage: 200,
          maxAmount: 100,
          wagering: 25,
          splitDeposits: 1
        }
      },
      {
        type: 'free_spins',
        config: {
          amount: 50,
          game: 'popular_slot',
          wagering: 30,
          dailyRelease: true
        }
      },
      {
        type: 'tutorial',
        config: {
          type: 'interactive',
          reward: 10,
          steps: ['deposit', 'play', 'withdraw']
        }
      },
      {
        type: 'fast_verification',
        config: {
          priority: 'high',
          autoApprove: true,
          limits: { deposit: 1000, withdraw: 500 }
        }
      }
    ],
    segments: ['new_registrations', 'undeposited'],
    expectedMetrics: {
      conversion: '35%',
      revenue: '€50 FTD',
      roi: '200%'
    }
  }
};

// Функция для получения шаблона по типу рекомендации
export function getTemplateForRecommendation(recommendationType: string): ScenarioTemplate | null {
  const templateMap: Record<string, string> = {
    'reactivation': 'dormant-reactivation',
    'vip-optimization': 'vip-bonus-optimization', 
    'risk-prevention': 'churn-risk-prevention',
    'engagement': 'tournament-engagement',
    'conversion': 'new-player-conversion'
  };

  const templateId = templateMap[recommendationType];
  return templateId ? scenarioTemplates[templateId] : null;
}

// Функция для создания персонализированного сценария
export function createPersonalizedScenario(
  template: ScenarioTemplate,
  data: {
    targetAudience?: number;
    budget?: number;
    urgency?: 'low' | 'medium' | 'high' | 'critical';
    customSegments?: string[];
  }
): any {
  const scenario = JSON.parse(JSON.stringify(template)); // Deep clone

  // Персонализация на основе данных
  if (data.targetAudience) {
    scenario.description += ` (Целевая аудитория: ${data.targetAudience} игроков)`;
  }

  if (data.budget) {
    // Адаптация бонусов под бюджет
    scenario.actions.forEach(action => {
      if (action.type === 'bonus' && action.config.maxAmount) {
        action.config.maxAmount = Math.min(action.config.maxAmount, data.budget / 100);
      }
    });
  }

  if (data.urgency === 'critical') {
    // Ускорение всех задержек для критичных кампаний
    scenario.actions.forEach(action => {
      if (action.config.delay) {
        action.config.delay = Math.floor(action.config.delay / 2);
      }
    });
  }

  if (data.customSegments) {
    scenario.segments = [...scenario.segments, ...data.customSegments];
  }

  return scenario;
}