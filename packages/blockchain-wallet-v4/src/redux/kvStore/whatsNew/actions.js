import * as AT from './actionTypes'

// update
export const updateMetadataWhatsNew = (lastViewed) => ({ type: AT.UPDATE_METADATA_WHATSNEW, payload: { lastViewed } })

// fetch
export const fetchMetadataWhatsnew = () => ({ type: AT.FETCH_METADATA_WHATSNEW })
export const fetchMetadataWhatsnewLoading = () => ({ type: AT.FETCH_METADATA_WHATSNEW_LOADING })
export const fetchMetadataWhatsnewSuccess = (data) => ({ type: AT.FETCH_METADATA_WHATSNEW_SUCCESS, payload: data })
export const fetchMetadataWhatsnewFailure = (error) => ({ type: AT.FETCH_METADATA_WHATSNEW_FAILURE, payload: error })

// create
export const createMetadataWhatsnew = (data) => ({ type: AT.CREATE_METADATA_WHATSNEW, payload: data })
