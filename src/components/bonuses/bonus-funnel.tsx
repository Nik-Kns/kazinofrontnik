"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Users, Gift, TrendingUp, CheckCircle, XCircle } from "lucide-react";

interface BonusFunnelProps {
  bonusName: string;
  data: {
    offered: number;
    claimed: number;
    activated: number;
    inProgress: number;
    completed: number;
    abandoned: number;
  };
}

export function BonusFunnel({ bonusName, data }: BonusFunnelProps) {
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
  };

  const claimRate = calculatePercentage(data.claimed, data.offered);
  const activationRate = calculatePercentage(data.activated, data.claimed);
  const completionRate = calculatePercentage(data.completed, data.activated);

  const funnelSteps = [
    {
      label: 'Предложен',
      value: data.offered,
      percentage: '100',
      color: 'bg-blue-100 border-blue-300',
      textColor: 'text-blue-700',
      icon: Users,
      width: 'w-full'
    },
    {
      label: 'Получен (Claimed)',
      value: data.claimed,
      percentage: claimRate,
      color: 'bg-purple-100 border-purple-300',
      textColor: 'text-purple-700',
      icon: Gift,
      width: 'w-[85%]'
    },
    {
      label: 'Активирован',
      value: data.activated,
      percentage: activationRate,
      color: 'bg-indigo-100 border-indigo-300',
      textColor: 'text-indigo-700',
      icon: TrendingUp,
      width: 'w-[70%]'
    },
    {
      label: 'В процессе отыгрыша',
      value: data.inProgress,
      percentage: calculatePercentage(data.inProgress, data.activated),
      color: 'bg-orange-100 border-orange-300',
      textColor: 'text-orange-700',
      icon: TrendingUp,
      width: 'w-[55%]'
    },
    {
      label: 'Завершен успешно',
      value: data.completed,
      percentage: completionRate,
      color: 'bg-green-100 border-green-300',
      textColor: 'text-green-700',
      icon: CheckCircle,
      width: 'w-[40%]'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Воронка конверсии: {bonusName}</span>
          <Badge variant="outline" className="text-sm">
            Final Completion: {completionRate}%
          </Badge>
        </CardTitle>
        <CardDescription>
          Путь игрока от получения до успешного завершения бонуса
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {funnelSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="space-y-2">
                <div className="flex items-center justify-center">
                  <div className={`${step.width} transition-all duration-300`}>
                    <div className={`
                      relative p-4 rounded-lg border-2 ${step.color}
                      hover:shadow-md transition-all duration-200
                    `}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${step.textColor}`} />
                          <div>
                            <p className="font-semibold text-sm">{step.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {step.value.toLocaleString()} игроков
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${step.textColor}`}>
                            {step.percentage}%
                          </p>
                          {index > 0 && (
                            <p className="text-xs text-muted-foreground">
                              от предыдущего
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {index < funnelSteps.length - 1 && (
                  <div className="flex justify-center">
                    <ArrowDown className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Abandoned section */}
          {data.abandoned > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-700" />
                  <div>
                    <p className="font-semibold text-sm text-red-900">Отменено/Истекло</p>
                    <p className="text-xs text-red-700">
                      {data.abandoned.toLocaleString()} игроков не завершили бонус
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-700">
                    {calculatePercentage(data.abandoned, data.offered)}%
                  </p>
                  <p className="text-xs text-red-600">от общего числа</p>
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics Summary */}
          <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Take-up Rate</p>
              <p className="text-xl font-bold text-purple-600">{claimRate}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Activation Rate</p>
              <p className="text-xl font-bold text-indigo-600">{activationRate}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
              <p className="text-xl font-bold text-green-600">{completionRate}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
