import * as AT from './actionTypes'

export const createMetadataShapeshift = (data) => ({ type: AT.CREATE_METADATA_SHAPESHIFT, payload: data })
export const addStateMetadataShapeshift = (usState) => ({ type: AT.ADD_STATE_METADATA_SHAPESHIFT, payload: { usState } })

// ADD_TRADE_METADATA_SHAPESHIFT
export const addTradeMetadataShapeshift = (trade) => ({ type: AT.ADD_TRADE_METADATA_SHAPESHIFT, payload: { trade } })

// UPDATE_TRADE_METADATA_SHAPESHIFT
export const updateTradeStatusMetadataShapeshift = (depositAddress, status) => ({ type: AT.UPDATE_TRADE_STATUS_METADATA_SHAPESHIFT, payload: { depositAddress, status } })

// FETCH_METADATA_SHAPESHIFT
export const fetchMetadataShapeshift = () => ({ type: AT.FETCH_METADATA_SHAPESHIFT })
export const fetchMetadataShapeshiftLoading = () => ({ type: AT.FETCH_METADATA_SHAPESHIFT_LOADING })
export const fetchMetadataShapeshiftSuccess = (data) => ({ type: AT.FETCH_METADATA_SHAPESHIFT_SUCCESS, payload: data })
export const fetchMetadataShapeshiftFailure = (error) => ({ type: AT.FETCH_METADATA_SHAPESHIFT_FAILURE, payload: error })

// FETCH_METADATA_SHAPESHIFT
export const fetchShapeshiftTrade = (address) => ({ type: AT.FETCH_SHAPESHIFT_TRADE, payload: { address } })
export const fetchShapeshiftTradeSuccess = (data) => ({ type: AT.FETCH_SHAPESHIFT_TRADE_SUCCESS, payload: data })
export const fetchShapeshiftTradeFailure = (error) => ({ type: AT.FETCH_SHAPESHIFT_TRADE_FAILURE, payload: error })
