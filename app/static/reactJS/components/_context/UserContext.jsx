import { createContext } from 'react';


const UserContext = new createContext();
const PrivacyContext = new createContext();
const UserChatlistContext = new createContext();
const UserChatlistSSEContext = new createContext();


export { UserContext, PrivacyContext, UserChatlistContext, UserChatlistSSEContext };