import { createSelector } from 'reselect'
import { selectors } from 'data'
import {
  all,
  curry,
  isEmpty,
  propSatisfies,
  toUpper,
  allPass,
  anyPass,
  compose,
  contains,
  map,
  filter,
  path,
  propOr
} from 'ramda'

const filterTransactions = curry((status, criteria, transactions) => {
  const isOfType = curry((filter, tx) =>
    propSatisfies(
      x => filter === '' || toUpper(x) === toUpper(filter),
      'type',
      tx
    )
  )
  const search = curry((text, property, tx) =>
    compose(
      contains(toUpper(text || '')),
      toUpper,
      String,
      path(property)
    )(tx)
  )
  const searchPredicate = anyPass(
    map(search(criteria), [
      ['description'],
      ['from'],
      ['to'],
      ['hash'],
      ['outputs', 0, 'address'],
      ['inputs', 0, 'address']
    ])
  )

  const fullPredicate = allPass([isOfType(status), searchPredicate])
  return filter(fullPredicate, transactions)
})

export const getData = createSelector(
  [
    selectors.form.getFormValues('bchTransactions'),
    selectors.core.common.bch.getWalletTransactions
  ],
  (formValues, pages, trades) => {
    const empty = page => isEmpty(page.data)
    const search = propOr('', 'search', formValues)
    const status = propOr('', 'status', formValues)
    const filteredPages = !isEmpty(pages)
      ? pages.map(map(filterTransactions(status, search)))
      : []

    return {
      pages: filteredPages,
      empty: all(empty)(filteredPages),
      search: search.length > 0 || status !== ''
    }
  }
)
