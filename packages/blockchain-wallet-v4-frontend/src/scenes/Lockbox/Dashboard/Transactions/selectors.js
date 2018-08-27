import { createSelector } from 'reselect'
import { selectors } from 'data'

export const getData = createSelector(
  [selectors.core.data.lockbox.getBtcTransactions],
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
