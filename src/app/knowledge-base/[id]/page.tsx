"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function KnowledgeMetricPage() {
  const params = useParams() as { id: string };
  const [metric, setMetric] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/knowledge-base/${params.id}`).then(r=>r.json()).then(res=>setMetric(res.metric));
  }, [params.id]);

  if (!metric) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{metric.name}</h1>
        <Badge variant="outline">{metric.section}</Badge>
        <Badge variant="secondary">v{metric.version}</Badge>
      </div>

      <Card>
        <CardHeader><CardTitle>Определение</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">{metric.definition}</CardContent>
      </Card>

      {metric.formula && (
        <Card>
          <CardHeader><CardTitle>Формула</CardTitle></CardHeader>
          <CardContent className="font-mono text-sm">{metric.formula}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Источники</CardTitle></CardHeader>
        <CardContent className="text-sm">
          {metric.sources?.map((s:any, i:number)=> (
            <div key={i} className="flex items-center gap-2 py-1">
              <Badge variant="outline">{s.system}</Badge>
              <span className="text-muted-foreground">{s.vendors?.join(', ')}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


