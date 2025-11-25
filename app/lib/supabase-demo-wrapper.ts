/**
 * Supabase Demo Wrapper
 * Returns mock data when in demo mode, real Supabase client otherwise
 */

import { isDemoMode, DEMO_USER, DEMO_SESSION } from './demo-mode';
import {
  DEMO_PROJECTS,
  DEMO_ANALYSIS_HISTORY,
  DEMO_API_KEYS,
  DEMO_TEAMS,
  DEMO_TEAM_MEMBERS,
  DEMO_COLLABORATION_SESSIONS,
  DEMO_USAGE_LOGS,
  DEMO_USER_SETTINGS,
} from './demo-data';

interface DemoResponse<T> {
  data: T | null;
  error: Error | null;
}

export class DemoSupabaseClient {
  auth = {
    getSession: async () => ({
      data: { session: DEMO_SESSION },
      error: null,
    }),
    getUser: async () => ({
      data: { user: DEMO_USER },
      error: null,
    }),
    setSession: async (session: any) => {
      console.log('[Demo Mode] setSession called', session);
      return {
        data: { session: DEMO_SESSION, user: DEMO_USER },
        error: null,
      };
    },
    refreshSession: async (refreshToken?: string) => {
      console.log('[Demo Mode] refreshSession called');
      return {
        data: { session: DEMO_SESSION, user: DEMO_USER },
        error: null,
      };
    },
    exchangeCodeForSession: async (code: string) => {
      console.log('[Demo Mode] exchangeCodeForSession called');
      return {
        data: { session: DEMO_SESSION, user: DEMO_USER },
        error: null,
      };
    },
    signInWithPassword: async () => ({
      data: { session: DEMO_SESSION, user: DEMO_USER },
      error: null,
    }),
    signUp: async () => ({
      data: { session: DEMO_SESSION, user: DEMO_USER },
      error: null,
    }),
    signOut: async () => {
      console.log('[Demo Mode] signOut called');
      return { error: null };
    },
    resetPasswordForEmail: async () => ({
      data: {},
      error: null,
    }),
    updateUser: async (updates: any) => {
      console.log('[Demo Mode] updateUser called', updates);
      return {
        data: { user: { ...DEMO_USER, ...updates } },
        error: null,
      };
    },
    onAuthStateChange: (callback: any) => {
      setTimeout(() => callback('SIGNED_IN', DEMO_SESSION), 100);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  };

  from(table: string) {
    return new DemoQueryBuilder(table);
  }

  rpc(fn: string, params?: any) {
    console.log(`[Demo Mode] RPC call: ${fn}`, params);
    return Promise.resolve({ data: null, error: null });
  }
}

class DemoQueryBuilder {
  private table: string;
  private filters: any[] = [];
  private selectFields: string = '*';
  private limitValue?: number;
  private orderFields: any[] = [];

  constructor(table: string) {
    this.table = table;
  }

  select(fields: string = '*') {
    this.selectFields = fields;
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ type: 'eq', column, value });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push({ type: 'neq', column, value });
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push({ type: 'in', column, values });
    return this;
  }

  gt(column: string, value: any) {
    this.filters.push({ type: 'gt', column, value });
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push({ type: 'gte', column, value });
    return this;
  }

  lt(column: string, value: any) {
    this.filters.push({ type: 'lt', column, value });
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push({ type: 'lte', column, value });
    return this;
  }

  like(column: string, pattern: string) {
    this.filters.push({ type: 'like', column, pattern });
    return this;
  }

  ilike(column: string, pattern: string) {
    this.filters.push({ type: 'ilike', column, pattern });
    return this;
  }

  is(column: string, value: any) {
    this.filters.push({ type: 'is', column, value });
    return this;
  }

  not(column: string, value: any) {
    this.filters.push({ type: 'not', column, value });
    return this;
  }

  contains(column: string, value: any) {
    this.filters.push({ type: 'contains', column, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderFields.push({ column, ascending: options?.ascending ?? true });
    return this;
  }

  limit(count: number) {
    this.limitValue = count;
    return this;
  }

  range(from: number, to: number) {
    this.filters.push({ type: 'range', from, to });
    return this;
  }

  single() {
    return this.execute(true);
  }

  maybeSingle() {
    return this.execute(true);
  }

  async execute(single: boolean = false): Promise<DemoResponse<any>> {
    console.log(`[Demo Mode] Query ${this.table}:`, { filters: this.filters, single });

    let data = this.getTableData();

    if (!data) {
      return { data: null, error: new Error(`Table ${this.table} not found in demo data`) };
    }

    data = this.applyFilters(data);
    data = this.applyOrdering(data);

    if (this.limitValue) {
      data = data.slice(0, this.limitValue);
    }

    if (single) {
      return { data: data[0] || null, error: null };
    }

    return { data, error: null };
  }

  private getTableData(): any[] {
    const tableMap: Record<string, any[]> = {
      profiles: [DEMO_USER],
      projects: DEMO_PROJECTS,
      analysis_history: DEMO_ANALYSIS_HISTORY,
      api_keys: DEMO_API_KEYS,
      teams: DEMO_TEAMS,
      team_members: DEMO_TEAM_MEMBERS,
      collaboration_sessions: DEMO_COLLABORATION_SESSIONS,
      usage_logs: DEMO_USAGE_LOGS,
      user_settings: [DEMO_USER_SETTINGS],
    };

    return tableMap[this.table] || [];
  }

  private applyFilters(data: any[]): any[] {
    let result = data.filter(item => {
      return this.filters.every(filter => {
        const value = item[filter.column];
        
        switch (filter.type) {
          case 'eq':
            return value === filter.value;
          case 'neq':
            return value !== filter.value;
          case 'in':
            return filter.values.includes(value);
          case 'gt':
            return value > filter.value;
          case 'gte':
            return value >= filter.value;
          case 'lt':
            return value < filter.value;
          case 'lte':
            return value <= filter.value;
          case 'like':
          case 'ilike':
            const pattern = filter.pattern.replace(/%/g, '.*').replace(/_/g, '.');
            const regex = new RegExp(pattern, filter.type === 'ilike' ? 'i' : '');
            return regex.test(String(value));
          case 'is':
            return value === filter.value || (filter.value === null && value === null);
          case 'not':
            return value !== filter.value;
          case 'contains':
            if (Array.isArray(value)) {
              return value.includes(filter.value);
            }
            if (typeof value === 'string') {
              return value.includes(filter.value);
            }
            return false;
          case 'range':
            // Range is handled separately after filtering
            return true;
          default:
            return true;
        }
      });
    });

    // Apply range filter
    const rangeFilter = this.filters.find(f => f.type === 'range');
    if (rangeFilter) {
      result = result.slice(rangeFilter.from, rangeFilter.to + 1);
    }

    return result;
  }

  private applyOrdering(data: any[]): any[] {
    if (this.orderFields.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const order of this.orderFields) {
        const aVal = a[order.column];
        const bVal = b[order.column];
        
        if (aVal === bVal) continue;
        
        const comparison = aVal < bVal ? -1 : 1;
        return order.ascending ? comparison : -comparison;
      }
      return 0;
    });
  }

  async insert(values: any) {
    console.log(`[Demo Mode] Insert into ${this.table}:`, values);
    return { data: values, error: null };
  }

  async update(values: any) {
    console.log(`[Demo Mode] Update ${this.table}:`, values);
    return { data: values, error: null };
  }

  async delete() {
    console.log(`[Demo Mode] Delete from ${this.table}`);
    return { data: null, error: null };
  }

  async upsert(values: any) {
    console.log(`[Demo Mode] Upsert ${this.table}:`, values);
    return { data: values, error: null };
  }
}

export function getSupabaseClient() {
  if (isDemoMode()) {
    console.log('[Demo Mode] Using demo Supabase client');
    return new DemoSupabaseClient() as any;
  }

  // Return real Supabase client
  const { supabase } = require('./supabase-client');
  return supabase;
}
