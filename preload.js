const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('i18n', {
    t: (key) => ipcRenderer.invoke('translate', key),
});

contextBridge.exposeInMainWorld('electronAPI', {
    getUserStore: () => ipcRenderer.invoke('get-user-store'),
    getPrinters: () => ipcRenderer.invoke('get-printers'),
    getConfig: () => ipcRenderer.invoke('get-config'), 
    setConfig: (json) => ipcRenderer.invoke('set-config', json), 
    login: (credentials) => ipcRenderer.invoke('login', credentials),
    logout: () => ipcRenderer.invoke('logout'),
    syncPrinters: (json) => ipcRenderer.invoke('sync', json),
    startPusherChannelFor: (branchId) => ipcRenderer.invoke('start-pusher-channel-for', branchId),
    stopPusherChannelFor: (branchId) => ipcRenderer.invoke('stop-pusher-channel-for', branchId),
    onChannelLog: (callback) => ipcRenderer.on('channel-log', callback),
});
