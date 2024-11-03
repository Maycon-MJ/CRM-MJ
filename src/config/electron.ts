// Type-safe way to check if we're in Electron
const isElectron = () => {
  return window && 
    window.process && 
    window.process.versions && 
    window.process.versions.electron;
};

// Mock IPC for browser environment
const mockIpc = {
  invoke: async () => {
    console.warn('IPC called in browser environment');
    return null;
  }
};

// Export helper functions for Electron-specific features
export const electronFeatures = {
  isElectron: isElectron(),
  
  // File system operations
  async saveFile(data: any, filename: string) {
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron');
      return await ipcRenderer.invoke('save-file', { data, filename });
    }
    console.warn('File operations not available in browser');
    return null;
  },

  // Network path operations
  async syncToNetwork(path: string, data: any) {
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron');
      return await ipcRenderer.invoke('sync-data', { path, data });
    }
    console.warn('Network sync not available in browser');
    return null;
  },

  // Build operations
  async buildExecutable() {
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron');
      return await ipcRenderer.invoke('build-executable');
    }
    console.warn('Build operations not available in browser');
    return null;
  }
};