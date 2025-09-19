/**
 * Утилиты для безопасного рендеринга React элементов
 * Предотвращают ошибки типа React #185/#418 при рендеринге объектов
 */

/**
 * Безопасно преобразует любое значение в строку для React рендеринга
 * Обрабатывает: null, undefined, объекты, массивы, примитивы
 */
export function safeRenderValue(value: unknown): string {
  // Проверка на null/undefined
  if (value === null || value === undefined) {
    return '';
  }
  
  // Проверка на React элементы - они должны рендериться как есть
  if (typeof value === 'object' && value !== null && 
      '_owner' in value && '_store' in value) {
    return String(value);
  }
  
  // Проверка на массивы
  if (Array.isArray(value)) {
    return value.map(item => safeRenderValue(item)).filter(Boolean).join(', ');
  }
  
  // Проверка на объекты (включая Date)
  if (typeof value === 'object') {
    // Специальная обработка для Date
    if (value instanceof Date) {
      return value.toLocaleDateString('ru-RU');
    }
    
    // Проверка на наличие toString метода
    if ('toString' in value && typeof value.toString === 'function') {
      const stringified = value.toString();
      // Проверяем что toString вернул не [object Object]
      if (stringified !== '[object Object]') {
        return stringified;
      }
    }
    
    // Попытка использовать JSON.stringify для отладки
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '[Complex Object]';
    }
  }
  
  // Проверка на функции
  if (typeof value === 'function') {
    return '[Function]';
  }
  
  // Для примитивов (string, number, boolean, symbol, bigint)
  return String(value);
}

/**
 * Обертка для безопасного рендеринга с дефолтным значением
 */
export function safeRender(value: unknown, defaultValue: string = ''): string {
  const result = safeRenderValue(value);
  return result || defaultValue;
}

/**
 * Безопасное соединение строк и переменных
 */
export function safeJoin(
  values: unknown[], 
  separator: string = ' '
): string {
  return values
    .map(v => safeRenderValue(v))
    .filter(Boolean)
    .join(separator);
}

/**
 * Безопасный рендер с условием
 */
export function safeConditionalRender(
  condition: boolean,
  trueValue: unknown,
  falseValue: unknown = ''
): string {
  return condition 
    ? safeRenderValue(trueValue)
    : safeRenderValue(falseValue);
}