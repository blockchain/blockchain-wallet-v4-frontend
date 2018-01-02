import {ADD, CONNECT, CONNECTED, DISCONNECTED} from './actionTypes';

export const connect = (publicKey, ip, port) => ({type: CONNECT, publicKey, ip, port})
export const add = (peer) => ({type: ADD, peer})
export const connected = (peer) => ({type: CONNECTED, peer})
export const disconnected = (peer) => ({type: DISCONNECTED, peer})
