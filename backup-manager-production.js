/**
 * NeuroLint - Production Backup Manager
 * Enhanced backup system for production environments
 * 
 * Copyright (c) 2025 NeuroLint
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const BackupManager = require('./backup-manager');

class ProductionBackupManager extends BackupManager {
  constructor(options = {}) {
    super(options);
    this.environment = options.environment || 'production';
    this.loggerConfig = options.loggerConfig || {};
  }

  async createBackup(filePath, content) {
    // Enhanced backup with logging
    if (this.loggerConfig.enableConsole) {
      console.log(`[BACKUP] Creating backup for ${filePath}`);
    }
    
    return super.createBackup(filePath, content);
  }
}

module.exports = { ProductionBackupManager };
