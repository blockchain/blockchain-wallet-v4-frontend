import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.common.btc.getWalletTransactions,
    selectors.core.common.bch.getWalletTransactions,
    selectors.core.common.eth.getWalletTransactions
  ],
  btcTransactions => {
    // const empty = page => isEmpty(page.data)
    // const search = propOr('', 'search', formValues)
    // const status = propOr('', 'status', formValues)
    // const filteredPages = !isEmpty(pages)
    //   ? pages.map(map(filterTransactions(status, search)))
    //   : []

    return {
      btcTransactions
      // empty: all(empty)(filteredPages),
      // search: search.length > 0 || status !== ''
    }
  }
)
