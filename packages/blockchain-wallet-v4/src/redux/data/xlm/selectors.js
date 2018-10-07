import { path } from 'ramda'
import { dataPath } from '../../paths'
import { createDeepEqualSelector } from '../../../utils'
import * as kvStoreSelectors from '../../kvStore/xlm/selectors'

export const getContext = createDeepEqualSelector(
  [kvStoreSelectors.getDefaultAccountId],
  walletContextR => {
    return walletContextR.map(x => x).getOrElse([])
  }
)

export const getAddresses = path([dataPath, 'xlm', 'addresses'])

export const getBalance = path([dataPath, 'xlm', 'balance'])

export const getRates = path([dataPath, 'xlm', 'rates'])

export const getTransactions = path([dataPath, 'xlm', 'transactions'])
