import { app } from 'electron';
import * as globals from './globals.js';
import * as window from './helpers/window.js';
import * as config from './handlers/config.js';
import * as handlers from './handlers/handlers.js';
import * as guard from './middlewares/guard.js';

function initializeApp() {
    // Set global variables
    globals.initGlobals();

    // Create the main application window
    global.mainWindow = window.createWindow();

    // Load configuration from config.json
    if (!config.initConfig()) return;

    // Set up IPC handlers
    handlers.defineHandlers();

    // Show dashboard page if user logged in or login page if not
    if (!guard.loggedIn()) {
        global.mainWindow.loadFile(global.paths.pages.login);
    }
}

app.whenReady().then(initializeApp);
