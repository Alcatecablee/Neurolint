/**
 * VS Code API Mock for Testing
 * Provides mock implementations of commonly used VS Code APIs
 */

export enum ConfigurationTarget {
  Global = 1,
  Workspace = 2,
  WorkspaceFolder = 3
}

export enum DiagnosticSeverity {
  Error = 0,
  Warning = 1,
  Information = 2,
  Hint = 3
}

export enum TreeItemCollapsibleState {
  None = 0,
  Collapsed = 1,
  Expanded = 2
}

export class Uri {
  readonly scheme: string;
  readonly authority: string;
  readonly path: string;
  readonly query: string;
  readonly fragment: string;
  readonly fsPath: string;

  private constructor(scheme: string, authority: string, path: string, query: string, fragment: string) {
    this.scheme = scheme;
    this.authority = authority;
    this.path = path;
    this.query = query;
    this.fragment = fragment;
    this.fsPath = path;
  }

  static file(path: string): Uri {
    return new Uri('file', '', path, '', '');
  }

  static parse(value: string): Uri {
    return new Uri('file', '', value, '', '');
  }

  toString(): string {
    return this.path;
  }
}

export class Position {
  readonly line: number;
  readonly character: number;

  constructor(line: number, character: number) {
    this.line = line;
    this.character = character;
  }
}

export class Range {
  readonly start: Position;
  readonly end: Position;

  constructor(start: Position, end: Position);
  constructor(startLine: number, startCharacter: number, endLine: number, endCharacter: number);
  constructor(
    startOrStartLine: Position | number,
    endOrStartCharacter: Position | number,
    endLine?: number,
    endCharacter?: number
  ) {
    if (typeof startOrStartLine === 'number') {
      this.start = new Position(startOrStartLine, endOrStartCharacter as number);
      this.end = new Position(endLine!, endCharacter!);
    } else {
      this.start = startOrStartLine;
      this.end = endOrStartCharacter as Position;
    }
  }
}

export class Diagnostic {
  range: Range;
  message: string;
  severity: DiagnosticSeverity;
  source?: string;
  code?: string | number;

  constructor(range: Range, message: string, severity?: DiagnosticSeverity) {
    this.range = range;
    this.message = message;
    this.severity = severity ?? DiagnosticSeverity.Error;
  }
}

export class TreeItem {
  label?: string;
  collapsibleState?: TreeItemCollapsibleState;
  iconPath?: any;
  description?: string;
  tooltip?: string;
  command?: any;
  contextValue?: string;

  constructor(label: string, collapsibleState?: TreeItemCollapsibleState) {
    this.label = label;
    this.collapsibleState = collapsibleState;
  }
}

export class EventEmitter<T> {
  private listeners: ((e: T) => void)[] = [];

  event = (listener: (e: T) => void) => {
    this.listeners.push(listener);
    return { dispose: () => this.listeners = this.listeners.filter(l => l !== listener) };
  };

  fire(data: T): void {
    this.listeners.forEach(listener => listener(data));
  }

  dispose(): void {
    this.listeners = [];
  }
}

class MockOutputChannel {
  private lines: string[] = [];
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  appendLine(value: string): void {
    this.lines.push(value);
  }

  append(value: string): void {
    this.lines.push(value);
  }

  clear(): void {
    this.lines = [];
  }

  show(): void {}
  hide(): void {}
  dispose(): void {}

  getLines(): string[] {
    return [...this.lines];
  }
}

class MockStatusBarItem {
  text: string = '';
  tooltip: string = '';
  command: string | undefined;
  backgroundColor: any;

  show(): void {}
  hide(): void {}
  dispose(): void {}
}

class MockConfiguration {
  private config: Record<string, any> = {
    apiUrl: 'https://app.neurolint.dev/api',
    apiKey: '',
    enabledLayers: [1, 2, 3, 4, 5, 6, 7],
    autoFix: false,
    showInlineHints: true,
    diagnosticsLevel: 'warning',
    timeout: 30000,
    'workspace.excludePatterns': ['**/node_modules/**', '**/dist/**'],
    'workspace.includePatterns': ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    'workspace.maxFileSize': 10485760,
    'workspace.maxFiles': 1000
  };

  get<T>(key: string, defaultValue?: T): T {
    const value = this.config[key];
    return value !== undefined ? value : (defaultValue as T);
  }

  async update(key: string, value: any, target?: ConfigurationTarget): Promise<void> {
    this.config[key] = value;
  }

  has(key: string): boolean {
    return key in this.config;
  }

  inspect<T>(key: string): any {
    return { key, defaultValue: this.config[key] };
  }

  setForTesting(key: string, value: any): void {
    this.config[key] = value;
  }
}

const mockConfiguration = new MockConfiguration();

export const workspace = {
  workspaceFolders: [{ uri: Uri.file('/test/workspace'), name: 'test', index: 0 }],
  
  getConfiguration: (section?: string) => mockConfiguration,

  fs: {
    readFile: async (uri: Uri): Promise<Buffer> => {
      return Buffer.from('{}');
    },
    writeFile: async (uri: Uri, content: Uint8Array): Promise<void> => {},
    stat: async (uri: Uri): Promise<any> => ({ type: 1, size: 100 }),
    readDirectory: async (uri: Uri): Promise<[string, number][]> => []
  },

  onDidChangeConfiguration: (callback: (e: any) => void) => ({ dispose: () => {} }),
  onDidOpenTextDocument: (callback: (e: any) => void) => ({ dispose: () => {} }),
  onDidCloseTextDocument: (callback: (e: any) => void) => ({ dispose: () => {} }),
  onDidChangeTextDocument: (callback: (e: any) => void) => ({ dispose: () => {} }),
  onDidSaveTextDocument: (callback: (e: any) => void) => ({ dispose: () => {} }),

  findFiles: async (include: string, exclude?: string): Promise<Uri[]> => [],
  openTextDocument: async (uri: Uri): Promise<any> => ({
    getText: () => '',
    fileName: uri.fsPath,
    languageId: 'typescript'
  }),

  _mockConfig: mockConfiguration
};

export const window = {
  createOutputChannel: (name: string) => new MockOutputChannel(name),
  
  createStatusBarItem: () => new MockStatusBarItem(),

  showInformationMessage: async (message: string, ...items: string[]): Promise<string | undefined> => undefined,
  showWarningMessage: async (message: string, ...items: string[]): Promise<string | undefined> => undefined,
  showErrorMessage: async (message: string, ...items: string[]): Promise<string | undefined> => undefined,

  showQuickPick: async (items: any[], options?: any): Promise<any> => items[0],
  showInputBox: async (options?: any): Promise<string | undefined> => 'test-input',

  showOpenDialog: async (options?: any): Promise<Uri[] | undefined> => undefined,
  showSaveDialog: async (options?: any): Promise<Uri | undefined> => undefined,

  activeTextEditor: undefined as any,
  visibleTextEditors: [] as any[],

  registerTreeDataProvider: (viewId: string, provider: any) => ({ dispose: () => {} }),
  createTreeView: (viewId: string, options: any) => ({ dispose: () => {} }),

  withProgress: async (options: any, task: (progress: any, token: any) => Promise<any>): Promise<any> => {
    return task({ report: () => {} }, { isCancellationRequested: false });
  },

  onDidChangeActiveTextEditor: (callback: (e: any) => void) => ({ dispose: () => {} })
};

export const languages = {
  createDiagnosticCollection: (name: string) => ({
    name,
    set: () => {},
    delete: () => {},
    clear: () => {},
    dispose: () => {},
    forEach: () => {},
    get: () => undefined,
    has: () => false
  }),

  registerCodeActionsProvider: (selector: any, provider: any) => ({ dispose: () => {} }),
  registerHoverProvider: (selector: any, provider: any) => ({ dispose: () => {} }),
  registerCompletionItemProvider: (selector: any, provider: any) => ({ dispose: () => {} })
};

export const commands = {
  registerCommand: (command: string, callback: (...args: any[]) => any) => ({ dispose: () => {} }),
  executeCommand: async (command: string, ...args: any[]): Promise<any> => undefined,
  getCommands: async (): Promise<string[]> => []
};

export const extensions = {
  getExtension: (extensionId: string): any => undefined,
  all: [] as any[]
};

export class ThemeIcon {
  constructor(public readonly id: string) {}
}

export class ThemeColor {
  constructor(public readonly id: string) {}
}

export const ProgressLocation = {
  Notification: 15,
  SourceControl: 1,
  Window: 10
};

export const StatusBarAlignment = {
  Left: 1,
  Right: 2
};

export default {
  ConfigurationTarget,
  DiagnosticSeverity,
  TreeItemCollapsibleState,
  Uri,
  Position,
  Range,
  Diagnostic,
  TreeItem,
  EventEmitter,
  ThemeIcon,
  ThemeColor,
  ProgressLocation,
  StatusBarAlignment,
  workspace,
  window,
  languages,
  commands,
  extensions
};
