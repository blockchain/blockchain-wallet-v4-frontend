import { path } from 'ramda'

export const getHeight = path(['latest_block', 'height'])
export const getTime = path(['latest_block', 'time'])
export const getHash = path(['latest_block', 'hash'])
export const getIndex = path(['latest_block', 'block_index'])
