const logout = document.getElementById('logout');
const branches = document.getElementById('branches');

logout.addEventListener('click', () => window.electronAPI.logout());

window.electronAPI.getUserStore().then(data => {
    document.getElementById('fullname').textContent = data.user.fullname;
});

function loadBranchOptions(businessLocations) {
    // businessLocations.unshift({ id: '', name: 'Select Branch' });
    businessLocations.forEach(businessLocation => {
        const option = document.createElement('option');
        option.value = businessLocation.id;
        option.textContent = businessLocation.name;
        branches.append(option);
    })
}
