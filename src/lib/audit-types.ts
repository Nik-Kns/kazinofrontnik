// Типы для системы аудита проекта

export type AuditStatus = 'passed' | 'failed' | 'missing' | 'running' | 'review';

export interface AuditChecklistItem {
  id: string;                 // 'A1', 'B2'...
  section: string;            // 'A. Интеграция данных'
  title: string;              // 'A1. Полнота источников'
  shortDescription: string;   // "ИИ проверяет, что загружены ..."
  status: AuditStatus;
  lastCheckedAt?: string;     // ISO
  dataSources: string[];      // ['players','deposits','bets','bonuses','comm_events']
  howWeCheckShort: string;    // "COUNT/date ranges, сверка ±2%..."
  fixes?: Array<{label: string; href: string}>; // CTA "Исправить"
  moreLink?: string;          // ссылка на деталку/логи
  aiNotes?: string;           // краткая заметка ИИ (почему статус такой)
}

export interface AuditSection {
  id: string;                 // 'A','B', ...
  title: string;              // 'A. Интеграция данных'
  items: AuditChecklistItem[];
}

export interface AuditSnapshot {
  projectId: string;
  overallProgressPct: number; // 0..100
  updatedAt: string;
  sections: AuditSection[];
  criticalIds: string[];      // id пунктов со статусом failed/missing высокого приоритета
}

export interface StartAuditRequest { 
  projectId: string; 
  force?: boolean;
}

export interface StartAuditResponse { 
  auditId: string; 
  startedAt: string;
}

export interface AuditStatusResponse {
  auditId: string;
  snapshot: AuditSnapshot;
}