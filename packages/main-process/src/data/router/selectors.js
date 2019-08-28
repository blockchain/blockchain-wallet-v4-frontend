import { path } from 'ramda'

export const getPathname = path(['router', 'location', 'pathname'])
export const getSearch = path(['router', 'location', 'search'])
