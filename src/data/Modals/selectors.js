import { path } from 'ramda'

export const getPayload = path(['applicationState', 'modals', 'payload'])
export const getShow = path(['applicationState', 'modals', 'show'])
export const getType = path(['applicationState', 'modals', 'type'])
