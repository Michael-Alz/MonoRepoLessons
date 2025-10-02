import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { watch } from 'chokidar';
import { ID, Result, success, failure } from '../../core/types.js';
import { DataStore, Task, Project, Tag } from '../entities.js';
import { Storage } from '../repository.js';
import { getCurrentTimestamp } from '../validation.js';

/**
 * JSON storage adapter with atomic writes and file watching
 */
export class JsonStorageAdapter implements Storage {
  private dataPath: string;
  private lockPath: string;
  private watcher?: any;
  private isWatching: boolean = false;

  constructor(dataPath?: string) {
    this.dataPath = dataPath || join(homedir(), '.todo', 'data.json');
    this.lockPath = this.dataPath + '.lock';
  }

  /**
   * Load data from JSON file
   */
  async load(): Promise<Result<DataStore>> {
    try {
      // Check if file exists
      if (!(await this.exists())) {
        return success(this.getDefaultDataStore());
      }

      // Read and parse JSON
      const data = await fs.readFile(this.dataPath, 'utf-8');
      const parsed = JSON.parse(data) as DataStore;

      // Validate and migrate if needed
      const migrated = await this.migrateData(parsed);
      return success(migrated);
    } catch (error) {
      return failure(new Error(`Failed to load data: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }

  /**
   * Save data to JSON file atomically
   */
  async save(data: DataStore): Promise<Result<void>> {
    try {
      // Ensure directory exists
      await fs.mkdir(dirname(this.dataPath), { recursive: true });

      // Create lock file
      await this.acquireLock();

      try {
        // Write to temporary file first
        const tempPath = this.dataPath + '.tmp';
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(tempPath, jsonData, 'utf-8');

        // Atomic rename
        await fs.rename(tempPath, this.dataPath);

        return success(undefined);
      } finally {
        // Always release lock
        await this.releaseLock();
      }
    } catch (error) {
      // Clean up temp file if it exists
      try {
        await fs.unlink(this.dataPath + '.tmp');
      } catch {
        // Ignore cleanup errors
      }
      
      return failure(new Error(`Failed to save data: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }

  /**
   * Check if storage exists
   */
  async exists(): Promise<boolean> {
    try {
      await fs.access(this.dataPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Create backup
   */
  async backup(): Promise<Result<string>> {
    try {
      if (!(await this.exists())) {
        return failure(new Error('No data to backup'));
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = this.dataPath.replace('.json', `-backup-${timestamp}.json`);
      
      await fs.copyFile(this.dataPath, backupPath);
      return success(backupPath);
    } catch (error) {
      return failure(new Error(`Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }

  /**
   * Restore from backup
   */
  async restore(backupPath: string): Promise<Result<void>> {
    try {
      // Verify backup exists
      await fs.access(backupPath);
      
      // Create lock
      await this.acquireLock();
      
      try {
        // Copy backup to data file
        await fs.copyFile(backupPath, this.dataPath);
        return success(undefined);
      } finally {
        await this.releaseLock();
      }
    } catch (error) {
      return failure(new Error(`Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }

  /**
   * Start watching for external changes
   */
  startWatching(onChange: () => void): void {
    if (this.isWatching) return;

    this.watcher = watch(this.dataPath, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 100
      }
    });

    this.watcher.on('change', () => {
      onChange();
    });

    this.watcher.on('error', (error: Error) => {
      console.error('File watcher error:', error);
    });

    this.isWatching = true;
  }

  /**
   * Stop watching for external changes
   */
  stopWatching(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = undefined;
    }
    this.isWatching = false;
  }

  /**
   * Get default data store
   */
  private getDefaultDataStore(): DataStore {
    const now = getCurrentTimestamp();
    
    return {
      version: 1,
      tasks: [],
      projects: [
        {
          id: 'inbox' as ID,
          name: 'Inbox',
          order: 0,
          createdAt: now,
          updatedAt: now
        }
      ],
      tags: [],
      lastModified: now
    };
  }

  /**
   * Migrate data to current version
   */
  private async migrateData(data: DataStore): Promise<DataStore> {
    // For now, just validate the structure
    if (!data.version || data.version < 1) {
      // Migrate from version 0 to 1
      return {
        version: 1,
        tasks: data.tasks || [],
        projects: data.projects || [],
        tags: data.tags || [],
        lastModified: data.lastModified || getCurrentTimestamp()
      };
    }

    return data;
  }

  /**
   * Acquire file lock
   */
  private async acquireLock(): Promise<void> {
    const maxRetries = 10;
    const retryDelay = 100;

    for (let i = 0; i < maxRetries; i++) {
      try {
        // Try to create lock file exclusively
        await fs.writeFile(this.lockPath, process.pid.toString(), { flag: 'wx' });
        return;
      } catch (error) {
        if (i === maxRetries - 1) {
          throw new Error('Failed to acquire lock after maximum retries');
        }
        
        // Check if lock is stale (older than 30 seconds)
        try {
          const lockContent = await fs.readFile(this.lockPath, 'utf-8');
          const lockPid = parseInt(lockContent.trim());
          
          // Check if process is still running
          try {
            process.kill(lockPid, 0);
            // Process is running, wait and retry
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          } catch {
            // Process is not running, remove stale lock
            await fs.unlink(this.lockPath);
            continue;
          }
        } catch {
          // Lock file doesn't exist or is invalid, retry
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
  }

  /**
   * Release file lock
   */
  private async releaseLock(): Promise<void> {
    try {
      await fs.unlink(this.lockPath);
    } catch {
      // Ignore errors when releasing lock
    }
  }
}
