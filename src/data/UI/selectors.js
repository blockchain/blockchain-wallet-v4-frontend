import { path } from 'ramda'

export const getBitcoinDisplayed = path(['applicationState', 'ui', 'bitcoinDisplayed'])
export const getDropdownLanguageDisplayed = path(['applicationState', 'ui', 'dropdownLanguageDisplayed'])
export const getExploreMenuDisplayed = path(['applicationState', 'ui', 'exploreMenuDisplayed'])
export const getNavigationDisplayed = path(['applicationState', 'ui', 'navigationDisplayed'])
export const getSecurityCenterMenuDisplayed = path(['applicationState', 'ui', 'securityCenterMenuDisplayed'])
