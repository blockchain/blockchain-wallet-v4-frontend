import { path } from 'ramda'

export const getFee = path(['fee'])
export const getRegular = path(['fee', 'regular'])
export const getPriority = path(['fee', 'priority'])
