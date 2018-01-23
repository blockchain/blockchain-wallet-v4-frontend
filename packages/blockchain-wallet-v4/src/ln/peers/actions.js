import {ADD, CONNECT, REMOVE, DISCONNECT, CONNECTED, DISCONNECTED, SEND_MESSAGE, PING_RECEIVED, INIT_MESSAGE_RECEIVED} from './actionTypes';

export const addPeer = (publicKey) => ({type: ADD, publicKey})
export const removePeer = (publicKey) => ({type: REMOVE, publicKey})

export const connected = (publicKey) => ({type: CONNECTED, publicKey})
export const disconnected = (publicKey) => ({type: DISCONNECTED, publicKey})
export const updateLastPing = (publicKey) => ({type: PING_RECEIVED, publicKey})
export const initMessageReceived = (publicKey) => ({type: INIT_MESSAGE_RECEIVED, publicKey})


// other update state actions????

export const connect = (publicKey, ip, port) => ({type: CONNECT, publicKey, ip, port})
export const disconnect = (publicKey, ip, port) => ({type: DISCONNECT, publicKey, ip, port})
export const sendMessage = (publicKey, message) => ({type: SEND_MESSAGE, publicKey, message})
