"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { MultiSelect } from "@/components/ui/multi-select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, Download, Upload, Calendar, Users, Globe, 
  Smartphone, DollarSign, Mail, Phone, Gamepad2, Link,
  Video, Tag, X, Settings, Building2
} from "lucide-react";
import type { FilterConfig, SegmentType } from "@/lib/types";

interface EnhancedFiltersProps {
  onApply: (filters: FilterConfig) => void;
  onExport?: (format: 'pdf' | 'excel') => void;
  defaultFilters?: FilterConfig;
}

// Список сегментов
const segments: { value: SegmentType; label: string }[] = [
  { value: 'all', label: 'Все игроки' },
  { value: 'vip', label: 'VIP' },
  { value: 'previp', label: 'ПреВИП' },
  { value: 'active', label: 'Активные' },
  { value: 'dep1', label: '1 депозит' },
  { value: 'dep2', label: '2 депозита' },
  { value: 'dep3', label: '3 депозита' },
  { value: 'dep4', label: '4 депозита' },
  { value: 'dep5', label: '5 депозитов' },
  { value: 'dep6', label: '6 депозитов' },
  { value: 'dep7', label: '7 депозитов' },
  { value: 'highroller', label: 'Хайроллеры' },
  { value: 'prechurn', label: 'Предотток' },
  { value: 'deepprechurn', label: 'Предотток глубокий' },
  { value: 'churn', label: 'Отток' },
  { value: 'deepchurn', label: 'Отток глубокий' },
  { value: 'reactivation', label: 'Реактивация' },
  { value: 'deepreactivation', label: 'Реактивация глубокая' },
  { value: 'sleeping', label: 'Спящий' }
];

// Список стран
const countries = [
  { value: 'de', label: 'Германия' },
  { value: 'fr', label: 'Франция' },
  { value: 'it', label: 'Италия' },
  { value: 'es', label: 'Испания' },
  { value: 'uk', label: 'Великобритания' },
  { value: 'pl', label: 'Польша' },
  { value: 'nl', label: 'Нидерланды' },
  { value: 'pt', label: 'Португалия' },
  { value: 'ru', label: 'Россия' },
  { value: 'ua', label: 'Украина' }
];

// Список валют - топ 25 мировых валют + топ 5 криптовалют
const currencies = [
  // Основные мировые валюты
  { value: 'USD', label: 'USD - Доллар США', group: 'Основные' },
  { value: 'EUR', label: 'EUR - Евро', group: 'Основные' },
  { value: 'GBP', label: 'GBP - Британский фунт', group: 'Основные' },
  { value: 'JPY', label: 'JPY - Японская иена', group: 'Основные' },
  { value: 'CNY', label: 'CNY - Китайский юань', group: 'Основные' },
  
  // Европейские валюты
  { value: 'CHF', label: 'CHF - Швейцарский франк', group: 'Европа' },
  { value: 'SEK', label: 'SEK - Шведская крона', group: 'Европа' },
  { value: 'NOK', label: 'NOK - Норвежская крона', group: 'Европа' },
  { value: 'DKK', label: 'DKK - Датская крона', group: 'Европа' },
  { value: 'PLN', label: 'PLN - Польский злотый', group: 'Европа' },
  { value: 'CZK', label: 'CZK - Чешская крона', group: 'Европа' },
  { value: 'HUF', label: 'HUF - Венгерский форинт', group: 'Европа' },
  { value: 'RON', label: 'RON - Румынский лей', group: 'Европа' },
  
  // Америка и Океания
  { value: 'CAD', label: 'CAD - Канадский доллар', group: 'Америка' },
  { value: 'AUD', label: 'AUD - Австралийский доллар', group: 'Океания' },
  { value: 'NZD', label: 'NZD - Новозеландский доллар', group: 'Океания' },
  { value: 'MXN', label: 'MXN - Мексиканское песо', group: 'Америка' },
  { value: 'BRL', label: 'BRL - Бразильский реал', group: 'Америка' },
  
  // Азия
  { value: 'SGD', label: 'SGD - Сингапурский доллар', group: 'Азия' },
  { value: 'HKD', label: 'HKD - Гонконгский доллар', group: 'Азия' },
  { value: 'KRW', label: 'KRW - Южнокорейская вона', group: 'Азия' },
  { value: 'INR', label: 'INR - Индийская рупия', group: 'Азия' },
  { value: 'THB', label: 'THB - Тайский бат', group: 'Азия' },
  { value: 'MYR', label: 'MYR - Малайзийский ринггит', group: 'Азия' },
  { value: 'IDR', label: 'IDR - Индонезийская рупия', group: 'Азия' },
  
  // Криптовалюты - топ 5
  { value: 'BTC', label: 'BTC - Bitcoin', group: 'Криптовалюты' },
  { value: 'ETH', label: 'ETH - Ethereum', group: 'Криптовалюты' },
  { value: 'USDT', label: 'USDT - Tether', group: 'Криптовалюты' },
  { value: 'BNB', label: 'BNB - Binance Coin', group: 'Криптовалюты' },
  { value: 'USDC', label: 'USDC - USD Coin', group: 'Криптовалюты' }
];

// Список языков
const languages = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'it', label: 'Italiano' },
  { value: 'ru', label: 'Русский' },
  { value: 'pt', label: 'Português' },
  { value: 'pl', label: 'Polski' }
];

// Функция для получения флага страны по коду валюты
const getCurrencyFlag = (currencyCode: string): string => {
  const flagMap: Record<string, string> = {
    'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'JPY': '🇯🇵', 'CNY': '🇨🇳',
    'CHF': '🇨🇭', 'SEK': '🇸🇪', 'NOK': '🇳🇴', 'DKK': '🇩🇰', 'PLN': '🇵🇱',
    'CZK': '🇨🇿', 'HUF': '🇭🇺', 'RON': '🇷🇴', 'CAD': '🇨🇦', 'AUD': '🇦🇺',
    'NZD': '🇳🇿', 'MXN': '🇲🇽', 'BRL': '🇧🇷', 'SGD': '🇸🇬', 'HKD': '🇭🇰',
    'KRW': '🇰🇷', 'INR': '🇮🇳', 'THB': '🇹🇭', 'MYR': '🇲🇾', 'IDR': '🇮🇩',
    // Криптовалюты
    'BTC': '₿', 'ETH': 'Ξ', 'USDT': '₮', 'BNB': '🔸', 'USDC': '💲'
  };
  return flagMap[currencyCode] || '';
};

export function EnhancedFilters({ onApply, onExport, defaultFilters = {} }: EnhancedFiltersProps) {
  const [filters, setFilters] = useState<FilterConfig>(defaultFilters);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);

  const handleDatePresetChange = (preset: string) => {
    const today = new Date();
    let from: Date | undefined;
    let to: Date | undefined;

    switch (preset) {
      case 'today':
        from = to = today;
        break;
      case 'yesterday':
        from = to = new Date(today.setDate(today.getDate() - 1));
        break;
      case 'week':
        from = new Date(today.setDate(today.getDate() - 7));
        to = new Date();
        break;
      case 'month':
        from = new Date(today.setMonth(today.getMonth() - 1));
        to = new Date();
        break;
    }

    setFilters(prev => ({
      ...prev,
      datePreset: preset as any,
      dateRange: preset === 'custom' ? prev.dateRange : (from && to ? { from, to } : undefined)
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedLogo(result);
        setFilters(prev => ({ ...prev, casinoLogo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    v !== undefined && v !== null && v !== '' && 
    (!Array.isArray(v) || v.length > 0) &&
    (typeof v !== 'object' || Object.keys(v).length > 0)
  ).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Фильтры и настройки</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} активных</Badge>
            )}
          </div>
          <div className="flex gap-2">
            {onExport && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onExport('pdf')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onExport('excel')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {isExpanded ? 'Свернуть' : 'Развернуть'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Основные фильтры - всегда видимы */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-4">
          {/* Проекты/Казино (мультивыбор с логотипами) */}
          <div className="space-y-2">
            <Label>Проекты</Label>
            <MultiSelect
              options={[
                { value: 'main', label: 'Основной проект', icon: 'https://placehold.co/24x24/7C3AED/FFF?text=A' },
                { value: 'vip', label: 'VIP Casino', icon: 'https://placehold.co/24x24/F59E0B/FFF?text=V' },
                { value: 'sport', label: 'Sport Betting', icon: 'https://placehold.co/24x24/10B981/FFF?text=S' },
                { value: 'poker', label: 'Poker Room', icon: 'https://placehold.co/24x24/EF4444/FFF?text=P' },
              ]}
              selected={(filters.projects as string[]) || (filters.projectBrand ? [filters.projectBrand] : [])}
              onChange={(selected) => setFilters(prev => ({ ...prev, projects: selected }))}
              placeholder="Выбрать проект(ы)"
              showSelectAll
              selectAllLabel="Выбрать все"
              summaryFormatter={(count) => `Выбрано: ${count} проектов`}
            />
          </div>

          {/* Диапазон дат */}
          <div className="space-y-2">
            <Label>Период</Label>
            <Select
              value={filters.datePreset || 'custom'}
              onValueChange={handleDatePresetChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Сегодня</SelectItem>
                <SelectItem value="yesterday">Вчера</SelectItem>
                <SelectItem value="week">Неделя</SelectItem>
                <SelectItem value="month">Месяц</SelectItem>
                <SelectItem value="custom">Выбрать период</SelectItem>
              </SelectContent>
            </Select>
            {filters.datePreset === 'custom' && (
              <DatePickerWithRange
                date={filters.dateRange}
                onDateChange={(date) => {
                  if (date?.from && date?.to) {
                    setFilters(prev => ({ ...prev, dateRange: { from: date.from as Date, to: date.to as Date } }));
                  }
                }}
              />
            )}
          </div>

          {/* Сегменты */}
          <div className="space-y-2">
            <Label>Сегменты</Label>
            <MultiSelect
              options={segments}
              selected={filters.segments || []}
              onChange={(selected) => setFilters(prev => ({ ...prev, segments: selected as SegmentType[] }))}
              placeholder="Выберите сегменты"
              showSelectAll
            />
          </div>

          {/* GEO / Страны (вынесено в основную панель) */}
          <div className="space-y-2">
            <Label>ГЕО</Label>
            <MultiSelect
              options={countries}
              selected={filters.countries || []}
              onChange={(selected) => setFilters(prev => ({ ...prev, countries: selected }))}
              placeholder="Выберите страны"
              showSelectAll
              selectAllLabel="Выбрать все"
              summaryFormatter={(count) => `Выбрано: ${count}`}
            />
          </div>

          {/* Валюта */}
          <div className="space-y-2">
            <Label>Валюта</Label>
            <Select
              value={filters.currency || ''}
              onValueChange={(value) => {
                setFilters(prev => ({ ...prev, currency: value }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {/* Группировка валют */}
                {['Основные', 'Европа', 'Америка', 'Океания', 'Азия', 'Криптовалюты'].map(group => {
                  const groupCurrencies = currencies.filter(c => c.group === group);
                  if (groupCurrencies.length === 0) return null;
                  
                  return (
                    <div key={group}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        {group}
                      </div>
                      {groupCurrencies.map(currency => (
                        <SelectItem key={currency.value} value={currency.value}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getCurrencyFlag(currency.value)}</span>
                            <span>{currency.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Расширенные фильтры - показываются при разворачивании */}
        {isExpanded && (
          <Tabs defaultValue="source" className="mt-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="source">Источники</TabsTrigger>
              <TabsTrigger value="demographics">Демография</TabsTrigger>
              <TabsTrigger value="behavior">Поведение</TabsTrigger>
              <TabsTrigger value="contacts">Контакты</TabsTrigger>
              <TabsTrigger value="campaigns">Кампании</TabsTrigger>
            </TabsList>

            <TabsContent value="source" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Тип источника</Label>
                  <Select
                    value={filters.sourceType || ''}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, sourceType: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">URL / TRID</SelectItem>
                      <SelectItem value="streamer">Стример</SelectItem>
                      <SelectItem value="organic">Органика</SelectItem>
                      <SelectItem value="promo">Промокод</SelectItem>
                      <SelectItem value="other">Прочее</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filters.sourceType === 'url' && (
                  <>
                    <div className="space-y-2">
                      <Label>URL источника</Label>
                      <Input
                        placeholder="example.com"
                        value={filters.sourceUrl || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, sourceUrl: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tracking ID</Label>
                      <Input
                        placeholder="TRID"
                        value={filters.trid || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, trid: e.target.value }))}
                      />
                    </div>
                  </>
                )}

                {filters.sourceType === 'streamer' && (
                  <div className="space-y-2">
                    <Label>Имя стримера</Label>
                    <Input
                      placeholder="Введите имя"
                      value={filters.streamerName || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, streamerName: e.target.value }))}
                    />
                  </div>
                )}

                {filters.sourceType === 'promo' && (
                  <div className="space-y-2">
                    <Label>Промокод</Label>
                    <Input
                      placeholder="PROMO2024"
                      value={filters.promoCode || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, promoCode: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="demographics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Устройство</Label>
                  <Select
                    value={filters.device || 'all'}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, device: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все устройства</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Пол</Label>
                  <Select
                    value={filters.gender || 'all'}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="male">Мужской</SelectItem>
                      <SelectItem value="female">Женский</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Страны</Label>
                  <MultiSelect
                    options={countries}
                    selected={filters.countries || []}
                    onChange={(selected) => setFilters(prev => ({ ...prev, countries: selected }))}
                    placeholder="Выберите страны"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Язык</Label>
                  <Select
                    value={typeof filters.language === 'string' ? filters.language : ''}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите язык" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Сумма депозита</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="От"
                        value={filters.depositAmount?.min || ''}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          depositAmount: {
                            ...prev.depositAmount,
                            min: parseInt(e.target.value)
                          }
                        }))}
                      />
                      <Input
                        type="number"
                        placeholder="До"
                        value={filters.depositAmount?.max || ''}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          depositAmount: {
                            ...prev.depositAmount,
                            max: parseInt(e.target.value)
                          }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Дата регистрации</Label>
                    <DatePickerWithRange
                      date={filters.registrationDate}
                      onDateChange={(date) => {
                        if (date?.from && date?.to) {
                          setFilters(prev => ({ ...prev, registrationDate: { from: date.from as Date, to: date.to as Date } }));
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Игры (макс. 5)</Label>
                    <MultiSelect
                      options={[
                        { value: 'slots', label: 'Слоты' },
                        { value: 'roulette', label: 'Рулетка' },
                        { value: 'blackjack', label: 'Блэкджек' },
                        { value: 'poker', label: 'Покер' },
                        { value: 'baccarat', label: 'Баккара' },
                        { value: 'sports', label: 'Спортбеттинг' }
                      ]}
                      selected={filters.playedGames || []}
                      onChange={(selected) => setFilters(prev => ({ 
                        ...prev, 
                        playedGames: selected.slice(0, 5) 
                      }))}
                      placeholder="Выберите игры"
                      maxSelected={5}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Дата последней игры</Label>
                    <DatePickerWithRange
                      date={filters.lastPlayDate}
                      onDateChange={(date) => {
                        if (date?.from && date?.to) {
                          setFilters(prev => ({ ...prev, lastPlayDate: { from: date.from as Date, to: date.to as Date } }));
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Дата последнего депозита</Label>
                    <DatePickerWithRange
                      date={filters.lastDepositDate}
                      onDateChange={(date) => {
                        if (date?.from && date?.to) {
                          setFilters(prev => ({ ...prev, lastDepositDate: { from: date.from as Date, to: date.to as Date } }));
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={filters.email || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Номер телефона</Label>
                  <Input
                    type="tel"
                    placeholder="+49123456789"
                    value={filters.phoneNumber || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="email-verified"
                    checked={filters.emailVerified || false}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, emailVerified: checked }))}
                  />
                  <Label htmlFor="email-verified">Только с верифицированным email</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Фильтр по кампаниям</h3>
                <MultiSelect
                  options={[
                    { value: 'welcome_bonus', label: 'Welcome Bonus' },
                    { value: 'vip_rewards', label: 'VIP Rewards' },
                    { value: 'weekend_promo', label: 'Weekend Promo' },
                    { value: 'birthday_campaign', label: 'Birthday Campaign' },
                    { value: 'reactivation_1', label: 'Reactivation Stage 1' },
                    { value: 'reactivation_2', label: 'Reactivation Stage 2' },
                    { value: 'cashback_tuesday', label: 'Cashback Tuesday' },
                    { value: 'loyalty_program', label: 'Loyalty Program' },
                    { value: 'tournament_invite', label: 'Tournament Invites' },
                    { value: 'deposit_bonus', label: 'Deposit Bonuses' }
                  ]}
                  selected={filters.campaigns || []}
                  onChange={(selected) => setFilters(prev => ({ ...prev, campaigns: selected }))}
                  placeholder="Выберите кампании"
                  showSelectAll
                  selectAllLabel="Выбрать все"
                />
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Кнопки действий */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setFilters({});
            }}
          >
            <X className="h-4 w-4 mr-2" />
            Сбросить
          </Button>
          <Button onClick={() => onApply(filters)}>
            Применить фильтры
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}