import { path } from 'ramda'

export const getDisplayed = path(['applicationState', 'modals', 'displayed'])
export const getType = path(['applicationState', 'modals', 'modalType'])
