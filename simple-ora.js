/**
 * NeuroLint - Simple ora replacement for CommonJS compatibility
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

class SimpleSpinner {
  constructor(text) {
    this.text = text;
    this.isSpinning = false;
  }

  start() {
    this.isSpinning = true;
    process.stdout.write(`${this.text}...\n`);
    return this;
  }

  succeed(text) {
    if (this.isSpinning) {
      process.stdout.write(`[OK] ${text || this.text}\n`);
      this.isSpinning = false;
    }
    return this;
  }

  fail(text) {
    if (this.isSpinning) {
      process.stdout.write(`[ERROR] ${text || this.text}\n`);
      this.isSpinning = false;
    }
    return this;
  }

  warn(text) {
    if (this.isSpinning) {
      process.stdout.write(`⚠ ${text || this.text}\n`);
      this.isSpinning = false;
    }
    return this;
  }

  info(text) {
    if (this.isSpinning) {
      process.stdout.write(`ℹ ${text || this.text}\n`);
      this.isSpinning = false;
    }
    return this;
  }

  stop() {
    this.isSpinning = false;
    return this;
  }
}

module.exports = (text) => new SimpleSpinner(text);
