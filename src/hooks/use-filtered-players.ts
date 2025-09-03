import { useState, useEffect, useMemo } from 'react';
import { extendedPlayersData, type ExtendedPlayerData } from '@/lib/mock-multicurrency-players';
import { type CurrencyFiltersState } from '@/components/ui/currency-filters';
import { filterPlayersByCurrency } from '@/lib/currency-utils';
import type { FilterConfig } from "@/lib/types";

export function useFilteredPlayers(
  initialFilters: FilterConfig,
  initialCurrencyFilters: CurrencyFiltersState
) {
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState<ExtendedPlayerData[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [currencyFilters, setCurrencyFilters] = useState(initialCurrencyFilters);

  useEffect(() => {
    // Имитация асинхронной загрузки данных
    const timer = setTimeout(() => {
      setPlayers(extendedPlayersData || []);
      setIsLoading(false);
    }, 500); // небольшая задержка для имитации загрузки

    return () => clearTimeout(timer);
  }, []);

  const filteredPlayers = useMemo(() => {
    if (isLoading) {
      return [];
    }

    let filtered = players;

    // TODO: Добавить логику для основных фильтров (filters)

    // Применяем валютные фильтры
    if (currencyFilters) {
      filtered = filterPlayersByCurrency(filtered, {
        currencies: currencyFilters.selected_currencies || [],
        isMultiCurrency: currencyFilters.is_multi_currency,
        amountRange: currencyFilters.amount_range,
      });
    }

    return filtered;
  }, [players, filters, currencyFilters, isLoading]);

  return {
    isLoading,
    filteredPlayers,
    setFilters,
    setCurrencyFilters,
    totalPlayersCount: players.length,
  };
}
