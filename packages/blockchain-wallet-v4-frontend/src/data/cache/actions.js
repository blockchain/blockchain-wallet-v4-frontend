import * as AT from './actionTypes'

export const guidEntered = (guid) => ({ type: AT.GUID_ENTERED, payload: { guid } })
