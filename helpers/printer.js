import { BrowserWindow, dialog } from 'electron';
import { get } from '../helpers/request.js';

function printTransaction(transactionId) {
    get(`categories-receipt-printers/transactions/${transactionId}`)
    .then(result => {
        result.data.printers.forEach(printer => {
            sendToPrinter(printer.options, printer.html)
        })
    })
}

function sendToPrinter(printOptions, htmlContent) {

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
        printWindow.webContents.print(printOptions, (success, failureReason) => {
            if (!success) {
                dialog.showErrorBox('Print Error', 'Print failed: ' + failureReason + ' - ' + printOptions.deviceName);
                console.log('error in print');
            }
            printWindow.close();
            console.log('printed successfully');
        });
    });
}

export { printTransaction, sendToPrinter }