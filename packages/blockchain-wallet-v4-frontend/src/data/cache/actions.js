import * as AT from './actionTypes'

export const announcementDismissed = id => ({
  type: AT.ANNOUNCEMENT_DISMISSED,
  payload: { id }
})
export const announcementToggled = (id, collapsed) => ({
  type: AT.ANNOUNCEMENT_TOGGLED,
  payload: { id, collapsed }
})
export const guidEntered = guid => ({
  type: AT.GUID_ENTERED,
  payload: { guid }
})
