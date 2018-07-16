import * as AT from './actionTypes'

// FETCH_METADATA_CONTACTS
export const fetchMetadataContacts = () => ({ type: AT.FETCH_METADATA_CONTACTS })
export const fetchMetadataContactsLoading = () => ({ type: AT.FETCH_METADATA_CONTACTS_LOADING })
export const fetchMetadataContactsSuccess = (data) => ({ type: AT.FETCH_METADATA_CONTACTS_SUCCESS, payload: data })
export const fetchMetadataContactsFailure = (error) => ({ type: AT.FETCH_METADATA_CONTACTS_FAILURE, payload: error })

export const createMetadataContacts = (data) => ({ type: AT.CREATE_METADATA_CONTACTS, payload: data })
