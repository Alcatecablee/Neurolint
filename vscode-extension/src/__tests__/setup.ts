/**
 * Jest Test Setup for VS Code Extension
 * Configures global mocks and test utilities
 */

import * as vscode from 'vscode';

beforeAll(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

jest.mock('fs/promises', () => ({
  access: jest.fn().mockResolvedValue(undefined),
  readFile: jest.fn().mockResolvedValue('{}'),
  writeFile: jest.fn().mockResolvedValue(undefined),
  mkdir: jest.fn().mockResolvedValue(undefined),
  stat: jest.fn().mockResolvedValue({ size: 100, isFile: () => true }),
  readdir: jest.fn().mockResolvedValue([])
}));

jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: (...args: string[]) => args.join('/'),
  resolve: (...args: string[]) => args.join('/'),
  dirname: (p: string) => p.split('/').slice(0, -1).join('/'),
  basename: (p: string) => p.split('/').pop() || ''
}));
