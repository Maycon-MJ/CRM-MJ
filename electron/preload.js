const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getData: (key) => ipcRenderer.invoke('getData', key),
  setData: (key, value) => ipcRenderer.invoke('setData', key, value),
  syncData: (data) => ipcRenderer.invoke('sync-data', data),
  buildExecutable: () => ipcRenderer.invoke('build-executable')
});