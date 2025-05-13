import { ipcMain } from 'electron';
import { post } from '../helpers/request.js';
import { printTransaction } from '../helpers/printer.js';
import Pusher from 'pusher-js';
import fs from 'fs';

function getUserStore() {
    if (fs.existsSync(global.paths.stores.user)) {
        const rawData = fs.readFileSync(global.paths.stores.user, 'utf8');
        return JSON.parse(rawData);
    } else {
        // redirect to login when user.json not exists
        global.mainWindow.loadFile(global.paths.pages.login);
        console.log('File does not exist!');
        return null;
    }
}

export function defineHandlers() {
// Handle request for printers
    ipcMain.handle('get-printers', () => {
        return global.mainWindow.webContents.getPrintersAsync(); // returns a promise
    });

    ipcMain.handle('get-user-store', () => getUserStore());

    ipcMain.handle('login', (event, credentials) => {
        return post('login', credentials)
        .then(result => {
            fs.writeFileSync(global.paths.stores.user, JSON.stringify(result.data, null, 2), 'utf8');
            global.mainWindow.loadFile(global.paths.pages.dashboard);
        });
    });

    ipcMain.handle('sync-printers', (event, json) => {
        return post('receipt-printers/sync', json);
    });

    ipcMain.handle('start-pusher-channel-for', (event, branchId) => {
        const user = getUserStore();
        const pusherSettings = user.pusher_settings;

        const pusher = new Pusher(pusherSettings.key, {
            cluster: pusherSettings.cluster
        });

        const channel = pusher.subscribe(`print-channel-${branchId}`);
        
        channel.bind('print-html', (data) => {
            printTransaction(data.transaction_id);
        });
    });
}