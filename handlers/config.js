import fs from 'fs';
import { dialog } from 'electron';

function terminateAppWhenConfigNotFound() {
    // Show error when the config file is not found...
    if (! fs.existsSync(global.paths.config)) {
        dialog.showErrorBox('Config Error', 'Config file not found');
        return;
    }
}

function loadConfig() {
    // Define the API endpoint from the config file...
    const configData = fs.readFileSync(global.paths.config, 'utf8');
    const configJson = JSON.parse(configData);
    global.config = configJson; 
}

export { terminateAppWhenConfigNotFound, loadConfig };