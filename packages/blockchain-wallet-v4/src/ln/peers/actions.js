import {ADD, REMOVE} from './actionTypes'

export const add = (publicKey) => ({type: ADD, publicKey})
export const remove = (publicKey) => ({type: REMOVE, publicKey})
