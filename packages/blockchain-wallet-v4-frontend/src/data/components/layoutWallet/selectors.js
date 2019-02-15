import { path } from 'ramda'

export const getTrayOpened = path(['components', 'layoutWallet', 'trayOpened'])

export const getTrayContent = path([
  'components',
  'layoutWallet',
  'trayContent'
])

export const getMenuOpened = path(['components', 'layoutWallet', 'menuOpened'])

export const getSettingsOpened = path([
  'components',
  'layoutWallet',
  'settingsOpened'
])

export const getLockboxOpened = path([
  'components',
  'layoutWallet',
  'lockboxOpened'
])

export const getBalancesTable = path([
  'components',
  'layoutWallet',
  'balancesTable'
])
