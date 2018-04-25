import { formValueSelector } from 'redux-form'
import { selectors } from 'data'
import { curry, propSatisfies, toUpper, prop, allPass, anyPass, compose, contains, map, filter, length, lift } from 'ramda'

const filterTransactions = curry((status, criteria, transactions) => {
  const isOfType = curry((filter, tx) => propSatisfies(x => filter === '' || toUpper(x) === toUpper(filter), 'type', tx))
  const search = curry((text, property, tx) => compose(contains(toUpper(text || '')), toUpper, String, prop(property))(tx))
  const searchPredicate = anyPass(map(search(criteria), ['description', 'from', 'to']))
  const fullPredicate = allPass([isOfType(status), searchPredicate])
  return filter(fullPredicate, transactions)
})

export const getData = (state) => {
  const status = formValueSelector('etherTransaction')(state, 'status') || ''
  const search = formValueSelector('etherTransaction')(state, 'search') || ''
  const transactions = selectors.core.common.ethereum.getTransactions(state)
  const filtered = transactions.map(filterTransactions(status, search))
  const total = transactions.map(length)
  return lift((transactions, total) => ({ transactions, total }))(filtered, total)
}

export const getContext = selectors.core.kvStore.ethereum.getContext
