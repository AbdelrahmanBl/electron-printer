const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true, // Required to use Node.js in renderer
        contextIsolation: false,
    },
  })

  win.loadFile('index.html')

  windows.printers = [];

  win.webContents.on('did-finish-load', () => {
    win.webContents.getPrintersAsync().then(printers => {
        windows.printers = printers;
    });
    // console.log(win.webContents);
    
    // const printers = win.webContents.getPrinters();
    // console.log('Available Printers:', printers);
    
    // Optionally send to renderer
    // win.webContents.send('printers-list', printersList);
  });
}

app.whenReady().then(() => {
    createWindow()
})