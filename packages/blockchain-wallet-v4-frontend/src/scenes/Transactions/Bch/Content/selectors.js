import { formValueSelector } from 'redux-form'
import { selectors } from 'data'
import { curry, propSatisfies, toUpper, prop, allPass, anyPass, compose, contains, map, filter } from 'ramda'

const filterTransactions = curry((status, criteria, transactions) => {
  const isOfType = curry((filter, tx) => propSatisfies(x => filter === '' || toUpper(x) === toUpper(filter), 'type', tx))
  const search = curry((text, property, tx) => compose(contains(toUpper(text || '')), toUpper, String, prop(property))(tx))
  const searchPredicate = anyPass(map(search(criteria), ['description', 'from', 'to']))
  const fullPredicate = allPass([isOfType(status), searchPredicate])
  return filter(fullPredicate, transactions)
})
// getData :: state -> {filtered: Remote(), total: Remote(Int)}
export const getData = state => {
  const txs = selectors.core.common.bch.getWalletTransactions(state)
  const status = formValueSelector('bchTransaction')(state, 'status') || ''
  const search = formValueSelector('bchTransaction')(state, 'search') || ''
  const source = formValueSelector('bchTransaction')(state, 'source') || {}
  const transactions = txs.map(map(filterTransactions(status, search)))
  return { pages: transactions, source: source.address || source.xpub, search: search.length > 0 }
}
