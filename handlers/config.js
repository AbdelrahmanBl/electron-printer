import fs from 'fs';

function configFileExists() {
    // show error when the config file is not found...
    if (! fs.existsSync(global.paths.config)) {
        // dialog.showErrorBox('Config Error', 'Config file not found');
        return false;
    }

    return true;
}

export function init() {
    if (configFileExists()) {
        // define config globally...
        const configData = fs.readFileSync(global.paths.config, 'utf8');
        const configJson = JSON.parse(configData);
        global.config = configJson; 

        return true;
    }
    
    return false;
}