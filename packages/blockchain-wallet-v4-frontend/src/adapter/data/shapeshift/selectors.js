import { curry, path } from 'ramda'

export const getOrder = path(['adapter', 'data', 'shapeshift', 'order'])

export const getPair = curry((pair, state) => path(['adapter', 'data', 'shapeshift', pair], state))
