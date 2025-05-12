const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Pusher = require('pusher-js');
const { defineHandlers } = require('./handlers.js');
const { sendToPrinter } = require('./helpers.js');

// Define the file paths...
const storePath = path.join(__dirname, 'store.json');
const configPath = path.join(__dirname, 'config.json');

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

    // Show error when the config file is not found...
    if (! fs.existsSync(configPath)) {
        dialog.showErrorBox('Config Error', 'Config file not found');
        return;
    }

    // Define the API endpoint from the config file...
    const configData = fs.readFileSync(configPath, 'utf8');
    const configJson = JSON.parse(configData);
    global.apiEndpoint = configJson.apiEndpoint; 

    // Redirect to the dashboard if the token is found in the store file...
    if (fs.existsSync(storePath)) {
        const rawData = fs.readFileSync(storePath, 'utf8');
        const data = JSON.parse(rawData);
        if (data.token) {
            mainWindow.loadFile('dashboard.html');
            defineHandlers(mainWindow, storePath);
            return;
        }
    }

    // Load the login page if the token is not found...
    mainWindow.loadFile('login.html');
    defineHandlers(mainWindow, storePath);
}

app.whenReady().then(createWindow);
