import * as T from "../types";
import { CompressionUtils } from "./CompressionUtils";

/**
 * Utility for distributing node storage across multiple Chrome storage keys
 * to work around the 8KB per-item limit while using the full 100KB quota
 */
export class StorageUtils {
  private static readonly CHUNK_SIZE_LIMIT = 7500; // Leave headroom under 8KB limit
  private static readonly NODE_KEY_PREFIX = "node";

  /**
   * Distribute nodes across multiple storage keys with optional compression
   */
  static distributeNodes(
    nodes: T.Node[],
    useCompression = true
  ): Record<string, string> {
    const chunks: Record<string, string> = {};
    let currentChunk: T.Node[] = [];
    let chunkIndex = 0;

    for (const node of nodes) {
      const testChunk = [...currentChunk, node];
      const serialized = useCompression
        ? CompressionUtils.compressJSON(testChunk)
        : JSON.stringify(testChunk);

      // Check if adding this node would exceed the chunk size limit
      if (
        serialized.length > this.CHUNK_SIZE_LIMIT &&
        currentChunk.length > 0
      ) {
        // Save current chunk and start new one
        const chunkData = useCompression
          ? CompressionUtils.compressJSON(currentChunk)
          : JSON.stringify(currentChunk);
        chunks[`${this.NODE_KEY_PREFIX}${chunkIndex}`] = chunkData;

        currentChunk = [node];
        chunkIndex++;
      } else {
        currentChunk.push(node);
      }
    }

    // Save final chunk if it has data
    if (currentChunk.length > 0) {
      const chunkData = useCompression
        ? CompressionUtils.compressJSON(currentChunk)
        : JSON.stringify(currentChunk);
      chunks[`${this.NODE_KEY_PREFIX}${chunkIndex}`] = chunkData;
    }

    return chunks;
  }

  /**
   * Load nodes from distributed storage keys (with legacy fallback)
   */
  static async loadDistributedNodes(useCompression = true): Promise<T.Node[]> {
    return new Promise((resolve) => {
      if (!chrome?.storage) {
        resolve([]);
        return;
      }

      // Get all storage keys to find our node chunks
      chrome.storage.sync.get(null, (allData) => {
        const nodeKeys = Object.keys(allData)
          .filter((key) => key.startsWith(this.NODE_KEY_PREFIX))
          .sort((a, b) => {
            // Sort numerically: node0, node1, node2, ...
            const aNum = parseInt(a.replace(this.NODE_KEY_PREFIX, ""));
            const bNum = parseInt(b.replace(this.NODE_KEY_PREFIX, ""));
            return aNum - bNum;
          });

        const allNodes: T.Node[] = [];

        // Load from new distributed format
        if (nodeKeys.length > 0) {
          console.log(
            `Loading nodes from ${nodeKeys.length} distributed chunks`
          );
          for (const key of nodeKeys) {
            try {
              const chunkData = allData[key];
              let chunkNodes: T.Node[];

              if (useCompression) {
                chunkNodes =
                  CompressionUtils.decompressJSON<T.Node[]>(chunkData) || [];
              } else {
                chunkNodes = JSON.parse(chunkData);
              }

              allNodes.push(...chunkNodes);
            } catch (error) {
              console.error(`Error loading chunk ${key}:`, error);
            }
          }
        }
        // Fallback to legacy single-key format
        else if (allData.data && allData.data.nodes) {
          console.log("Loading nodes from legacy storage format");
          try {
            allNodes.push(...allData.data.nodes);
          } catch (error) {
            console.error("Error loading legacy nodes:", error);
          }
        }
        // No nodes found
        else {
          console.log("No nodes found in storage");
        }

        resolve(allNodes);
      });
    });
  }

  /**
   * Save distributed nodes to Chrome storage
   */
  static async saveDistributedNodes(
    nodes: T.Node[],
    useCompression = true
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (!chrome?.storage) {
        resolve(false);
        return;
      }

      // Generate new distributed chunks
      const chunks = this.distributeNodes(nodes, useCompression);

      // Clean up old node keys first
      chrome.storage.sync.get(null, (allData) => {
        const oldNodeKeys = Object.keys(allData).filter((key) =>
          key.startsWith(this.NODE_KEY_PREFIX)
        );

        // Remove old keys
        if (oldNodeKeys.length > 0) {
          chrome.storage.sync.remove(oldNodeKeys, () => {
            // Save new chunks
            chrome.storage.sync.set(chunks, () => {
              if (chrome.runtime.lastError) {
                console.error(
                  "Error saving distributed nodes:",
                  chrome.runtime.lastError
                );
                resolve(false);
              } else {
                console.log(`Saved ${Object.keys(chunks).length} node chunks`);
                resolve(true);
              }
            });
          });
        } else {
          // No old keys to remove, just save new chunks
          chrome.storage.sync.set(chunks, () => {
            if (chrome.runtime.lastError) {
              console.error(
                "Error saving distributed nodes:",
                chrome.runtime.lastError
              );
              resolve(false);
            } else {
              console.log(`Saved ${Object.keys(chunks).length} node chunks`);
              resolve(true);
            }
          });
        }
      });
    });
  }

  /**
   * Get storage statistics for debugging
   */
  static async getStorageStats(): Promise<{
    totalChunks: number;
    totalNodes: number;
    totalSize: number;
    avgChunkSize: number;
  }> {
    return new Promise((resolve) => {
      if (!chrome?.storage) {
        resolve({
          totalChunks: 0,
          totalNodes: 0,
          totalSize: 0,
          avgChunkSize: 0,
        });
        return;
      }

      chrome.storage.sync.get(null, (allData) => {
        const nodeKeys = Object.keys(allData).filter((key) =>
          key.startsWith(this.NODE_KEY_PREFIX)
        );

        let totalNodes = 0;
        let totalSize = 0;

        for (const key of nodeKeys) {
          const chunkData = allData[key];
          totalSize += chunkData.length;

          try {
            // Try to count nodes in this chunk
            const chunkNodes =
              CompressionUtils.decompressJSON<T.Node[]>(chunkData) ||
              JSON.parse(chunkData);
            totalNodes += chunkNodes.length;
          } catch (error) {
            console.warn(`Could not parse chunk ${key} for stats`);
          }
        }

        resolve({
          totalChunks: nodeKeys.length,
          totalNodes,
          totalSize,
          avgChunkSize:
            nodeKeys.length > 0 ? Math.round(totalSize / nodeKeys.length) : 0,
        });
      });
    });
  }
}
