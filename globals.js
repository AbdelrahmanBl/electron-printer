import { app } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const userDataPath = app.getPath('userData');

const i18nPath = () => path.join(__dirname, 'locales/{{lng}}.json');

const preloadPath = () => path.join(__dirname, 'preload.js');

const configPath = () => path.join(userDataPath, 'config.json');

const pagesPaths = () => ({
    login: path.join(__dirname, 'pages/login.html'),
    config: path.join(__dirname, 'pages/config.html'),
    connect: path.join(__dirname, 'pages/connect.html'),
    sync: path.join(__dirname, 'pages/sync.html'),
});

const storesPaths = () => ({
    user: path.join(userDataPath, 'user.json'),
}); 

export function define() {
    global.paths = {
        i18n: i18nPath(),
        preload: preloadPath(),
        config: configPath(),
        pages: pagesPaths(),
        stores: storesPaths(),
    }
}