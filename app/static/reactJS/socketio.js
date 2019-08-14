import socketIOClient from 'socket.io-client';


const endpoint = "/";
const userToken = { query : { "token" : localStorage.getItem('token') } };

const socket = socketIOClient(endpoint, userToken);


export default socket;