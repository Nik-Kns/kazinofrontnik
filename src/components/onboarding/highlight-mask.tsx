'use client';

import { useEffect, useState } from 'react';

interface HighlightMaskProps {
  targetSelector?: string;
  isActive: boolean;
  padding?: number;
}

/**
 * Компонент затемнения всего экрана с вырезом для подсвечиваемого элемента
 */
export function HighlightMask({ targetSelector, isActive, padding = 8 }: HighlightMaskProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isActive || !targetSelector) {
      setTargetRect(null);
      return;
    }

    const updateTargetRect = () => {
      const element = document.querySelector(targetSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      }
    };

    // Обновляем позицию сразу и при изменении размеров окна
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect);

    // Используем MutationObserver для отслеживания изменений DOM
    const observer = new MutationObserver(updateTargetRect);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect);
      observer.disconnect();
    };
  }, [targetSelector, isActive]);

  if (!isActive) return null;

  // Если нет целевого элемента, показываем обычное затемнение
  if (!targetRect) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-all duration-300" />
    );
  }

  // Создаём SVG с вырезом для подсветки элемента
  const highlightX = targetRect.left - padding;
  const highlightY = targetRect.top - padding;
  const highlightWidth = targetRect.width + padding * 2;
  const highlightHeight = targetRect.height + padding * 2;

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <mask id="highlight-mask">
            {/* Белый фон - всё затемнено */}
            <rect width="100%" height="100%" fill="white" />
            {/* Чёрный вырез - прозрачная область */}
            <rect
              x={highlightX}
              y={highlightY}
              width={highlightWidth}
              height={highlightHeight}
              rx="12"
              fill="black"
            />
          </mask>
        </defs>

        {/* Затемнённая область с вырезом */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.6)"
          mask="url(#highlight-mask)"
          className="backdrop-blur-sm"
        />

        {/* Подсветка вокруг выреза */}
        <rect
          x={highlightX}
          y={highlightY}
          width={highlightWidth}
          height={highlightHeight}
          rx="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-blue-400 animate-pulse"
          style={{
            filter: 'drop-shadow(0 0 12px currentColor)'
          }}
        />
      </svg>

      {/* Блокируем клики везде кроме подсвеченного элемента */}
      <div
        className="absolute inset-0 pointer-events-auto"
        style={{
          clipPath: `polygon(
            0% 0%,
            0% 100%,
            100% 100%,
            100% 0%,
            0% 0%,
            ${highlightX}px ${highlightY}px,
            ${highlightX}px ${highlightY + highlightHeight}px,
            ${highlightX + highlightWidth}px ${highlightY + highlightHeight}px,
            ${highlightX + highlightWidth}px ${highlightY}px,
            ${highlightX}px ${highlightY}px
          )`
        }}
      />
    </div>
  );
}
