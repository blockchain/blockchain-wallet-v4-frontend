import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isEmpty, equals, anyPass, allPass, map, compose, filter, curry, propSatisfies, contains, toUpper, prop } from 'ramda'

import { selectors, actions } from 'data'
import List from './template.js'

const threshold = 250

class ListContainer extends React.Component {
  constructor (props) {
    super(props)
    this.filteredTransactions = []
    this.fetchTransactions = this.fetchTransactions.bind(this)
    this.filterTransactions = this.filterTransactions.bind(this)
  }

  componentWillMount () {
    if (isEmpty(this.props.transactions)) {
      this.fetchTransactions(this.props.source)
    } else {
      this.filterTransactions(this.props.status, this.props.search, this.props.transactions)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.source, nextProps.source)) {
      this.fetchTransactions(nextProps.source)
      return
    }

    if (!equals(this.props.status, nextProps.status) ||
        !equals(this.props.search, nextProps.search) ||
        !equals(this.props.transactions, nextProps.transactions)) {
      this.filterTransactions(nextProps.status, nextProps.search, nextProps.transactions)
      return
    }

    if (!equals(this.props.scroll.yOffset, nextProps.scroll.yOffset)) {
      if (nextProps.scroll.yMax - nextProps.scroll.yOffset < threshold) {
        this.fetchTransactions(nextProps.source)
      }
    }
  }

  fetchTransactions (source) {
    this.props.dataActions.getTransactions(source, 50)
  }

  filterTransactions (status, criteria, transactions) {
    const isOfType = curry((filter, tx) => propSatisfies(x => filter === '' || toUpper(x) === toUpper(filter), 'type', tx))
    const search = curry((text, property, tx) => compose(contains(toUpper(text || '')), toUpper, prop(property))(tx))
    const searchPredicate = anyPass(map(search(criteria), ['description', 'from', 'to']))
    const fullPredicate = allPass([isOfType(status), searchPredicate])
    this.filteredTransactions = filter(fullPredicate, transactions)
  }

  shouldComponentUpdate (nextProps) {
    if (!equals(this.props.source, nextProps.source)) return true
    if (!equals(this.props.status, nextProps.status)) return true
    if (!equals(this.props.search, nextProps.search)) return true
    if (!equals(this.props.transactions, nextProps.transactions)) return true
    return false
  }

  render () {
    return (
      <List transactions={this.filteredTransactions} currency={this.props.currency} />
    )
  }
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('bitcoinTransaction')
  const initialSource = selector(state, 'source')

  return {
    currency: selectors.core.settings.getCurrency(state),
    source: initialSource ? (initialSource.xpub ? initialSource.xpub : initialSource.address) : '',
    status: selector(state, 'status') || '',
    search: selector(state, 'search') || '',
    transactions: selectors.core.common.getWalletTransactions(state),
    totalTransactions: selectors.core.data.info.getNumberTransactions(state),
    scroll: selectors.scroll.selectScroll(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  dataActions: bindActionCreators(actions.data, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ListContainer)
