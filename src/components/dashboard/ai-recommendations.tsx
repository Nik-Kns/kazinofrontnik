"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  TrendingUp, 
  Target,
  ArrowRight,
  CheckCircle,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface Recommendation {
  type: "segmentation" | "communication" | "triggers";
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  coverage?: string;
  items: {
    name: string;
    actionUrl?: string;
    actionLabel?: string;
  }[];
}

const recommendations: Recommendation[] = [
  {
    type: "segmentation",
    icon: AlertCircle,
    iconColor: "text-yellow-500",
    title: "Сегментация: 12 сегментов",
    description: "Рекомендуем добавить:",
    items: [
      { 
        name: "Игроки на грани оттока (не играли 7 дней)",
        actionUrl: "/segments?action=create&name=Игроки на грани оттока&type=behavioral",
        actionLabel: "Создать"
      },
      { 
        name: "VIP без депозитов 14 дней",
        actionUrl: "/segments?action=create&name=VIP без депозитов 14 дней&type=behavioral",
        actionLabel: "Создать"
      },
      { 
        name: "Новички после первого депозита",
        actionUrl: "/segments?action=create&name=Новички после первого депозита&type=behavioral",
        actionLabel: "Создать"
      }
    ]
  },
  {
    type: "communication",
    icon: TrendingUp,
    iconColor: "text-blue-500",
    title: "Коммуникации покрывают 68% игроков",
    description: "Добавить коммуникации для:",
    items: [
      { 
        name: "Утренние игроки (6:00-10:00)",
        actionUrl: "/builder?action=create&audience=Утренние игроки&type=retention",
        actionLabel: "Создать сценарий"
      },
      { 
        name: "Игроки с низким RTP",
        actionUrl: "/builder?action=create&audience=Игроки с низким RTP&type=retention",
        actionLabel: "Создать сценарий"
      }
    ]
  },
  {
    type: "triggers",
    icon: Target,
    iconColor: "text-purple-500",
    title: "Триггеры покрывают 45% игроков",
    description: "Рекомендуемые A/B тесты:",
    items: [
      { 
        name: "A/B тест welcome-бонусов",
        actionUrl: "/triggers?action=create&test=A/B тест welcome-бонусов&type=ab",
        actionLabel: "Создать тест"
      },
      { 
        name: "Тестирование push vs email для VIP",
        actionUrl: "/triggers?action=create&test=Тестирование push vs email для VIP&type=ab",
        actionLabel: "Создать тест"
      },
      { 
        name: "Оптимизация времени отправки",
        actionUrl: "/triggers?action=create&test=Оптимизация времени отправки&type=ab",
        actionLabel: "Создать тест"
      }
    ]
  }
];

export function AIRecommendations() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle>Результаты аудита retention структуры</CardTitle>
          </div>
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" />
            AI рекомендации
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 ${rec.iconColor}`} />
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="font-medium">{rec.title}</p>
                    {rec.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {rec.description}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    {rec.items.map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between py-1.5"
                      >
                        <span className="text-sm text-muted-foreground">
                          • {item.name}
                        </span>
                        {item.actionUrl && item.actionLabel && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2 text-xs"
                            asChild
                          >
                            <Link href={item.actionUrl}>
                              {item.actionLabel}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}