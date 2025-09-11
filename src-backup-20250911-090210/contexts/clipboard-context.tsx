"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ClipboardItem, ClipboardItemType, CopyMoveValidation, PasteTarget } from '@/lib/types';

interface ClipboardContextType {
  clipboard: ClipboardItem | null;
  copy: (item: ClipboardItem) => void;
  cut: (item: ClipboardItem) => void;
  paste: (targetId: string, targetType: ClipboardItemType) => Promise<boolean>;
  clear: () => void;
  canPaste: (targetType: ClipboardItemType) => boolean;
  validateCopyMove: (sourceType: ClipboardItemType, targetType: ClipboardItemType) => CopyMoveValidation;
  getPasteTargets: () => PasteTarget[];
  isItemCut: (itemId: string) => boolean;
}

const ClipboardContext = createContext<ClipboardContextType | undefined>(undefined);

// Validation rules for copy/move operations
const COPY_MOVE_RULES: Record<ClipboardItemType, { accepts: ClipboardItemType[]; canAccept: ClipboardItemType[] }> = {
  campaign: {
    accepts: [], // Campaigns can't be pasted into anything
    canAccept: ['scenario'], // Campaigns can accept scenarios
  },
  scenario: {
    accepts: ['campaign'], // Scenarios can be pasted into campaigns
    canAccept: ['communication', 'ab_test'], // Scenarios can accept communications and A/B tests
  },
  communication: {
    accepts: ['scenario'], // Communications can be pasted into scenarios
    canAccept: ['ab_variant'], // Communications can accept A/B variants
  },
  ab_test: {
    accepts: ['scenario'], // A/B tests can be pasted into scenarios
    canAccept: ['ab_variant'], // A/B tests can accept variants
  },
  ab_variant: {
    accepts: ['communication', 'ab_test'], // A/B variants can be pasted into communications or A/B tests
    canAccept: [], // A/B variants can't accept anything
  },
};

export function ClipboardProvider({ children }: { children: React.ReactNode }) {
  const [clipboard, setClipboard] = useState<ClipboardItem | null>(null);

  const copy = useCallback((item: ClipboardItem) => {
    const clipboardItem: ClipboardItem = {
      ...item,
      operation: 'copy',
      timestamp: Date.now(),
    };
    setClipboard(clipboardItem);
    
    // Store in localStorage for persistence across tabs
    localStorage.setItem('clipboard', JSON.stringify(clipboardItem));
  }, []);

  const cut = useCallback((item: ClipboardItem) => {
    const clipboardItem: ClipboardItem = {
      ...item,
      operation: 'cut',
      timestamp: Date.now(),
    };
    setClipboard(clipboardItem);
    
    // Store in localStorage for persistence across tabs
    localStorage.setItem('clipboard', JSON.stringify(clipboardItem));
  }, []);

  const paste = useCallback(async (targetId: string, targetType: ClipboardItemType): Promise<boolean> => {
    if (!clipboard) return false;

    const validation = validateCopyMove(clipboard.type, targetType);
    if (!validation.allowed) {
      console.warn('Paste operation not allowed:', validation.reason);
      return false;
    }

    try {
      // Here would be the actual API call to copy/move the element
      // For now, we'll simulate the operation
      console.log(`${clipboard.operation} ${clipboard.type} ${clipboard.id} to ${targetType} ${targetId}`);
      
      // If it was a cut operation, clear the clipboard
      if (clipboard.operation === 'cut') {
        clear();
      }
      
      return true;
    } catch (error) {
      console.error('Paste operation failed:', error);
      return false;
    }
  }, [clipboard]);

  const clear = useCallback(() => {
    setClipboard(null);
    localStorage.removeItem('clipboard');
  }, []);

  const canPaste = useCallback((targetType: ClipboardItemType): boolean => {
    if (!clipboard) return false;
    const validation = validateCopyMove(clipboard.type, targetType);
    return validation.allowed;
  }, [clipboard]);

  const validateCopyMove = useCallback((sourceType: ClipboardItemType, targetType: ClipboardItemType): CopyMoveValidation => {
    const sourceRules = COPY_MOVE_RULES[sourceType];
    
    if (!sourceRules.accepts.includes(targetType)) {
      return {
        allowed: false,
        reason: `${sourceType} cannot be pasted into ${targetType}`,
      };
    }

    // Check for circular dependencies
    if (sourceType === targetType) {
      return {
        allowed: false,
        reason: `Cannot paste ${sourceType} into itself`,
      };
    }

    return {
      allowed: true,
      warnings: [],
    };
  }, []);

  const getPasteTargets = useCallback((): PasteTarget[] => {
    if (!clipboard) return [];

    // This would normally come from the application state
    // For now, return mock targets based on clipboard type
    const sourceRules = COPY_MOVE_RULES[clipboard.type];
    const targets: PasteTarget[] = [];

    sourceRules.accepts.forEach(targetType => {
      // Add mock targets - in real implementation, this would come from actual data
      if (targetType === 'campaign') {
        targets.push({
          id: 'camp1',
          name: 'Реактивация High Rollers',
          type: 'campaign',
          level: 0,
          path: ['Campaigns'],
        });
      } else if (targetType === 'scenario') {
        targets.push({
          id: 'sc101',
          name: 'Push — бонус на депозит',
          type: 'scenario',
          level: 1,
          path: ['Campaigns', 'Реактивация High Rollers'],
        });
      }
    });

    return targets;
  }, [clipboard]);

  const isItemCut = useCallback((itemId: string): boolean => {
    return clipboard?.operation === 'cut' && clipboard.id === itemId;
  }, [clipboard]);

  // Load clipboard from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('clipboard');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check if clipboard item is not too old (e.g., 24 hours)
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setClipboard(parsed);
        } else {
          localStorage.removeItem('clipboard');
        }
      } catch (error) {
        localStorage.removeItem('clipboard');
      }
    }
  }, []);

  const value: ClipboardContextType = {
    clipboard,
    copy,
    cut,
    paste,
    clear,
    canPaste,
    validateCopyMove,
    getPasteTargets,
    isItemCut,
  };

  return (
    <ClipboardContext.Provider value={value}>
      {children}
    </ClipboardContext.Provider>
  );
}

export function useClipboard() {
  const context = useContext(ClipboardContext);
  if (context === undefined) {
    throw new Error('useClipboard must be used within a ClipboardProvider');
  }
  return context;
}
