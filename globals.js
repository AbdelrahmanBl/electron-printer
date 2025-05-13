import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const preloadPath = () => path.join(__dirname, 'preload.js');

const configPath = () => path.join(__dirname, 'config.json');

const pagesPaths = () => ({
    login: path.join(__dirname, 'pages/login.html'),
    dashboard: path.join(__dirname, 'pages/dashboard.html'),
});

const storesPaths = () => ({
    user: path.join(__dirname, 'stores/user.json'),
});

export function initGlobals() {
    global.paths = {
        preload: preloadPath(),
        config: configPath(),
        pages: pagesPaths(),
        stores: storesPaths(),
    }
}