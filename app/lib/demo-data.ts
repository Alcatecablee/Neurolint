/**
 * Demo Data for Testing Dashboard Without Database
 */

import { DEMO_USER } from './demo-mode';

export const DEMO_PROJECTS = [
  {
    id: 'project-1',
    user_id: DEMO_USER.id,
    name: 'E-commerce Platform',
    description: 'Next.js storefront with React 19',
    files: ['src/app/page.tsx', 'src/components/ProductCard.tsx', 'src/lib/api.ts'],
    stats: {
      totalFiles: 142,
      linesOfCode: 8934,
      issuesFixed: 67,
      lastAnalyzed: new Date(Date.now() - 3600000).toISOString(),
    },
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    last_analyzed: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'project-2',
    user_id: DEMO_USER.id,
    name: 'Admin Dashboard',
    description: 'Internal tools and analytics',
    files: ['app/dashboard/page.tsx', 'components/DataTable.tsx'],
    stats: {
      totalFiles: 89,
      linesOfCode: 5621,
      issuesFixed: 42,
      lastAnalyzed: new Date(Date.now() - 86400000).toISOString(),
    },
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    last_analyzed: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'project-3',
    user_id: DEMO_USER.id,
    name: 'Marketing Website',
    description: 'Company landing pages',
    files: ['pages/index.tsx', 'components/Hero.tsx'],
    stats: {
      totalFiles: 34,
      linesOfCode: 2145,
      issuesFixed: 18,
      lastAnalyzed: new Date(Date.now() - 172800000).toISOString(),
    },
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    last_analyzed: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const DEMO_ANALYSIS_HISTORY = [
  {
    id: 'analysis-1',
    user_id: DEMO_USER.id,
    filename: 'src/components/ProductCard.tsx',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    result: {
      issuesFound: 8,
      issuesFixed: 8,
      layers: [2, 3, 4],
      fixes: [
        { type: 'accessibility', description: 'Added aria-labels to buttons' },
        { type: 'hydration', description: 'Wrapped localStorage in useEffect' },
        { type: 'patterns', description: 'Removed console.log statements' },
      ],
    },
    layers: [2, 3, 4],
    execution_time: 1234,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'analysis-2',
    user_id: DEMO_USER.id,
    filename: 'app/dashboard/page.tsx',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    result: {
      issuesFound: 12,
      issuesFixed: 12,
      layers: [1, 2, 3, 4, 5],
      fixes: [
        { type: 'config', description: 'Updated tsconfig.json' },
        { type: 'nextjs', description: 'Added use client directive' },
        { type: 'accessibility', description: 'Fixed image alt text' },
      ],
    },
    layers: [1, 2, 3, 4, 5],
    execution_time: 2456,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const DEMO_API_KEYS = [
  {
    id: 'key-1',
    user_id: DEMO_USER.id,
    name: 'Production API Key',
    key_hash: 'nl_prod_****************************abcd',
    permissions: { analyze: true, fix: true, migrate: true },
    last_used: new Date(Date.now() - 7200000).toISOString(),
    expires_at: new Date(Date.now() + 365 * 86400000).toISOString(),
    is_active: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'key-2',
    user_id: DEMO_USER.id,
    name: 'Development API Key',
    key_hash: 'nl_dev_****************************xyz9',
    permissions: { analyze: true, fix: false, migrate: false },
    last_used: new Date(Date.now() - 86400000).toISOString(),
    expires_at: null,
    is_active: true,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'key-3',
    user_id: DEMO_USER.id,
    name: 'CI/CD Pipeline',
    key_hash: 'nl_ci_****************************123f',
    permissions: { analyze: true, fix: true, migrate: false },
    last_used: new Date(Date.now() - 14400000).toISOString(),
    expires_at: new Date(Date.now() + 90 * 86400000).toISOString(),
    is_active: false,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 14400000).toISOString(),
  },
];

export const DEMO_TEAMS = [
  {
    id: 'team-1',
    name: 'Frontend Team',
    description: 'UI/UX development team',
    owner_id: DEMO_USER.id,
    settings: { defaultLayers: [2, 3, 4, 5] },
    created_at: new Date(Date.now() - 120 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
];

export const DEMO_TEAM_MEMBERS = [
  {
    id: 'member-1',
    team_id: 'team-1',
    user_id: DEMO_USER.id,
    role: 'owner' as const,
    joined_at: new Date(Date.now() - 120 * 86400000).toISOString(),
  },
  {
    id: 'member-2',
    team_id: 'team-1',
    user_id: 'user-2',
    role: 'admin' as const,
    joined_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
];

export const DEMO_COLLABORATION_SESSIONS = [
  {
    id: 'session-1',
    session_id: 'collab-session-1',
    name: 'Product Page Refactor',
    description: 'Modernizing product display components',
    host_user_id: DEMO_USER.id,
    document_content: `import React from 'react';\n\nfunction ProductCard({ product }) {\n  return <div>{product.name}</div>;\n}`,
    filename: 'components/ProductCard.tsx',
    language: 'typescript',
    is_active: true,
    participant_count: 2,
    is_public: false,
    last_activity: new Date(Date.now() - 1800000).toISOString(),
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
  },
];

export const DEMO_USAGE_LOGS = [
  {
    id: 'log-1',
    user_id: DEMO_USER.id,
    action: 'analyze',
    metadata: { project: 'E-commerce Platform', files: 12 },
    files_processed: 12,
    layers_used: [2, 3, 4],
    execution_time_ms: 3450,
    cost_usd: 0.05,
    credits_used: 12,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'log-2',
    user_id: DEMO_USER.id,
    action: 'fix',
    metadata: { project: 'Admin Dashboard', files: 8 },
    files_processed: 8,
    layers_used: [1, 2, 3, 4, 5],
    execution_time_ms: 5230,
    cost_usd: 0.08,
    credits_used: 20,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const DEMO_USER_SETTINGS = {
  id: 'settings-1',
  user_id: DEMO_USER.id,
  default_layers: [2, 3, 4, 5],
  auto_save: true,
  notifications: true,
  theme: 'dark' as const,
  email_notifications: true,
  webhook_notifications: false,
  onboarding_completed: true,
  onboarding_data: { step: 'complete' },
  collaboration_enabled: true,
  created_at: DEMO_USER.created_at,
  updated_at: new Date().toISOString(),
};
