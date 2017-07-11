import { path } from 'ramda'

export const getAdvancedSecurityDisplayed = path(['applicationState', 'ui', 'advancedSecurityDisplayed'])
export const getBitcoinDisplayed = path(['applicationState', 'ui', 'bitcoinDisplayed'])
export const getDropdownLanguageDisplayed = path(['applicationState', 'ui', 'dropdownLanguageDisplayed'])
export const getNavigationDisplayed = path(['applicationState', 'ui', 'navigationDisplayed'])
export const getSecurityCenterMenuDisplayed = path(['applicationState', 'ui', 'securityCenterMenuDisplayed'])
export const getHeaderMenuDisplayed = path(['applicationState', 'ui', 'headerMenuDisplayed'])
