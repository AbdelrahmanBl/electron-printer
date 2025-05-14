const syncForm = document.getElementById('sync-form');
const syncButton = document.getElementById('sync-btn');

window.electronAPI.getUserStore().then(data => {
    loadBranchOptions(data.business_locations);
});

window.electronAPI.getPrinters().then(printers => {
    const printerList = document.getElementById('printer-list');

    if (!printers.length) {
        printerList.textContent = 'no printers available!';
        return;
    }

    printers.forEach((printer, index) => {
        const printerItem = document.createElement('div');
        printerItem.classList.add('printer-item');

        const inputElement = document.createElement('input');
        inputElement.name = 'printers[]';
        inputElement.type = 'checkbox';
        inputElement.id = `printer-${index}`;
        inputElement.value = printer.name;

        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', `printer-${index}`);
        labelElement.textContent = printer.name;

        printerItem.appendChild(inputElement);
        printerItem.appendChild(labelElement);

        printerList.appendChild(printerItem);
    });
});

syncForm.addEventListener('submit', (e) => {
    e.preventDefault();

    syncButton.classList.add('loading');

    const formData = new FormData(syncForm);

    let jsonData = {};

    for (const [key, value] of formData.entries()) {
        const normalizedKey = key.replace(/\[\]$/, ''); // Remove brackets 

        if (jsonData[normalizedKey] !== undefined) {
            if (!Array.isArray(jsonData[normalizedKey])) {
                jsonData[normalizedKey] = [jsonData[normalizedKey]];
            }
            jsonData[normalizedKey].push(value);
        } else {
            const normalizedValue = key.endsWith('[]') ? [value] : value;
            jsonData[normalizedKey] = normalizedValue;
        }
    }

    window.electronAPI.syncPrinters(jsonData)
    .finally(() => {
        syncButton.classList.remove('loading');
    });
});