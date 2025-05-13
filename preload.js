const { contextBridge, ipcRenderer } = require('electron');

// Define the file path (it will be stored in the user's app data directory)
// const filePath = path.join(__dirname, 'data.json');

contextBridge.exposeInMainWorld('electronAPI', {
    getUserStore: () => ipcRenderer.invoke('get-user-store'),
    getPrinters: () => ipcRenderer.invoke('get-printers'),
    login: (credentials) => ipcRenderer.invoke('login', credentials),
    syncPrinters: (json) => ipcRenderer.invoke('sync-printers', json),
});
