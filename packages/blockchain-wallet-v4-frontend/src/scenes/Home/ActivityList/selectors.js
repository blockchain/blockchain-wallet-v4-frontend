import { take } from 'ramda'
import { selectors } from 'data'

export const getData = (state, number) => selectors.core.data.misc.getLogs(state).map(take(number))
