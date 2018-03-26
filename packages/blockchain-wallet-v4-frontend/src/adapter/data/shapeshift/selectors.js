import { curry, path } from 'ramda'

export const getPair = curry((pair, state) => path(['adapter', 'data', 'shapeshift', pair], state))
