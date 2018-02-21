import { selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = state => Remote.of('test') // selectors.core.data.shapeShift.getShapeshiftQuotation(state)
