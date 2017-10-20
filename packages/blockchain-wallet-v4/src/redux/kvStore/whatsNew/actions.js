import * as T from './actionTypes'

export const updateWhatsNew = (lastViewed) => ({ type: T.UPDATE_WHATS_NEW, payload: { lastViewed } })

export const setWhatsNew = (data) => ({ type: T.SET_WHATS_NEW, payload: { data } })
