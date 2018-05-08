import { createSelector } from 'reselect'
import { selectors } from 'data'
import { curry, isEmpty, propSatisfies, toUpper, prop, allPass, anyPass, compose, contains, map, filter } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

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
    selectors.core.common.ethereum.getTransactions
  ],
  (formValues, list) => {
    const search = prop('search', formValues) || ''
    const status = prop('status', formValues) || ''
    const filteredList = list.map(isEmpty).getOrElse(false)
      ? Remote.of([])
      : list.map(filterTransactions(status, search))

    return {
      list: filteredList,
      search: search.length > 0,
      empty: filteredList.map(isEmpty).getOrElse(false)
    }
  }
)
