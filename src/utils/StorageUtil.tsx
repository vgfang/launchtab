import LZString from "lz-string";
import * as T from "../types";

export interface StorageData {
  settings: T.Settings;
  nodes: T.Node[];
}

export class StorageUtil {
  // Storage keys for separate data
  private static readonly SETTINGS_KEY = "launchtab_settings";
  private static readonly NODES_KEY = "launchtab_nodes";
  private static readonly VERSION_KEY = "launchtab_version";

  // Current version for data migration
  private static readonly CURRENT_VERSION = "1.0.2";

  /**
   * Compress data using LZString with UTF16 encoding for Chrome storage compatibility
   */
  private static compress(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      // Use UTF16 compression which is safer for web storage systems
      const compressed = LZString.compressToUTF16(jsonString);
      return compressed || jsonString;
    } catch (error) {
      console.error("StorageUtil: Compression failed:", error);
      return JSON.stringify(data);
    }
  }

  /**
   * Decompress data using LZString with UTF16 encoding for Chrome storage compatibility
   */
  private static decompress(compressedData: string): any {
    try {
      // Try UTF16 decompression first
      const decompressed = LZString.decompressFromUTF16(compressedData);
      if (decompressed !== null) {
        return JSON.parse(decompressed);
      }

      // If UTF16 decompression fails, try parsing as regular JSON (original uncompressed format)
      return JSON.parse(compressedData);
    } catch (error) {
      console.error("StorageUtil: Decompression failed:", error);
      try {
        // Final fallback to regular JSON parsing
        return JSON.parse(compressedData);
      } catch (parseError) {
        console.error("StorageUtil: JSON parsing also failed:", parseError);
        return null;
      }
    }
  }

  /**
   * Save settings to Chrome storage
   */
  static async saveSettings(settings: T.Settings): Promise<boolean> {
    if (!chrome?.storage?.sync) {
      console.warn("StorageUtil: Chrome storage not available");
      return false;
    }

    try {
      const compressedSettings = this.compress(settings);

      await new Promise<void>((resolve, reject) => {
        chrome.storage.sync.set(
          { [this.SETTINGS_KEY]: compressedSettings },
          () => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve();
            }
          }
        );
      });

      console.log("StorageUtil: Settings saved successfully");
      return true;
    } catch (error) {
      console.error("StorageUtil: Failed to save settings:", error);
      return false;
    }
  }

  /**
   * Save nodes to Chrome storage
   */
  static async saveNodes(nodes: T.Node[]): Promise<boolean> {
    if (!chrome?.storage?.sync) {
      console.warn("StorageUtil: Chrome storage not available");
      return false;
    }

    try {
      const compressedNodes = this.compress(nodes);

      await new Promise<void>((resolve, reject) => {
        chrome.storage.sync.set({ [this.NODES_KEY]: compressedNodes }, () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve();
          }
        });
      });

      console.log("StorageUtil: Nodes saved successfully");
      return true;
    } catch (error) {
      console.error("StorageUtil: Failed to save nodes:", error);
      return false;
    }
  }

  /**
   * Save both settings and nodes
   */
  static async saveData(
    settings: T.Settings,
    nodes: T.Node[]
  ): Promise<boolean> {
    const [settingsSuccess, nodesSuccess] = await Promise.all([
      this.saveSettings(settings),
      this.saveNodes(nodes),
    ]);

    // Also save version info
    if (settingsSuccess && nodesSuccess) {
      await this.saveVersion();
    }

    return settingsSuccess && nodesSuccess;
  }

  /**
   * Load settings from Chrome storage
   */
  static async loadSettings(): Promise<T.Settings | null> {
    if (!chrome?.storage?.sync) {
      console.warn("StorageUtil: Chrome storage not available");
      return null;
    }

    try {
      const result = await new Promise<any>((resolve, reject) => {
        chrome.storage.sync.get([this.SETTINGS_KEY], (result) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(result);
          }
        });
      });

      if (result[this.SETTINGS_KEY]) {
        const settings = this.decompress(result[this.SETTINGS_KEY]);
        console.log("StorageUtil: Settings loaded successfully");
        return settings;
      }

      return null;
    } catch (error) {
      console.error("StorageUtil: Failed to load settings:", error);
      return null;
    }
  }

  /**
   * Load nodes from Chrome storage
   */
  static async loadNodes(): Promise<T.Node[] | null> {
    if (!chrome?.storage?.sync) {
      console.warn("StorageUtil: Chrome storage not available");
      return null;
    }

    try {
      const result = await new Promise<any>((resolve, reject) => {
        chrome.storage.sync.get([this.NODES_KEY], (result) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(result);
          }
        });
      });

      if (result[this.NODES_KEY]) {
        const nodes = this.decompress(result[this.NODES_KEY]);
        console.log("StorageUtil: Nodes loaded successfully");
        return nodes;
      }

      return null;
    } catch (error) {
      console.error("StorageUtil: Failed to load nodes:", error);
      return null;
    }
  }

  /**
   * Load both settings and nodes
   */
  static async loadData(): Promise<StorageData | null> {
    try {
      const [settings, nodes] = await Promise.all([
        this.loadSettings(),
        this.loadNodes(),
      ]);

      if (settings && nodes) {
        return { settings, nodes };
      }

      // If either is missing, check for legacy data
      const legacyData = await this.loadLegacyData();
      if (legacyData) {
        // Migrate legacy data to new format
        await this.saveData(legacyData.settings, legacyData.nodes);
        await this.cleanupLegacyData();
        return legacyData;
      }

      return null;
    } catch (error) {
      console.error("StorageUtil: Failed to load data:", error);
      return null;
    }
  }

  /**
   * Load legacy data (old combined format)
   */
  private static async loadLegacyData(): Promise<StorageData | null> {
    if (!chrome?.storage?.sync) {
      return null;
    }

    try {
      const result = await new Promise<any>((resolve, reject) => {
        chrome.storage.sync.get(["data"], (result) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(result);
          }
        });
      });

      if (result.data && result.data.settings && result.data.nodes) {
        console.log("StorageUtil: Legacy data found, will be migrated");
        return {
          settings: result.data.settings,
          nodes: result.data.nodes,
        };
      }

      return null;
    } catch (error) {
      console.error("StorageUtil: Failed to load legacy data:", error);
      return null;
    }
  }

  /**
   * Clean up legacy data after migration
   */
  private static async cleanupLegacyData(): Promise<void> {
    if (!chrome?.storage?.sync) {
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        chrome.storage.sync.remove(["data"], () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            console.log("StorageUtil: Legacy data cleaned up");
            resolve();
          }
        });
      });
    } catch (error) {
      console.error("StorageUtil: Failed to cleanup legacy data:", error);
    }
  }

  /**
   * Save version info
   */
  private static async saveVersion(): Promise<void> {
    if (!chrome?.storage?.sync) {
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        chrome.storage.sync.set(
          { [this.VERSION_KEY]: this.CURRENT_VERSION },
          () => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve();
            }
          }
        );
      });
    } catch (error) {
      console.error("StorageUtil: Failed to save version:", error);
    }
  }

  /**
   * Get storage usage information
   */
  static async getStorageInfo(): Promise<{
    bytesInUse: number;
    quotaBytes: number;
    percentUsed: number;
  } | null> {
    if (!chrome?.storage?.sync) {
      return null;
    }

    try {
      const bytesInUse = await new Promise<number>((resolve, reject) => {
        chrome.storage.sync.getBytesInUse((bytes) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(bytes);
          }
        });
      });

      const quotaBytes = chrome.storage.sync.QUOTA_BYTES;
      const percentUsed = (bytesInUse / quotaBytes) * 100;

      return {
        bytesInUse,
        quotaBytes,
        percentUsed: Math.round(percentUsed * 100) / 100,
      };
    } catch (error) {
      console.error("StorageUtil: Failed to get storage info:", error);
      return null;
    }
  }

  /**
   * Clear all storage data
   */
  static async clearAllData(): Promise<boolean> {
    if (!chrome?.storage?.sync) {
      return false;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        chrome.storage.sync.clear(() => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve();
          }
        });
      });

      console.log("StorageUtil: All data cleared");
      return true;
    } catch (error) {
      console.error("StorageUtil: Failed to clear data:", error);
      return false;
    }
  }

  /**
   * Fix corrupted storage by clearing individual keys and recompressing data
   */
  static async fixCorruptedStorage(): Promise<boolean> {
    if (!chrome?.storage?.sync) {
      return false;
    }

    try {
      console.log("StorageUtil: Attempting to fix corrupted storage...");

      // Clear the potentially corrupted keys
      await new Promise<void>((resolve, reject) => {
        chrome.storage.sync.remove([this.SETTINGS_KEY, this.NODES_KEY], () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve();
          }
        });
      });

      console.log("StorageUtil: Corrupted storage keys cleared");
      return true;
    } catch (error) {
      console.error("StorageUtil: Failed to fix corrupted storage:", error);
      return false;
    }
  }
}
