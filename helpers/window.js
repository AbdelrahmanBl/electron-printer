import { BrowserWindow } from 'electron';

export function createWindow() {
    return new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: global.paths.preload
        }
    });
}