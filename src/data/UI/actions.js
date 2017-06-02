import { HEADER_SHOW_EXPLORE, HEADER_HIDE_EXPLORE, HEADER_TOGGLE_EXPLORE } from 'data/actionTypes'

export const showExploreMenu = () => ({ type: HEADER_SHOW_EXPLORE })
export const hideExploreMenu = () => ({ type: HEADER_HIDE_EXPLORE })
export const toggleExploreMenu = () => ({ type: HEADER_TOGGLE_EXPLORE })
