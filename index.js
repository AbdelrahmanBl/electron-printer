const { app } = require('electron');
const globals = require('./globals.js');
const window = require('./helpers/window.js');
const config = require('./handlers/config.js');
const handlers = require('./handlers/handlers.js');
const guard = require('./middlewares/guard.js');

function initializeApp() {
    // Set global variables
    globals.initGlobals();

    // Create the main application window
    global.mainWindow = window.createWindow();

    // Load configuration from config.json
    if(! config.initConfig()) return;

    // Set up IPC handlers
    handlers.defineHandlers();

    // Show dashboard page if user logged in or login page if not
    if(! guard.loggedIn()) {
        global.mainWindow.loadFile(global.paths.pages.login);
    }
}

app.whenReady().then(initializeApp);