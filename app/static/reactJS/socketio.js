import socketIOClient from 'socket.io-client';

const tokenRenewal = async () => {
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
           } else {
               localStorage.removeItem('token');
           };
       });
   });
};


const sockettest = ({type, event, data} = {}) => {
    const endpoint = "/";
    const userToken = { query : { "token" : localStorage.getItem('token') } };
    let sockets = socketIOClient(endpoint, userToken);
    console.log(type, event, data);
    if (type === 'emit') {
        data ? sockets.emit(event, data) : sockets.emit(event);
        return true
    } else if (type === 'listen') {
        sockets.on(event, (responses) => {
            console.log(responses);
        });
        return true;
    } else if (type === 'connected') {
        return sockets.connected;
    } else if (type === 'close') {
        sockets.close();
        return true;
    };

    return console.log('Incorrect usage of socketEvent function...');
};

const endpoint = "/";
const userToken = { query : { "token" : localStorage.getItem('token') } };
let socket = socketIOClient(endpoint, userToken);

export default socket;