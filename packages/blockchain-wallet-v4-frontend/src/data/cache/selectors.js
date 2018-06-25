import { path } from 'ramda'

export const getAnnouncemnt = (id, state) => path(['cache', 'announcements', id], state)
export const getLastGuid = (state) => path(['cache', 'lastGuid'], state)
