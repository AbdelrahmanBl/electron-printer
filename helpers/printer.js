import { BrowserWindow, dialog } from 'electron';

function definePusher() {
    // const pusher = new Pusher('ff383959a24accbacd3c', {
    //     cluster: 'eu'
    // });
    // const channel = pusher.subscribe('print-channel');
    // channel.bind('print-html', (data) => {
    //     const htmlContent = data.html; // HTML content to print
    //     const printerName = data.printer;    // Exact printer name
    //     sendToPrinter(htmlContent, printerName);
    // });
}

function sendToPrinter(htmlContent, printerName) {
    // console.log(htmlContent, printerName);

    const printWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    printWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

    printWindow.webContents.on('did-finish-load', () => {
        const printOptions = {
            silent: true, 
            printBackground: true,
            deviceName: printerName,
            pageSize: {
                width: 80000,
                height: 1000000
            },
            margins: {
                marginType: 'none'
            }
        };

        printWindow.webContents.print(printOptions, (success, failureReason) => {
            if (!success) {
                dialog.showErrorBox('Print Error', 'Print failed: ' + failureReason + ' - ' + printerName);
                console.log('error in print');
            }
            printWindow.close();
            console.log('printed successfully');
        });
    });
}

export { definePusher, sendToPrinter };