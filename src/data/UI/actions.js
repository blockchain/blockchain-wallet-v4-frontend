import * as AT from 'data/actionTypes'

export const showExploreMenu = () => ({ type: AT.HEADER_SHOW_EXPLORE })
export const hideExploreMenu = () => ({ type: AT.HEADER_HIDE_EXPLORE })
export const toggleExploreMenu = () => ({ type: AT.HEADER_TOGGLE_EXPLORE })

export const showSecurityCenterMenu = () => ({ type: AT.MENU_LEFT_SHOW_SECURITY_CENTER })
export const hideSecurityCenterMenu = () => ({ type: AT.MENU_LEFT_HIDE_SECURITY_CENTER })
export const toggleSecurityCenterMenu = () => ({ type: AT.MENU_LEFT_TOGGLE_SECURITY_CENTER })
