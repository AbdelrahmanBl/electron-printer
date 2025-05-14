import fs from 'fs';

function loggedIn() {
    // Redirect to the dashboard if the token is found in the store file...
    if (fs.existsSync(global.paths.stores.user)) {
        const rawData = fs.readFileSync(global.paths.stores.user, 'utf8');
        const data = JSON.parse(rawData);
        if (data.token) {
            global.mainWindow.loadFile(global.paths.pages.connect);
            return true;
        }
    }

    return false;
}

export { loggedIn };