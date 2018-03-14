import {STORE_OPTIONS, START_UP} from './actionTypes';

export const storeOptions = (options) => ({type: STORE_OPTIONS, options})
export const startUp = () => ({type: START_UP})
