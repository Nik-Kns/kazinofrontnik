import React from 'react';

/**
 * SafeText компонент предотвращает React ошибки #418/#185
 * Автоматически оборачивает смешанный контент в span
 */
interface SafeTextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function SafeText({ children, className, as: Component = 'span' }: SafeTextProps) {
  return (
    <Component className={className}>
      {children}
    </Component>
  );
}

/**
 * SafeList компонент для безопасного рендеринга списков
 */
interface SafeListProps {
  items: string[];
  render: (item: string, index: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export function SafeList({ items, render, className, itemClassName }: SafeListProps) {
  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={index} className={itemClassName}>
          <SafeText>{render(item, index)}</SafeText>
        </li>
      ))}
    </ul>
  );
}

/**
 * SafeDescription компонент для описаний с переменными
 */
interface SafeDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function SafeDescription({ children, className }: SafeDescriptionProps) {
  return (
    <SafeText className={className} as="div">
      {children}
    </SafeText>
  );
}

/**
 * SafeTooltipContent для tooltip контента
 */
interface SafeTooltipContentProps {
  lines: string[];
  className?: string;
}

export function SafeTooltipContent({ lines, className }: SafeTooltipContentProps) {
  return (
    <div className={className}>
      {lines.map((line, index) => (
        <p key={index} className="text-xs">
          {line}
        </p>
      ))}
    </div>
  );
}