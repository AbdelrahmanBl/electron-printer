import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storesPaths = () => ({
    user: path.join(__dirname, 'stores/user.json'),
});

const pagesPaths = () => ({
    login: path.join(__dirname, 'pages/login.html'),
    dashboard: path.join(__dirname, 'pages/dashboard.html'),
}); 

const configPath = () => path.join(__dirname, 'config.json');

export function defineGlobals() {
    global.paths = {
        stores: storesPaths(),
        pages: pagesPaths(),
        config: configPath(),
    }
}