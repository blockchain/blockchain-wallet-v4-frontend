import { path } from 'ramda'
import { walletOptionsPath } from '../paths'

export const getOptions = path([walletOptionsPath])
export const getDomains = state => getOptions(state).map(path(['domains']))
export const getMigrationRedirects = state => getOptions(state).map(path(['platforms', 'web', 'application', 'enableDomainMigrationRedirects']))
export const getShapeshiftStates = state => getOptions(state).map(path(['platforms', 'web', 'shapeshift', 'states']))
export const getAnnouncements = state => getOptions(state).map(path(['platforms', 'web', 'application', 'announcements']))
export const getEthereumTxFuse = state => getOptions(state).map(path(['platforms', 'web', 'ethereum', 'lastTxFuse']))
