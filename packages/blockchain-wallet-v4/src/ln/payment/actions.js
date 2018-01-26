import {CREATE_PAYMENT_REQUEST, STORE_PAYMENT_REQUEST } from './actionTypes'

export const createPaymentRequest = (amount, description, timeout, fallbackAddress) => ({type: CREATE_PAYMENT_REQUEST, amount, description, timeout, fallbackAddress})
export const storePaymentRequest = (paymentRequest) => ({type: STORE_PAYMENT_REQUEST, paymentRequest})