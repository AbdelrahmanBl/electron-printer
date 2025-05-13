import { ipcMain } from 'electron';
import { post } from '../helpers/request.js';
import fs from 'fs';

export function defineHandlers(mainWindow) {
// Handle request for printers
    ipcMain.handle('get-printers', () => {
        return mainWindow.webContents.getPrintersAsync(); // returns a promise
    });

    ipcMain.handle('get-store', () => {
        if (fs.existsSync(global.paths.stores.user)) {
            const rawData = fs.readFileSync(global.paths.stores.user, 'utf8');
            return JSON.parse(rawData);
        } else {
            console.log('File does not exist!');
            return null;
        }
    });

    ipcMain.handle('login', (event, credentials) => {
        return post('login', credentials)
        .then(result => {
            fs.writeFileSync(global.paths.stores.user, JSON.stringify(result.data, null, 2), 'utf8');
            mainWindow.loadFile('pages/dashboard.html');
        });
    });
}