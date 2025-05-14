const connectButton = document.getElementById('connect-btn');
const disconnectButton = document.getElementById('disconnect-btn');
const channelLog = document.getElementById('channel-log');

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
        channelLog.prepend(getChannelLogNode(`connected to channel: ${channelName}`));
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
        channelLog.prepend(getChannelLogNode(`disconnected from channel: ${channelName}`));
    });
});

window.electronAPI.onChannelLog((event, message) => {
    channelLog.prepend(getChannelLogNode(message));
});

function validateBranchSelection() {
    if (! branches.value) {
        alert('Please Select Branch');
        return false;
    }

    return true;
}

function getChannelLogNode(message) {
    const node = document.createElement('p');
    node.classList.add('channel-log-item');
    node.textContent = message;
    return node;
}