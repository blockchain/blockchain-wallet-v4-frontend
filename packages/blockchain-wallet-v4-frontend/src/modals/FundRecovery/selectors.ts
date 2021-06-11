import { add, lift } from 'ramda'

import { ExtractSuccess } from 'core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { OwnProps } from './index'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const searchChainR = selectors.components.fundRecovery.getSearchChainStatus(state, ownProps.coin)

  return lift((searchChain: ExtractSuccess<typeof searchChainR>) => {
    debugger
    return {
      recoverableValue: searchChain[ownProps.coin].map(({ value }) => value).reduce(add),
      searchChain
    }
  })(searchChainR)
}

export default getData
