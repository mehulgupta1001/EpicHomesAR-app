declare module 'expo-file-system' {
  export interface FileInfo {
    exists: boolean;
    size?: number;
    uri?: string;
    modificationTime?: number;
    isDirectory?: boolean;
  }

  export const documentDirectory: string | null;
  export const cacheDirectory: string | null;
  
  export function makeDirectoryAsync(path: string, options?: { intermediates?: boolean }): Promise<void>;
  export function deleteAsync(path: string, options?: { idempotent?: boolean }): Promise<void>;
  export function readAsStringAsync(path: string): Promise<string>;
  export function writeAsStringAsync(path: string, contents: string): Promise<void>;
  export function getInfoAsync(path: string): Promise<FileInfo>;
  export function downloadAsync(uri: string, fileUri: string, options?: any): Promise<any>;
}
