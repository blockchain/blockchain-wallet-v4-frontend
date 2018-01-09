import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isEmpty, equals, anyPass, allPass, map, compose, filter, curry,
         propSatisfies, contains, toUpper, prop } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import { selectors, actions } from 'data'
import Empty from './Empty'
import List from './List'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const filterTxs = curry((status, criteria, transactions) => {
  const isOfType = curry((filter, tx) => propSatisfies(x => filter === '' || toUpper(x) === toUpper(filter), 'type', tx))
  const search = curry((text, property, tx) => compose(contains(toUpper(text || '')), toUpper, prop(property))(tx))
  const searchPredicate = anyPass(map(search(criteria), ['description', 'from', 'to']))
  const fullPredicate = allPass([isOfType(status), searchPredicate])
  return filter(fullPredicate, transactions)
})

class ContentContainer extends React.Component {
  constructor (props) {
    super(props)
    this.filteredTx = Remote.NotAsked
  }

  componentWillMount () {
    this.filteredTx = this.props.txs.map(filterTxs(this.props.status, this.props.search))
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.status, nextProps.status) ||
        !equals(this.props.search, nextProps.search) ||
        !equals(this.props.txs, nextProps.txs)) {
      this.filteredTx = nextProps.txs.map(filterTxs(nextProps.status, nextProps.search))
    }
  }

  shouldComponentUpdate (nextProps) {
    if (!equals(this.props.status, nextProps.status)) return true
    if (!equals(this.props.search, nextProps.search)) return true
    if (!equals(this.props.txs, nextProps.txs)) return true
    return false
  }

  render () {
    return this.filteredTx.cata({
      // I check this.props.txs because I dont want to show empty if filetered = [] but txs != []
      Success: (txlist) => !isEmpty(this.props.txs) ? <List transactions={txlist} /> : <Empty />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  status: formValueSelector('etherTransaction')(state, 'status') || '',
  search: formValueSelector('etherTransaction')(state, 'search') || '',
  txs: selectors.core.common.ethereum.getTransactions(state),
  scroll: selectors.scroll.selectScroll(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modules.transactionEther, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer)
