import {ADD_PRIVATE_KEY, START_UP} from './actionTypes';

export const addPrivateKey = (key) => ({type: ADD_PRIVATE_KEY, key})
export const startUp = () => ({type: START_UP})
