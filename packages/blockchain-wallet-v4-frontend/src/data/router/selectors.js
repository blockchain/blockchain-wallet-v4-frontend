import { path } from 'ramda'

export const getPathname = path(['router', 'location', 'pathname'])
