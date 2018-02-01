import {ADD, CONNECT, REMOVE, DISCONNECT, CONNECTED, DISCONNECTED, SEND_MESSAGE, PING_RECEIVED, INIT_MESSAGE_RECEIVED} from './actionTypes'

export const addPeer = (pubKey) => ({type: ADD, pubKey})
export const removePeer = (pubKey) => ({type: REMOVE, pubKey})

export const connected = (pubKey) => ({type: CONNECTED, pubKey})
export const disconnected = (pubKey) => ({type: DISCONNECTED, pubKey})
export const updateLastPing = (pubKey) => ({type: PING_RECEIVED, pubKey})
export const initMessageReceived = (pubKey) => ({type: INIT_MESSAGE_RECEIVED, pubKey})

// other update state actions????

export const connect = (pubKey, ip, port) => ({type: CONNECT, pubKey, ip, port})
export const disconnect = (pubKey, ip, port) => ({type: DISCONNECT, pubKey, ip, port})
export const sendMessage = (pubKey, message) => ({type: SEND_MESSAGE, pubKey, message})
