import { app } from 'electron';
import * as Globals from './globals.js';
import * as Window from './helpers/window.js';
import * as Menu from './helpers/menu.js';
import * as Config from './handlers/config.js';
import * as Handlers from './handlers/handlers.js';
import * as Guard from './middlewares/guard.js';

function initializeApp() {
    // Define global variables
    Globals.define();

    // Create the main application window
    global.mainWindow = Window.create();

    // Set up IPC handlers
    Handlers.init();

    // Create help menu
    Menu.create();

    // Load configuration from config.json
    if (!Config.init()) {
        global.mainWindow.loadFile(global.paths.pages.config);
        return;
    }

    // Show dashboard page if user logged in or login page if not
    if (!Guard.loggedIn()) {
        global.mainWindow.loadFile(global.paths.pages.login);
    }
}

app.whenReady().then(initializeApp);
