import { path } from 'ramda'

export const getLastAnnouncementState = state =>
  path(['cache', 'announcements'], state)
export const getLastGuid = state => path(['cache', 'lastGuid'], state)
