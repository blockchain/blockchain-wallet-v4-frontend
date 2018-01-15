import {ADD, CONNECT, CONNECTED, DISCONNECTED} from './actionTypes';

export const addPeer = (publicKey) => ({type: ADD, publicKey})
export const removePeer = (peer) => ({type: REMOVE, peer})

export const connected = (peer) => ({type: CONNECTED, peer})
export const disconnected = (peer) => ({type: DISCONNECTED, peer})

// other update state actions????

export const connect = (publicKey, ip, port) => ({type: CONNECT, publicKey, ip, port})
export const disconnect = (publicKey, ip, port) => ({type: CONNECT, publicKey, ip, port})
export const sendMessage = (publicKey, message) => ({type: SEND_MESSAGE, publicKey, message})
