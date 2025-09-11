"use client";

import * as React from "react";
import { Search, FolderOpen, Target, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useClipboard } from "@/contexts/clipboard-context";
import type { PasteTarget, ClipboardItemType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PasteTargetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaste: (targetId: string, targetType: ClipboardItemType) => void;
  availableTargets?: PasteTarget[];
}

export function PasteTargetDialog({ 
  open, 
  onOpenChange, 
  onPaste,
  availableTargets 
}: PasteTargetDialogProps) {
  const { clipboard, getPasteTargets } = useClipboard();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTarget, setSelectedTarget] = React.useState<PasteTarget | null>(null);

  const targets = availableTargets || getPasteTargets();
  
  const filteredTargets = React.useMemo(() => {
    if (!searchQuery) return targets;
    
    return targets.filter(target => 
      target.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      target.path.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [targets, searchQuery]);

  const handlePaste = () => {
    if (selectedTarget) {
      onPaste(selectedTarget.id, selectedTarget.type);
      onOpenChange(false);
      setSelectedTarget(null);
      setSearchQuery('');
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedTarget(null);
    setSearchQuery('');
  };

  if (!clipboard) return null;

  const getTypeIcon = (type: ClipboardItemType) => {
    switch (type) {
      case 'campaign':
        return '📊';
      case 'scenario':
        return '🎯';
      case 'communication':
        return '📧';
      case 'ab_test':
        return '🧪';
      case 'ab_variant':
        return '🔀';
      default:
        return '📄';
    }
  };

  const getTypeLabel = (type: ClipboardItemType) => {
    switch (type) {
      case 'campaign':
        return 'Кампания';
      case 'scenario':
        return 'Сценарий';
      case 'communication':
        return 'Коммуникация';
      case 'ab_test':
        return 'A/B тест';
      case 'ab_variant':
        return 'Вариант';
      default:
        return 'Элемент';
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-blue-100 text-blue-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-purple-100 text-purple-800';
      case 3: return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Выбор места для вставки
          </DialogTitle>
          <DialogDescription>
            Выберите, куда вставить {getTypeLabel(clipboard.type).toLowerCase()} 
            "{clipboard.data?.name || clipboard.id}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Source Item Info */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getTypeIcon(clipboard.type)}</span>
              <div>
                <h4 className="font-medium">
                  {clipboard.operation === 'copy' ? 'Копирование' : 'Перенос'}: {getTypeLabel(clipboard.type)}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {clipboard.data?.name || clipboard.id}
                </p>
              </div>
              <Badge variant={clipboard.operation === 'copy' ? 'default' : 'secondary'} className="ml-auto">
                {clipboard.operation === 'copy' ? 'Копировать' : 'Перенести'}
              </Badge>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск места для вставки..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Targets List */}
          <ScrollArea className="h-64 border rounded-lg">
            <div className="p-2 space-y-1">
              {filteredTargets.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <FolderOpen className="h-8 w-8 mx-auto mb-2" />
                  <p>Нет подходящих мест для вставки</p>
                  {searchQuery && (
                    <p className="text-sm">Попробуйте изменить поисковый запрос</p>
                  )}
                </div>
              ) : (
                filteredTargets.map((target) => (
                  <div
                    key={target.id}
                    onClick={() => setSelectedTarget(target)}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                      selectedTarget?.id === target.id && "bg-primary/10 border border-primary/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getTypeIcon(target.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">{target.name}</h4>
                          <Badge variant="outline" className={cn("text-xs", getLevelColor(target.level))}>
                            {getTypeLabel(target.type)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          {target.path.map((segment, index) => (
                            <React.Fragment key={index}>
                              {index > 0 && <span>›</span>}
                              <span className="truncate">{segment}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      {selectedTarget?.id === target.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <Separator />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Отмена
            </Button>
            <Button 
              onClick={handlePaste} 
              disabled={!selectedTarget}
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              {clipboard.operation === 'copy' ? 'Вставить копию' : 'Перенести сюда'}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-lg">
            <p className="font-medium mb-1">💡 Подсказка:</p>
            <p>
              {clipboard.operation === 'copy' 
                ? 'При копировании создается дубликат элемента со всеми настройками.'
                : 'При переносе элемент будет перемещен из исходного места в выбранное.'
              }
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
