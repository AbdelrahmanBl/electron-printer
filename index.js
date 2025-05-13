const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Pusher = require('pusher-js');
const globals = require('./globals.js');
const handlers = require('./handlers/handlers.js');
const config = require('./handlers/config.js');
const guard = require('./middlewares/guard.js');
const { sendToPrinter } = require('./helpers/printer.js');

// Define the global file paths...
globals.defineGlobals();

// const pusher = new Pusher('ff383959a24accbacd3c', {
//     cluster: 'eu'
// });
// const channel = pusher.subscribe('print-channel');
// channel.bind('print-html', (data) => {
//     const htmlContent = data.html; // HTML content to print
//     const printerName = data.printer;    // Exact printer name
//     sendToPrinter(htmlContent, printerName);
// });

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    config.terminateAppWhenConfigNotFound();

    config.loadConfig();

    handlers.defineHandlers(mainWindow);

    // redirect user to dashboard if logged in...
    if(! guard.loggedIn(mainWindow)) {
        // display login page if not logged in...
        mainWindow.loadFile(global.paths.pages.login);
    }
}

app.whenReady().then(createWindow);
