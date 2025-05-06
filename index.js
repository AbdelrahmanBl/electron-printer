const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');

  // Handle request for printers
  ipcMain.handle('get-printers', () => {
    return win.webContents.getPrintersAsync(); // returns a promise
  });
}

app.whenReady().then(createWindow);
