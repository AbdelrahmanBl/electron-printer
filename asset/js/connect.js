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
        addLogMessage(`connected to channel: ${channelName}`);
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
        addLogMessage(`disconnected from channel: ${channelName}`);
    });
});

window.electronAPI.onChannelLog((event, message) => {
    addLogMessage(message);
});

function validateBranchSelection() {
    if (! branches.value) {
        alert('Please Select Branch');
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