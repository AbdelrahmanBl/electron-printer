window.electronAPI.getPrinters().then(printers => {
    const list = document.getElementById('printer-list');
    printers.forEach(printer => {
        const li = document.createElement('li');
        li.textContent = printer.name;
        list.appendChild(li);
    });
});
