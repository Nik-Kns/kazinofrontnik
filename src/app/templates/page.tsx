import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { templatesData } from "@/lib/mock-data";
import { ClipboardCopy, Filter, LayoutGrid, List, Mail, MessageSquare, PlusCircle, Smartphone, Star, Zap } from "lucide-react";


const channelIcons = {
  Email: Mail,
  Push: Smartphone,
  SMS: MessageSquare,
  InApp: Zap,
  "Multi-channel": Zap,
};

const PerformanceStars = ({ count }: { count: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
    ))}
  </div>
);

export default function TemplatesPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Шаблоны сценариев</h1>
            <p className="text-muted-foreground">Библиотека готовых шаблонов для быстрого старта ваших кампаний.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Поиск по шаблонам..." className="pl-10" />
            </div>
            <Button variant="outline">Категории</Button>
            <Button variant="outline" size="icon"><List className="h-4 w-4"/></Button>
            <Button variant="secondary" size="icon"><LayoutGrid className="h-4 w-4"/></Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templatesData.map(template => {
          const ChannelIcon = channelIcons[template.channel];
          return (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <Badge variant="secondary" className="mb-2">{template.category}</Badge>
                        <CardTitle>{template.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <ChannelIcon className="h-5 w-5"/>
                        <span>{template.channel}</span>
                    </div>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-end">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Эффективность</p>
                        <PerformanceStars count={template.performance} />
                    </div>
                    <Button>
                        <ClipboardCopy className="mr-2 h-4 w-4" />
                        Клонировать
                    </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
