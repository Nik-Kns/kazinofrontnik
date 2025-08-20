"use client";

import * as React from "react";
import { Copy, Move, Scissors, Clipboard, Target, MoreHorizontal } from "lucide-react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/contexts/clipboard-context";
import type { ClipboardItem, ClipboardItemType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CopyMoveMenuProps {
  item: {
    id: string;
    type: ClipboardItemType;
    data: any;
    name?: string;
  };
  sourceId?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  showPasteOption?: boolean;
  onPaste?: (targetId: string) => void;
}

export function CopyMoveContextMenu({
  item,
  sourceId,
  children,
  className,
  disabled = false,
  showPasteOption = false,
  onPaste,
}: CopyMoveMenuProps) {
  const { copy, cut, clipboard, canPaste, paste, isItemCut } = useClipboard();

  const handleCopy = () => {
    if (disabled) return;
    
    const clipboardItem: ClipboardItem = {
      id: item.id,
      type: item.type,
      data: item.data,
      sourceId,
      operation: 'copy',
      timestamp: Date.now(),
    };
    copy(clipboardItem);
  };

  const handleCut = () => {
    if (disabled) return;
    
    const clipboardItem: ClipboardItem = {
      id: item.id,
      type: item.type,
      data: item.data,
      sourceId,
      operation: 'cut',
      timestamp: Date.now(),
    };
    cut(clipboardItem);
  };

  const handlePaste = async () => {
    if (!canPaste(item.type) || !onPaste) return;
    
    const success = await paste(item.id, item.type);
    if (success && onPaste) {
      onPaste(item.id);
    }
  };

  const isCut = isItemCut(item.id);
  const canPasteHere = showPasteOption && canPaste(item.type);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className={cn(isCut && "opacity-50", className)}>
          {children}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={handleCopy} disabled={disabled}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Копировать {getItemTypeLabel(item.type)}</span>
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleCut} disabled={disabled}>
          <Scissors className="mr-2 h-4 w-4" />
          <span>Вырезать {getItemTypeLabel(item.type)}</span>
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        
        {canPasteHere && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={handlePaste}>
              <Clipboard className="mr-2 h-4 w-4" />
              <span>Вставить {clipboard ? getItemTypeLabel(clipboard.type) : 'элемент'}</span>
              <ContextMenuShortcut>⌘V</ContextMenuShortcut>
            </ContextMenuItem>
          </>
        )}
        
        <ContextMenuSeparator />
        <ContextMenuItem disabled>
          <Target className="mr-2 h-4 w-4" />
          <span>Перенести в...</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function CopyMoveDropdownMenu({
  item,
  sourceId,
  disabled = false,
  showPasteOption = false,
  onPaste,
  className,
}: Omit<CopyMoveMenuProps, 'children'> & { className?: string }) {
  const { copy, cut, clipboard, canPaste, paste, isItemCut } = useClipboard();

  const handleCopy = () => {
    if (disabled) return;
    
    const clipboardItem: ClipboardItem = {
      id: item.id,
      type: item.type,
      data: item.data,
      sourceId,
      operation: 'copy',
      timestamp: Date.now(),
    };
    copy(clipboardItem);
  };

  const handleCut = () => {
    if (disabled) return;
    
    const clipboardItem: ClipboardItem = {
      id: item.id,
      type: item.type,
      data: item.data,
      sourceId,
      operation: 'cut',
      timestamp: Date.now(),
    };
    cut(clipboardItem);
  };

  const handlePaste = async () => {
    if (!canPaste(item.type) || !onPaste) return;
    
    const success = await paste(item.id, item.type);
    if (success && onPaste) {
      onPaste(item.id);
    }
  };

  const isCut = isItemCut(item.id);
  const canPasteHere = showPasteOption && canPaste(item.type);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("h-8 w-8", isCut && "opacity-50", className)}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={handleCopy} disabled={disabled}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Копировать {getItemTypeLabel(item.type)}</span>
          <span className="ml-auto text-xs tracking-widest text-muted-foreground">⌘C</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCut} disabled={disabled}>
          <Scissors className="mr-2 h-4 w-4" />
          <span>Вырезать {getItemTypeLabel(item.type)}</span>
          <span className="ml-auto text-xs tracking-widest text-muted-foreground">⌘X</span>
        </DropdownMenuItem>
        
        {canPasteHere && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handlePaste}>
              <Clipboard className="mr-2 h-4 w-4" />
              <span>Вставить {clipboard ? getItemTypeLabel(clipboard.type) : 'элемент'}</span>
              <span className="ml-auto text-xs tracking-widest text-muted-foreground">⌘V</span>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Target className="mr-2 h-4 w-4" />
          <span>Перенести в...</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getItemTypeLabel(type: ClipboardItemType): string {
  switch (type) {
    case 'campaign':
      return 'кампанию';
    case 'scenario':
      return 'сценарий';
    case 'communication':
      return 'коммуникацию';
    case 'ab_test':
      return 'A/B тест';
    case 'ab_variant':
      return 'вариант';
    default:
      return 'элемент';
  }
}

// Hook for keyboard shortcuts
export function useKeyboardShortcuts() {
  const { copy, cut, paste, clipboard } = useClipboard();

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'c':
            if (document.activeElement && 
                document.activeElement.getAttribute('data-clipboard-item')) {
              event.preventDefault();
              // Get the currently focused item
              const itemData = document.activeElement.getAttribute('data-clipboard-item');
              if (itemData) {
                try {
                  const item = JSON.parse(itemData);
                  copy(item);
                } catch (error) {
                  console.error('Failed to parse clipboard item:', error);
                }
              }
            }
            break;
          case 'x':
            if (document.activeElement && 
                document.activeElement.getAttribute('data-clipboard-item')) {
              event.preventDefault();
              // Get the currently focused item
              const itemData = document.activeElement.getAttribute('data-clipboard-item');
              if (itemData) {
                try {
                  const item = JSON.parse(itemData);
                  cut(item);
                } catch (error) {
                  console.error('Failed to parse clipboard item:', error);
                }
              }
            }
            break;
          case 'v':
            if (clipboard && document.activeElement && 
                document.activeElement.getAttribute('data-paste-target')) {
              event.preventDefault();
              const targetData = document.activeElement.getAttribute('data-paste-target');
              if (targetData) {
                try {
                  const target = JSON.parse(targetData);
                  paste(target.id, target.type);
                } catch (error) {
                  console.error('Failed to parse paste target:', error);
                }
              }
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [copy, cut, paste, clipboard]);
}
