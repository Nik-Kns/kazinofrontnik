"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Wand2, 
  Palette, 
  Image, 
  Sparkles, 
  Download, 
  Eye,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Zap,
  Gift,
  Trophy,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreativeGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignType?: string;
  campaignName?: string;
}

export function CreativeGeneratorModal({
  open,
  onOpenChange,
  campaignType = 'reactivation',
  campaignName = 'Новая кампания'
}: CreativeGeneratorModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCreatives, setGeneratedCreatives] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [primaryColor, setPrimaryColor] = useState('#2962FF');
  const [style, setStyle] = useState('vibrant');
  const [tone, setTone] = useState('exciting');
  const [customPrompt, setCustomPrompt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const templates = [
    { id: 'modern', name: 'Современный', description: 'Чистый минималистичный дизайн' },
    { id: 'luxury', name: 'Люкс', description: 'Премиальный золотой стиль' },
    { id: 'neon', name: 'Неон', description: 'Яркие неоновые цвета' },
    { id: 'classic', name: 'Классика', description: 'Традиционный казино стиль' }
  ];

  const styles = [
    { id: 'vibrant', name: 'Яркий', icon: Zap },
    { id: 'elegant', name: 'Элегантный', icon: Star },
    { id: 'playful', name: 'Игривый', icon: Gift },
    { id: 'professional', name: 'Профессиональный', icon: Trophy }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Симуляция генерации креативов
    setTimeout(() => {
      const mockCreatives = [
        {
          id: '1',
          type: 'banner',
          size: '1200x628',
          title: 'Вернись и получи бонус!',
          subtitle: 'До 500 фриспинов ждут тебя',
          cta: 'Забрать бонус',
          preview: '/api/placeholder/1200/628',
          format: 'social'
        },
        {
          id: '2',
          type: 'banner',
          size: '300x250',
          title: 'Скучаешь?',
          subtitle: '100% бонус на депозит',
          cta: 'Играть сейчас',
          preview: '/api/placeholder/300/250',
          format: 'display'
        },
        {
          id: '3',
          type: 'email',
          size: '600x400',
          title: 'Мы по тебе скучаем!',
          subtitle: 'Эксклюзивное предложение внутри',
          cta: 'Открыть подарок',
          preview: '/api/placeholder/600/400',
          format: 'email'
        }
      ];
      
      setGeneratedCreatives(mockCreatives);
      setIsGenerating(false);
    }, 3000);
  };

  const handleCopy = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Генератор креативов
          </DialogTitle>
          <DialogDescription>
            Создайте персонализированные креативы для кампании "{campaignName}"
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="settings" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Настройки</TabsTrigger>
            <TabsTrigger value="results" disabled={generatedCreatives.length === 0}>
              Результаты {generatedCreatives.length > 0 && `(${generatedCreatives.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6 mt-4">
            {/* Выбор шаблона */}
            <div className="space-y-3">
              <Label>Шаблон дизайна</Label>
              <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={template.id} id={template.id} />
                      <Label htmlFor={template.id} className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground">{template.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Стиль */}
            <div className="space-y-3">
              <Label>Стиль креатива</Label>
              <div className="grid grid-cols-2 gap-3">
                {styles.map((s) => (
                  <Card 
                    key={s.id}
                    className={cn(
                      "cursor-pointer transition-all",
                      style === s.id && "border-primary bg-primary/5"
                    )}
                    onClick={() => setStyle(s.id)}
                  >
                    <CardContent className="flex items-center gap-3 p-3">
                      <s.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{s.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Основной цвет */}
            <div className="space-y-3">
              <Label htmlFor="color">Основной цвет бренда</Label>
              <div className="flex gap-3">
                <Input
                  id="color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#2962FF"
                  className="flex-1"
                />
              </div>
            </div>

            <Separator />

            {/* Тон сообщения */}
            <div className="space-y-3">
              <Label>Тон сообщения</Label>
              <RadioGroup value={tone} onValueChange={setTone}>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exciting" id="exciting" />
                    <Label htmlFor="exciting">Захватывающий</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="friendly" id="friendly" />
                    <Label htmlFor="friendly">Дружелюбный</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="urgent" />
                    <Label htmlFor="urgent">Срочный</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Дополнительные инструкции */}
            <div className="space-y-3">
              <Label htmlFor="prompt">Дополнительные пожелания (опционально)</Label>
              <Textarea
                id="prompt"
                placeholder="Например: Добавить золотые монеты, использовать изображения слотов..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                AI создаст 3-5 вариантов креативов для разных форматов: социальные сети, 
                email и дисплейная реклама
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="results" className="space-y-4 mt-4">
            <div className="grid gap-4">
              {generatedCreatives.map((creative) => (
                <Card key={creative.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-48 h-32 bg-muted rounded-lg overflow-hidden">
                        <Image className="absolute inset-0 m-auto h-12 w-12 text-muted-foreground" />
                        <Badge className="absolute top-2 left-2 text-xs">
                          {creative.size}
                        </Badge>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="font-semibold">{creative.title}</h4>
                          <p className="text-sm text-muted-foreground">{creative.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{creative.format}</Badge>
                          <Badge variant="outline">{creative.cta}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-3 w-3" />
                            Просмотр
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-3 w-3" />
                            Скачать
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCopy(creative.id)}
                          >
                            {copiedId === creative.id ? (
                              <Check className="mr-2 h-3 w-3" />
                            ) : (
                              <Copy className="mr-2 h-3 w-3" />
                            )}
                            Копировать
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert className="border-green-200 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Готово!</strong> Креативы созданы и готовы к использованию. 
                Вы можете скачать их или сразу применить в кампании.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          {generatedCreatives.length === 0 ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Сгенерировать креативы
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setGeneratedCreatives([])}>
                Сгенерировать заново
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                Применить и закрыть
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}