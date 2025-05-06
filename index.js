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

  printersList = [];

  win.webContents.on('did-finish-load', () => {
    win.webContents.getPrintersAsync().then(printers => {
        console.log('printers', printers);
        
        printers.forEach(printer => {
            console.log('Printer', printer);
            
            printersList.push({
                name: printer.name,
                isDefault: printer.isDefault,
                isRemote: printer.isRemote,
                isColor: printer.isColor,
                isDuplex: printer.isDuplex,
                isWireless: printer.isWireless,
            });
        })
    });
    // console.log(win.webContents);
    
    // const printers = win.webContents.getPrinters();
    // console.log('Available Printers:', printers);
    
    // Optionally send to renderer
    win.webContents.send('printers-list', printersList);
  });
}

app.whenReady().then(() => {
    createWindow()
})