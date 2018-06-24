import AT from './actionTypes'

export const addAddressLabel = (address, label) => ({type: AT.ADD_ADDRESS_LABEL, payload: {address, label}} )