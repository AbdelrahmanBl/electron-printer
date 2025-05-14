const { contextBridge, ipcRenderer } = require('electron');

// Define the file path (it will be stored in the user's app data directory)
// const filePath = path.join(__dirname, 'data.json');

contextBridge.exposeInMainWorld('electronAPI', {
    getUserStore: () => ipcRenderer.invoke('get-user-store'),
    getPrinters: () => ipcRenderer.invoke('get-printers'),
    login: (credentials) => ipcRenderer.invoke('login', credentials),
    logout: () => ipcRenderer.invoke('logout'),
    syncPrinters: (json) => ipcRenderer.invoke('sync', json),
    startPusherChannelFor: (branchId) => ipcRenderer.invoke('start-pusher-channel-for', branchId),
    stopPusherChannelFor: (branchId) => ipcRenderer.invoke('stop-pusher-channel-for', branchId),
    onChannelLog: (callback) => ipcRenderer.on('channel-log', callback),
});
