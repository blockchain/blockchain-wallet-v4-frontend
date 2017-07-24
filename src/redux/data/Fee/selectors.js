import { path, defaultTo, compose } from 'ramda'

export const getFee = path(['fee'])
export const getRegular = compose(defaultTo(1), path(['fee', 'regular']))
export const getPriority = compose(defaultTo(1), path(['fee', 'priority']))
