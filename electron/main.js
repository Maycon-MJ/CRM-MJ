const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');
const fs = require('fs').promises;
const { exec } = require('child_process');

const isDev = process.env.NODE_ENV === 'development';
const store = new Store();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, 'icon.ico'),
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Data management
ipcMain.handle('getData', (event, key) => {
  return store.get(key);
});

ipcMain.handle('setData', (event, key, value) => {
  store.set(key, value);
  return true;
});

// Network sync
ipcMain.handle('sync-data', async (event, { path: networkPath, data }) => {
  try {
    await fs.mkdir(networkPath, { recursive: true });
    
    for (const [key, value] of Object.entries(data)) {
      if (value) {
        await fs.writeFile(
          path.join(networkPath, `${key}.json`),
          value,
          'utf-8'
        );
      }
    }
    
    return true;
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
});

// Build executable
ipcMain.handle('build-executable', () => {
  return new Promise((resolve, reject) => {
    exec('npm run electron:build', (error, stdout, stderr) => {
      if (error) {
        console.error('Build error:', error);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
});