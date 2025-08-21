"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, ArrowRight } from 'lucide-react';

interface FunnelStats {
    totalEntered: number;
    totalCompleted: number;
    totalConversion: number;
}

interface FunnelOverlayProps {
    stats: FunnelStats;
}

export const FunnelOverlay = ({ stats }: FunnelOverlayProps) => {
    return (
        <Card className="absolute top-4 right-4 w-80 shadow-lg z-20 bg-background/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Общая воронка сценария</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="flex items-center text-muted-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            Всего вошло
                        </span>
                        <span className="font-bold text-lg">{stats.totalEntered.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="flex items-center text-muted-foreground">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Завершили
                        </span>
                        <span className="font-bold text-lg">{stats.totalCompleted.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="flex items-center text-muted-foreground">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Конверсия
                        </span>
                        <span className="font-bold text-lg text-primary">{stats.totalConversion.toFixed(2)}%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
