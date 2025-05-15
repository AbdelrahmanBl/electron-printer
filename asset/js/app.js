const logout = document.getElementById('logout');
const branches = document.getElementById('branches');

logout.addEventListener('click', () => window.electronAPI.logout());

window.electronAPI.getUserStore().then(data => {
    document.getElementById('fullname').textContent = data.user.fullname;
});

if(branches) {
    branches.addEventListener('change', () => {
        localStorage.setItem('current_branch_id', branches.value);
    })
}

function loadBranchOptions(businessLocations) {
    businessLocations.forEach(businessLocation => {
        const option = document.createElement('option');
        option.value = businessLocation.id;
        option.textContent = businessLocation.name;
        option.selected = businessLocation.id == localStorage.getItem('current_branch_id');
        branches.append(option);
    })
}
