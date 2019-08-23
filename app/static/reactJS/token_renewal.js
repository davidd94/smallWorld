

const tokenRenewal = async () => {
    let oldToken = localStorage.getItem('token');

    // initialize async request to retrieve new token
    return await fetch('/api/reauth_token', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'old_token': oldToken})
    })
    .then(serverResponse => {
        serverResponse.json()
        .then((refreshResponse) => {
            if (refreshResponse != 'Failed to reauth. Please log in again.') {
                localStorage.setItem('token', refreshResponse);
                return true;
            } else {
                localStorage.removeItem('token');
            };
        });
    });
};


export default tokenRenewal;