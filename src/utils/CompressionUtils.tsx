/**
 * Compression utilities for reducing storage size
 * Uses LZ-string style compression optimized for JSON data
 */

/**
 * Simple LZ-string compression implementation
 * Optimized for JSON data structures
 */
export class CompressionUtils {
  private static readonly BASE_CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  /**
   * Compress a string using LZ-style compression
   */
  static compress(data: string): string {
    if (!data) return "";

    const dictionary: { [key: string]: number } = {};
    const output: string[] = [];
    let dictSize = 256;
    let w = "";

    // Initialize dictionary with single characters
    for (let i = 0; i < 256; i++) {
      dictionary[String.fromCharCode(i)] = i;
    }

    for (let i = 0; i < data.length; i++) {
      const c = data[i];
      const wc = w + c;

      if (dictionary[wc] !== undefined) {
        w = wc;
      } else {
        output.push(this.encodeNumber(dictionary[w]));
        dictionary[wc] = dictSize++;
        w = c;
      }
    }

    if (w !== "") {
      output.push(this.encodeNumber(dictionary[w]));
    }

    return output.join("");
  }

  /**
   * Decompress a compressed string
   */
  static decompress(compressed: string): string {
    if (!compressed) return "";

    const dictionary: { [key: number]: string } = {};
    const codes: number[] = [];
    let dictSize = 256;

    // Initialize dictionary with single characters
    for (let i = 0; i < 256; i++) {
      dictionary[i] = String.fromCharCode(i);
    }

    // Decode the compressed string into numbers
    let pos = 0;
    while (pos < compressed.length) {
      const { value, newPos } = this.decodeNumber(compressed, pos);
      codes.push(value);
      pos = newPos;
    }

    if (codes.length === 0) return "";

    let w = dictionary[codes[0]];
    const result = [w];

    for (let i = 1; i < codes.length; i++) {
      const k = codes[i];
      let entry: string;

      if (dictionary[k] !== undefined) {
        entry = dictionary[k];
      } else if (k === dictSize) {
        entry = w + w[0];
      } else {
        throw new Error("Invalid compressed data");
      }

      result.push(entry);
      dictionary[dictSize++] = w + entry[0];
      w = entry;
    }

    return result.join("");
  }

  /**
   * Compress JSON data (stringify + compress)
   */
  static compressJSON(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      return this.compress(jsonString);
    } catch (error) {
      console.error("Error compressing JSON:", error);
      return "";
    }
  }

  /**
   * Decompress JSON data (decompress + parse)
   */
  static decompressJSON<T = any>(compressed: string): T | null {
    try {
      const jsonString = this.decompress(compressed);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error decompressing JSON:", error);
      return null;
    }
  }

  /**
   * Get compression ratio (compressed size / original size)
   */
  static getCompressionRatio(original: string, compressed: string): number {
    if (!original) return 1;
    return compressed.length / original.length;
  }

  /**
   * Check if compression would be beneficial (threshold: 0.8)
   */
  static shouldCompress(data: string): boolean {
    const compressed = this.compress(data);
    return this.getCompressionRatio(data, compressed) < 0.8;
  }

  private static encodeNumber(num: number): string {
    if (num < 64) {
      return this.BASE_CHARS[num];
    }

    let result = "";
    while (num > 0) {
      result = this.BASE_CHARS[num % 64] + result;
      num = Math.floor(num / 64);
    }
    return result + "|"; // delimiter for multi-char numbers
  }

  private static decodeNumber(
    str: string,
    pos: number
  ): { value: number; newPos: number } {
    const delimiterPos = str.indexOf("|", pos);

    if (delimiterPos === -1 || delimiterPos === pos) {
      // Single character encoding
      const char = str[pos];
      const value = this.BASE_CHARS.indexOf(char);
      return { value, newPos: pos + 1 };
    }

    // Multi-character encoding
    const encoded = str.substring(pos, delimiterPos);
    let value = 0;

    for (let i = 0; i < encoded.length; i++) {
      const charValue = this.BASE_CHARS.indexOf(encoded[i]);
      value = value * 64 + charValue;
    }

    return { value, newPos: delimiterPos + 1 };
  }
}
