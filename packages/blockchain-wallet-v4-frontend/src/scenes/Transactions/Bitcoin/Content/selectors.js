import { formValueSelector } from 'redux-form'
import { selectors } from 'data'
import { curry, propSatisfies, toUpper, prop, allPass, anyPass, compose, contains, map, filter, length, lift } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

const filterTransactions = curry((status, criteria, transactions) => {
  const isOfType = curry((filter, tx) => propSatisfies(x => filter === '' || toUpper(x) === toUpper(filter), 'type', tx))
  const search = curry((text, property, tx) => compose(contains(toUpper(text || '')), toUpper, prop(property))(tx))
  const searchPredicate = anyPass(map(search(criteria), ['description', 'from', 'to']))
  const fullPredicate = allPass([isOfType(status), searchPredicate])
  return filter(fullPredicate, transactions)
})
// getData :: state -> {filtered: Remote(), total: Remote(Int)}
export const getData = state => {
  const transactions = selectors.core.common.bitcoin.getWalletTransactions(state)
  const status = formValueSelector('bitcoinTransaction')(state, 'status') || ''
  const search = formValueSelector('bitcoinTransaction')(state, 'search') || ''
  const source = formValueSelector('bitcoinTransaction')(state, 'source') || {}
  const filtered = transactions.map(map(filterTransactions(status, search)))
  // console.log(filtered)
  const total = transactions.map(map(length)) // Remote [ Int ]
  // console.log(total)
  // return lift((transactions, total) => ({ transactions, total, source: source.address || source.xpub }))(filtered, total)
  return {transactions: [Remote.Success([]), Remote.Success([]), Remote.Loading], total: Remote.of(10)}
}

export const getContext = selectors.core.wallet.getWalletContext
