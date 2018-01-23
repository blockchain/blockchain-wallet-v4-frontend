import {PUSH_TRANSACTION, ADD_TRANSACTION, TRANSACTION_CONFIRMED, TRANSACTION_PUSHED} from './actionTypes'

// sagas
export const pushTransaction = (tx, requiredConfirmations) => ({type: PUSH_TRANSACTION, txHex, requiredConfirmations})

// reducers
export const addTransaction = (tx, requiredConfirmations) => ({type: ADD_TRANSACTION, txHex, requiredConfirmations})
export const transactionPushed = (tx) => ({type: TRANSACTION_PUSHED, txHex})
export const transactionConfirmed = (tx) => ({type: TRANSACTION_CONFIRMED, txHex})
