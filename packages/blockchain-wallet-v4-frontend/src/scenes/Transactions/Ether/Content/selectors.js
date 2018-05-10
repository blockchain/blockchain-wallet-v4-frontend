import { createSelector } from 'reselect'
import { selectors } from 'data'
import { all, curry, isEmpty, propSatisfies, toUpper, prop, allPass, anyPass, compose, contains, map, filter } from 'ramda'

const filterTransactions = curry((status, criteria, transactions) => {
  const isOfType = curry((filter, tx) => propSatisfies(x => filter === '' || toUpper(x) === toUpper(filter), 'type', tx))
  const search = curry((text, property, tx) => compose(contains(toUpper(text || '')), toUpper, String, prop(property))(tx))
  const searchPredicate = anyPass(map(search(criteria), ['description', 'from', 'to']))
  const fullPredicate = allPass([isOfType(status), searchPredicate])
  return filter(fullPredicate, transactions)
})

export const getData = createSelector(
  [
    selectors.form.getFormValues('ethTransactions'),
    selectors.core.common.ethereum.getWalletTransactions
  ],
  (formValues, pages) => {
    const empty = (page) => isEmpty(page.data)
    const search = prop('search', formValues) || ''
    const status = prop('status', formValues) || ''
    const filteredPages = !isEmpty(pages)
      ? pages.map(map(filterTransactions(status, search)))
      : []

    return {
      pages: filteredPages,
      search: search.length > 0,
      empty: all(empty)(filteredPages)
    }
  }
)
