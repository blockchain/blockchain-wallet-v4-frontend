import * as AT from './actionTypes'

// update
export const updateWhatsNew = (lastViewed) => ({ type: AT.UPDATE_WHATS_NEW, payload: { lastViewed } })

// FETCH_METADATA_WHATSNEW
export const fetchMetadataWhatsnew = () => ({ type: AT.FETCH_METADATA_WHATSNEW })
export const fetchMetadataWhatsnewLoading = () => ({ type: AT.FETCH_METADATA_WHATSNEW_LOADING })
export const fetchMetadataWhatsnewSuccess = (data) => ({ type: AT.FETCH_METADATA_WHATSNEW_SUCCESS, payload: data })
export const fetchMetadataWhatsnewFailure = (error) => ({ type: AT.FETCH_METADATA_WHATSNEW_FAILURE, payload: error })
