const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Pusher = require('pusher-js');

const pusher = new Pusher('ff383959a24accbacd3c', {
    cluster: 'eu'
});
const channel = pusher.subscribe('print-channel');
channel.bind('print-html', (data) => {
    const htmlContent = data.html;       // HTML string
    const printerName = data.printer;    // Exact printer name
    sendToPrinter(htmlContent, printerName);
});

function sendToPrinter(htmlContent, printerName) {
    console.log(htmlContent, printerName);
    
    const printWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // Load HTML content
    printWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

    printWindow.webContents.on('did-finish-load', () => {
        printWindow.webContents.print({
            silent: true,
            printBackground: true,
            deviceName: printerName
        }, (success, failureReason) => {
            if (!success) {
                dialog.showErrorBox('danger', 'Print failed: ' + failureReason + ' - ' + printerName);
            }

            printWindow.close();
        });
    });
}

function createWindow() {
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
