import { dialog } from 'electron';

function post(path, data) {
    return fetch(global.config.apiEndpoint + '/' + path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'

        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(result => {
                dialog.showErrorBox('Login Error', result.message);
                throw new Error(result.message);
            });
        }

        return response.json();
    })
    .catch(error => {
        // This will catch fetch errors (e.g., server down, DNS error, CORS issue, etc.)
        if (error instanceof TypeError) {
            dialog.showErrorBox('Network Error', 'Unable to connect to the server, ' + error.message);
        }
    })
}

export { post };