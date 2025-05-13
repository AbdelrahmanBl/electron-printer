import { dialog } from 'electron';
import fs from 'fs';

function get(path) {
    return fetch(global.config.apiEndpoint + '/' + path, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + getUserToken(),
        }
    })
    .then(response => handleResponse(response))
    .catch(error => handleError(error))
}

function post(path, data) {
    return fetch(global.config.apiEndpoint + '/' + path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + getUserToken(),
        },
        body: JSON.stringify(data)
    })
    .then(response => handleResponse(response))
    .catch(error => handleError(error))
}

function getUserToken() {
    if (fs.existsSync(global.paths.stores.user)) {
        const userData = fs.readFileSync(global.paths.stores.user, 'utf8');
        const user = JSON.parse(userData);

        if (user.token) {
            return user.token;
        }
    }

    return null;
}

function handleResponse(response) {
    if (!response.ok) {
        if(response.status === 401) {
            if (fs.existsSync(global.paths.stores.user)) {
                fs.unlinkSync(global.paths.stores.user);
            }

            global.mainWindow.reload();
        }

        return response.json().then(result => {
            
            const message = result?.errors && typeof result.errors === 'object' && Object.keys(result.errors).length > 0
            ? JSON.stringify(result.errors)
            : result?.message || result?.error || 'An unknown error occurred.';

            dialog.showErrorBox('Login Error', message);

            throw new Error(message);
        });
    }

    return response.json().then(result => {
        // Show success message box
        if (result.message) {
            dialog.showMessageBox({
                type: 'info', // 'info' is suitable for success messages
                title: 'Success',
                message: result.message,
                buttons: ['OK']
            });
        }
        
        // Return result (if you need to use it later)
        return result; 
    });
}

function handleError(error) {
    // This will catch fetch errors (e.g., server down, DNS error, CORS issue, etc.)
    if (error instanceof TypeError) {
        dialog.showErrorBox('Network Error', 'Unable to connect to the server, ' + error.message);
    }
}

export { get, post };