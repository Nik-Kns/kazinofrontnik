"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, ArrowRight, Check, Info, Plus, X, 
  Calculator, TrendingUp, Users, DollarSign, Activity,
  BarChart3, Target, Clock, Calendar, Percent,
  Hash, AlertCircle, Sparkles, Save, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

// Типы для метрик и формулы
interface Metric {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  example?: number;
}

interface FormulaElement {
  id: string;
  type: 'metric' | 'operator' | 'number' | 'parenthesis';
  value: string;
  displayName?: string;
}

// Доступные метрики
const availableMetrics: Metric[] = [
  // Финансовые метрики
  { id: "revenue", name: "Revenue", category: "Финансы", description: "Общий доход", unit: "€", example: 125000 },
  { id: "ggr", name: "GGR", category: "Финансы", description: "Gross Gaming Revenue", unit: "€", example: 87500 },
  { id: "ngr", name: "NGR", category: "Финансы", description: "Net Gaming Revenue", unit: "€", example: 75000 },
  { id: "deposits", name: "Депозиты", category: "Финансы", description: "Сумма всех депозитов", unit: "€", example: 150000 },
  { id: "withdrawals", name: "Выводы", category: "Финансы", description: "Сумма всех выводов", unit: "€", example: 62500 },
  { id: "bonus_cost", name: "Стоимость бонусов", category: "Финансы", description: "Затраты на бонусы", unit: "€", example: 12500 },
  
  // Пользовательские метрики
  { id: "active_users", name: "Активные юзеры", category: "Пользователи", description: "Количество активных пользователей", unit: "чел", example: 2500 },
  { id: "new_users", name: "Новые юзеры", category: "Пользователи", description: "Количество новых регистраций", unit: "чел", example: 450 },
  { id: "depositing_users", name: "Депозитеры", category: "Пользователи", description: "Юзеры с депозитами", unit: "чел", example: 890 },
  { id: "churned_users", name: "Отток", category: "Пользователи", description: "Количество ушедших юзеров", unit: "чел", example: 120 },
  
  // Игровые метрики
  { id: "total_bets", name: "Сумма ставок", category: "Игры", description: "Общая сумма всех ставок", unit: "€", example: 450000 },
  { id: "total_wins", name: "Сумма выигрышей", category: "Игры", description: "Общая сумма всех выигрышей", unit: "€", example: 362500 },
  { id: "bet_count", name: "Количество ставок", category: "Игры", description: "Общее количество ставок", unit: "шт", example: 125000 },
  { id: "game_sessions", name: "Игровые сессии", category: "Игры", description: "Количество игровых сессий", unit: "шт", example: 8900 },
  
  // Средние показатели
  { id: "arpu", name: "ARPU", category: "Средние", description: "Average Revenue Per User", unit: "€", example: 50 },
  { id: "arppu", name: "ARPPU", category: "Средние", description: "Average Revenue Per Paying User", unit: "€", example: 140 },
  { id: "avg_deposit", name: "Средний депозит", category: "Средние", description: "Средний размер депозита", unit: "€", example: 168 },
  { id: "avg_bet", name: "Средняя ставка", category: "Средние", description: "Средний размер ставки", unit: "€", example: 3.6 },
  { id: "ltv", name: "LTV", category: "Средние", description: "Lifetime Value", unit: "€", example: 250 },
  
  // Коэффициенты
  { id: "retention_d1", name: "Retention D1", category: "Retention", description: "Удержание на 1 день", unit: "%", example: 45 },
  { id: "retention_d7", name: "Retention D7", category: "Retention", description: "Удержание на 7 день", unit: "%", example: 28 },
  { id: "retention_d30", name: "Retention D30", category: "Retention", description: "Удержание на 30 день", unit: "%", example: 15 },
  { id: "conversion_rate", name: "Конверсия", category: "Конверсии", description: "Конверсия в депозит", unit: "%", example: 35.6 },
  { id: "churn_rate", name: "Churn Rate", category: "Отток", description: "Процент оттока", unit: "%", example: 4.8 },
];

// Операторы
const operators = [
  { id: "add", symbol: "+", name: "Сложение" },
  { id: "subtract", symbol: "-", name: "Вычитание" },
  { id: "multiply", symbol: "*", name: "Умножение" },
  { id: "divide", symbol: "/", name: "Деление" },
  { id: "percent", symbol: "%", name: "Процент" },
  { id: "power", symbol: "^", name: "Степень" },
];

export default function CustomMetricPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Шаг 1: Название и описание
  const [metricName, setMetricName] = useState("");
  const [metricDescription, setMetricDescription] = useState("");
  const [metricCategory, setMetricCategory] = useState("");
  const [metricUnit, setMetricUnit] = useState("€");
  
  // Шаг 2: Выбранные метрики
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Шаг 3: Формула
  const [formula, setFormula] = useState<FormulaElement[]>([]);
  const [formulaError, setFormulaError] = useState("");
  
  // Шаг 4: Предпросмотр
  const [testResult, setTestResult] = useState<number | null>(null);

  // Функции навигации
  const goNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Проверка валидности текущего шага
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return metricName.trim() !== "" && metricDescription.trim() !== "";
      case 2:
        return selectedMetrics.length >= 2;
      case 3:
        return formula.length > 0 && !formulaError;
      case 4:
        return true;
      default:
        return false;
    }
  };

  // Добавление метрики в формулу
  const addToFormula = (element: FormulaElement) => {
    setFormula([...formula, element]);
    setFormulaError("");
  };

  // Удаление элемента из формулы
  const removeFromFormula = (index: number) => {
    setFormula(formula.filter((_, i) => i !== index));
  };

  // Очистка формулы
  const clearFormula = () => {
    setFormula([]);
    setFormulaError("");
  };

  // Вычисление тестового результата
  const calculateTestResult = () => {
    try {
      // Здесь должна быть логика вычисления формулы
      // Для демонстрации используем случайное число
      const result = Math.random() * 1000;
      setTestResult(result);
    } catch (error) {
      setFormulaError("Ошибка в формуле");
    }
  };

  // Сохранение метрики
  const saveMetric = () => {
    const customMetric = {
      name: metricName,
      description: metricDescription,
      category: metricCategory,
      unit: metricUnit,
      formula: formula,
      createdAt: new Date().toISOString(),
    };
    
    // Сохранение в localStorage для демонстрации
    const savedMetrics = JSON.parse(localStorage.getItem('customMetrics') || '[]');
    savedMetrics.push(customMetric);
    localStorage.setItem('customMetrics', JSON.stringify(savedMetrics));
    
    // Возврат на страницу аналитики
    router.push('/analytics');
  };

  // Фильтрация метрик по поиску
  const filteredMetrics = availableMetrics.filter(metric =>
    metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    metric.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    metric.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Группировка метрик по категориям
  const groupedMetrics = filteredMetrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, Metric[]>);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Шапка */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/analytics')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к аналитике
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight">Создание кастомной метрики</h1>
        <p className="text-muted-foreground mt-1">
          Создайте свою метрику с помощью конструктора формул
        </p>
      </div>

      {/* Прогресс-бар */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Шаг {currentStep} из {totalSteps}
          </span>
          <span className="text-sm font-medium">
            {currentStep === 1 && "Основная информация"}
            {currentStep === 2 && "Выбор метрик"}
            {currentStep === 3 && "Создание формулы"}
            {currentStep === 4 && "Предпросмотр и сохранение"}
          </span>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
      </div>

      {/* Контент шагов */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Шаг 1: Основная информация */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="metric-name">Название метрики *</Label>
                  <Input
                    id="metric-name"
                    placeholder="Например: Средний депозит на активного пользователя"
                    value={metricName}
                    onChange={(e) => setMetricName(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Дайте понятное название вашей метрике
                  </p>
                </div>

                <div>
                  <Label htmlFor="metric-description">Описание *</Label>
                  <Textarea
                    id="metric-description"
                    placeholder="Опишите, что показывает эта метрика и для чего она нужна"
                    value={metricDescription}
                    onChange={(e) => setMetricDescription(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="metric-category">Категория</Label>
                    <Select value={metricCategory} onValueChange={setMetricCategory}>
                      <SelectTrigger id="metric-category" className="mt-1">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financial">Финансовые</SelectItem>
                        <SelectItem value="users">Пользователи</SelectItem>
                        <SelectItem value="gaming">Игровые</SelectItem>
                        <SelectItem value="retention">Retention</SelectItem>
                        <SelectItem value="conversion">Конверсии</SelectItem>
                        <SelectItem value="custom">Другое</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="metric-unit">Единица измерения</Label>
                    <Select value={metricUnit} onValueChange={setMetricUnit}>
                      <SelectTrigger id="metric-unit" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="€">€ (Евро)</SelectItem>
                        <SelectItem value="$">$ (Доллар)</SelectItem>
                        <SelectItem value="%">% (Процент)</SelectItem>
                        <SelectItem value="чел">Человек</SelectItem>
                        <SelectItem value="шт">Штук</SelectItem>
                        <SelectItem value="дни">Дни</SelectItem>
                        <SelectItem value="">Без единицы</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  После создания метрика будет доступна в разделе "Кастомные метрики" 
                  и может использоваться в дашбордах и отчетах
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Шаг 2: Выбор метрик */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label>Выберите метрики для формулы</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Выберите минимум 2 метрики, которые будут использоваться в формуле
                </p>
                
                <div className="mb-4">
                  <Input
                    placeholder="Поиск метрик..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <ScrollArea className="h-[400px] border rounded-lg p-4">
                  <div className="space-y-6">
                    {Object.entries(groupedMetrics).map(([category, metrics]) => (
                      <div key={category}>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          {category === "Финансы" && <DollarSign className="h-4 w-4" />}
                          {category === "Пользователи" && <Users className="h-4 w-4" />}
                          {category === "Игры" && <Activity className="h-4 w-4" />}
                          {category === "Средние" && <TrendingUp className="h-4 w-4" />}
                          {category === "Retention" && <Target className="h-4 w-4" />}
                          {category === "Конверсии" && <Percent className="h-4 w-4" />}
                          {category}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {metrics.map((metric) => (
                            <div
                              key={metric.id}
                              className={cn(
                                "p-3 border rounded-lg cursor-pointer transition-all",
                                selectedMetrics.includes(metric.id)
                                  ? "border-primary bg-primary/5"
                                  : "hover:border-primary/50"
                              )}
                              onClick={() => {
                                if (selectedMetrics.includes(metric.id)) {
                                  setSelectedMetrics(selectedMetrics.filter(id => id !== metric.id));
                                } else {
                                  setSelectedMetrics([...selectedMetrics, metric.id]);
                                }
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium">{metric.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {metric.description}
                                  </div>
                                  {metric.example && (
                                    <div className="text-xs mt-1">
                                      <Badge variant="secondary">
                                        Пример: {metric.example}{metric.unit}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                {selectedMetrics.includes(metric.id) && (
                                  <Check className="h-4 w-4 text-primary mt-1" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="mt-4">
                  <Badge variant="outline">
                    Выбрано метрик: {selectedMetrics.length}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Шаг 3: Конструктор формулы */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label>Создайте формулу</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Перетаскивайте метрики и операторы для создания формулы
                </p>

                <Tabs defaultValue="constructor">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="constructor">Конструктор</TabsTrigger>
                    <TabsTrigger value="text">Текстовый режим</TabsTrigger>
                  </TabsList>

                  <TabsContent value="constructor" className="space-y-4">
                    {/* Формула */}
                    <div className="min-h-[80px] p-4 border-2 border-dashed rounded-lg bg-muted/20">
                      {formula.length === 0 ? (
                        <div className="text-center text-muted-foreground">
                          Нажимайте на элементы ниже для добавления в формулу
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          {formula.map((element, index) => (
                            <div
                              key={index}
                              className={cn(
                                "px-3 py-1.5 rounded-md flex items-center gap-2",
                                element.type === 'metric' && "bg-blue-100 text-blue-900",
                                element.type === 'operator' && "bg-orange-100 text-orange-900",
                                element.type === 'number' && "bg-green-100 text-green-900",
                                element.type === 'parenthesis' && "bg-gray-100 text-gray-900"
                              )}
                            >
                              <span className="font-medium">
                                {element.displayName || element.value}
                              </span>
                              <button
                                onClick={() => removeFromFormula(index)}
                                className="hover:bg-black/10 rounded"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {formulaError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{formulaError}</AlertDescription>
                      </Alert>
                    )}

                    {/* Панель инструментов */}
                    <div className="space-y-4">
                      {/* Выбранные метрики */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Метрики</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMetrics.map(metricId => {
                            const metric = availableMetrics.find(m => m.id === metricId);
                            return metric ? (
                              <Button
                                key={metric.id}
                                variant="outline"
                                size="sm"
                                onClick={() => addToFormula({
                                  id: crypto.randomUUID(),
                                  type: 'metric',
                                  value: metric.id,
                                  displayName: metric.name
                                })}
                              >
                                <Plus className="mr-1 h-3 w-3" />
                                {metric.name}
                              </Button>
                            ) : null;
                          })}
                        </div>
                      </div>

                      {/* Операторы */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Операторы</h4>
                        <div className="flex gap-2">
                          {operators.map(op => (
                            <Button
                              key={op.id}
                              variant="outline"
                              size="sm"
                              onClick={() => addToFormula({
                                id: crypto.randomUUID(),
                                type: 'operator',
                                value: op.symbol,
                                displayName: op.symbol
                              })}
                            >
                              {op.symbol}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Дополнительные элементы */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Дополнительно</h4>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const number = prompt('Введите число:');
                              if (number && !isNaN(Number(number))) {
                                addToFormula({
                                  id: crypto.randomUUID(),
                                  type: 'number',
                                  value: number,
                                  displayName: number
                                });
                              }
                            }}
                          >
                            <Hash className="mr-1 h-3 w-3" />
                            Число
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToFormula({
                              id: crypto.randomUUID(),
                              type: 'parenthesis',
                              value: '(',
                              displayName: '('
                            })}
                          >
                            (
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToFormula({
                              id: crypto.randomUUID(),
                              type: 'parenthesis',
                              value: ')',
                              displayName: ')'
                            })}
                          >
                            )
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFormula}
                          >
                            Очистить
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Примеры формул */}
                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Примеры формул:</strong>
                        <ul className="mt-2 space-y-1 text-xs">
                          <li>• ARPU = Revenue / Активные юзеры</li>
                          <li>• Маржа = (GGR - Стоимость бонусов) / GGR * 100</li>
                          <li>• Средний депозит на юзера = Депозиты / Депозитеры</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4">
                    <Textarea
                      placeholder="Введите формулу в текстовом виде..."
                      rows={5}
                      className="font-mono"
                      value={formula.map(el => el.displayName || el.value).join(' ')}
                      onChange={(e) => {
                        // Здесь должен быть парсер текстовой формулы
                        console.log('Parsing formula:', e.target.value);
                      }}
                    />
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Используйте названия метрик из списка и стандартные математические операторы
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {/* Шаг 4: Предпросмотр и сохранение */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Предпросмотр метрики</h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{metricName || "Без названия"}</CardTitle>
                    <CardDescription>{metricDescription || "Без описания"}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Категория:</span>
                        <div className="font-medium">
                          {metricCategory ? 
                            metricCategory === 'financial' ? 'Финансовые' :
                            metricCategory === 'users' ? 'Пользователи' :
                            metricCategory === 'gaming' ? 'Игровые' :
                            metricCategory === 'retention' ? 'Retention' :
                            metricCategory === 'conversion' ? 'Конверсии' :
                            'Другое'
                          : 'Не указана'}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Единица измерения:</span>
                        <div className="font-medium">{metricUnit || "Без единицы"}</div>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">Формула:</span>
                      <div className="p-3 bg-muted rounded-md mt-1 font-mono text-sm">
                        {formula.length > 0 
                          ? formula.map(el => el.displayName || el.value).join(' ')
                          : "Формула не задана"
                        }
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">Используемые метрики:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedMetrics.map(metricId => {
                          const metric = availableMetrics.find(m => m.id === metricId);
                          return metric ? (
                            <Badge key={metric.id} variant="secondary">
                              {metric.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>

                    {/* Тестовое вычисление */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-muted-foreground">Тестовое значение:</span>
                          <div className="text-2xl font-bold">
                            {testResult !== null 
                              ? `${testResult.toFixed(2)}${metricUnit}`
                              : "—"
                            }
                          </div>
                        </div>
                        <Button 
                          onClick={calculateTestResult}
                          variant="outline"
                        >
                          <Calculator className="mr-2 h-4 w-4" />
                          Рассчитать
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    После сохранения метрика появится в списке кастомных метрик и будет доступна 
                    для использования в дашбордах. Вы сможете редактировать или удалить её в любое время.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Навигационные кнопки */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goPrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/analytics')}
          >
            Отмена
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={goNext}
              disabled={!isStepValid()}
            >
              Далее
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={saveMetric}
              disabled={!isStepValid()}
              className="min-w-[120px]"
            >
              <Save className="mr-2 h-4 w-4" />
              Сохранить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}