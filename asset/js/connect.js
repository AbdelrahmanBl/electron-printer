const connectButton = document.getElementById('connect-btn');
const disconnectButton = document.getElementById('disconnect-btn');
const logMessages = document.getElementById('log-messages');

window.electronAPI.getUserStore().then(data => {
    loadBranchOptions(data.business_locations);
});

connectButton.addEventListener('click', () => {
    if(! validateBranchSelection()) return;

    window.electronAPI.startPusherChannelFor(branches.value)
    .then((channelName) => {
        // toggle connect button
        connectButton.classList.toggle('hidden');
        disconnectButton.classList.toggle('hidden');

        // disable selecting branches 
        branches.disabled = true;

        // add channel log message
        window.i18n.t('connected to channel')
        .then(result => addLogMessage(result + ': ' + channelName));
    });
});

disconnectButton.addEventListener('click', () => {
    if(! validateBranchSelection()) return;
    
    window.electronAPI.stopPusherChannelFor(branches.value)
    .then((channelName) => {
        // toggle disconnectButton button
        connectButton.classList.toggle('hidden');
        disconnectButton.classList.toggle('hidden');
        
        // enable selecting branches 
        branches.disabled = false;

        // add channel log message
        window.i18n.t('disconnected from channel')
        .then(result => addLogMessage(result  + ': ' + channelName));
    });
});

window.electronAPI.onChannelLog((event, message) => {
    addLogMessage(message);
});

function validateBranchSelection() {
    if (! branches.value) {
        window.i18n.t('Please select branch')
        .then(result => alert(result));

        return false;
    }

    return true;
}

function addLogMessage(message) {
    const timestamp = new Date().toLocaleTimeString();
    const node = document.createElement('p');
    node.classList.add('channel-log-item');
    node.textContent = `[${timestamp}] ${message}`;
    logMessages.prepend(node);
}