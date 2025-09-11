"use client";

import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type KBItem = {
  id: string; name: string; section: string; type: 'base'|'derived'; aliases?: string[]; definition: string;
};

export default function KnowledgeBasePage() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<KBItem[]>([]);
  const [section, setSection] = useState<string>('all');
  const [type, setType] = useState<'all'|'base'|'derived'>('all');

  useEffect(() => {
    fetch('/api/knowledge-base')
      .then(r => r.json())
      .then((res) => setItems(res.metrics));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(m => {
      if (section !== 'all' && m.section !== section) return false;
      if (type !== 'all' && m.type !== type) return false;
      if (!q) return true;
      const hay = [m.name, m.definition, ...(m.aliases||[])].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, section, type]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">База знаний</h1>
          <p className="text-muted-foreground">Определения и формулы ключевых метрик.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Поиск метрик..." value={query} onChange={(e)=>setQuery(e.target.value)} className="w-[280px]"/>
          <select className="border rounded-md h-9 px-2" value={section} onChange={(e)=>setSection(e.target.value)}>
            <option value="all">Все разделы</option>
            <option value="finance">Финансы</option>
            <option value="retention">Удержание</option>
            <option value="engagement">Вовлеченность</option>
          </select>
          <select className="border rounded-md h-9 px-2" value={type} onChange={(e)=>setType(e.target.value as any)}>
            <option value="all">Все типы</option>
            <option value="base">Базовые</option>
            <option value="derived">Производные</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(m => (
          <Card key={m.id} className="hover:shadow-sm transition">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{m.name}</CardTitle>
                <Badge variant="outline" className="text-xs">{m.section}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {m.type === 'base' ? 'Базовая' : 'Производная'}
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground line-clamp-3">
              {m.definition}
              <div className="pt-3">
                <Link href={`/knowledge-base/${m.id}`}>
                  <Button size="sm" variant="outline">Подробнее</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


