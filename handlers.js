import { ipcMain, dialog } from 'electron';
import fs from 'fs';

export function defineHandlers(mainWindow, filePath) {
// Handle request for printers
    ipcMain.handle('get-printers', () => {
        return mainWindow.webContents.getPrintersAsync(); // returns a promise
    });

    ipcMain.handle('get-store', () => {
        if (fs.existsSync(filePath)) {
            const rawData = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(rawData);
        } else {
            console.log('File does not exist!');
            return null;
        }
    });

    ipcMain.handle('login', (event, credentials) => {
        return fetch(global.apiEndpoint + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(response => {
            if (! response.ok) {
                return response.json().then(result => {
                    dialog.showErrorBox('Login Error', result.message);
                    throw new Error(result.message);
                })
            }

            response.json().then(result => {
                fs.writeFileSync(filePath, JSON.stringify(result.data, null, 2), 'utf8');
                mainWindow.loadFile('dashboard.html');
            })
        });
    });
}