import {MESSAGE} from './actionTypes'

export const message = (peer, message) => ({type: MESSAGE, peer, message})
