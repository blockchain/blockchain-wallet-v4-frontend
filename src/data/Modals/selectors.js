import { path } from 'ramda'

export const getShow = path(['applicationState', 'modals', 'show'])
export const getAnimation = path(['applicationState', 'modals', 'animation'])
export const getType = path(['applicationState', 'modals', 'type'])
