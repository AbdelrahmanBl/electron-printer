import { ipcMain } from 'electron';
import { post } from '../helpers/request.js';
import { printTransaction } from '../helpers/printer.js';
import { app } from 'electron';
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

function definePusherInstance() {
    if (global.pusher) {
        return;
    }

    const user = getUserStore();
    const pusherSettings = user.pusher_settings;

    global.pusher = new Pusher(pusherSettings.key, {
        cluster: pusherSettings.cluster
    });
}   

export function defineHandlers() {
    // Handle request for printers
    ipcMain.handle('get-printers', () => {
        return global.mainWindow.webContents.getPrintersAsync(); // returns a promise
    });

    ipcMain.handle('get-user-store', () => getUserStore());

    ipcMain.handle('set-config', (event, json) => {
        // write to config file in userData path `config.json`
        fs.writeFileSync(global.paths.config, JSON.stringify(json, null, 2), 'utf8');

        app.relaunch();
        app.exit();
    });

    ipcMain.handle('login', (event, credentials) => {
        return post('login', credentials)
        .then(result => {
            fs.writeFileSync(global.paths.stores.user, JSON.stringify(result.data, null, 2), 'utf8');
            global.mainWindow.loadFile(global.paths.pages.connect);
        });
    });

    ipcMain.handle('logout', () => {
        return post('logout')
            .then(result => {
                if (fs.existsSync(global.paths.stores.user)) {
                    fs.unlinkSync(global.paths.stores.user);
                }

                // remove global pusher channel
                global.pusher = null;

                global.mainWindow.loadFile(global.paths.pages.login);
            })
    });

    ipcMain.handle('sync', (event, json) => {
        return post('receipt-printers/sync', json);
    });

    ipcMain.handle('start-pusher-channel-for', (event, branchId) => {
        return new Promise((resolve, reject) => {
            definePusherInstance();

            const channelName = `print-channel-${branchId}`;

            const channel = global.pusher.subscribe(channelName);
            
            channel.bind('print-html', (data) => {
                // add to log channel
                const logMessage = `received print-html for transaction ID: ${data.transaction_id}`;
                global.mainWindow.send('channel-log', logMessage);

                printTransaction(data.transaction_id);
            });

            resolve(channelName);
        });
    });

    ipcMain.handle('stop-pusher-channel-for', (event, branchId) => {
        return new Promise((resolve, reject) => {
            definePusherInstance();

            const channelName = `print-channel-${branchId}`;

            global.pusher.unsubscribe(channelName);

            resolve(channelName);
        });
    });
}