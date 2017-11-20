import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isEmpty, equals, anyPass, allPass, map, compose, filter, curry, propSatisfies, contains, toUpper, prop } from 'ramda'

import { selectors, actions } from 'data'
import Empty from './Empty'
import List from './List'

class ContentContainer extends React.Component {
  constructor (props) {
    super(props)
    this.filteredTransactions = []
    this.filterTransactions = this.filterTransactions.bind(this)
  }

  componentWillMount () {
    this.filterTransactions(this.props.status, this.props.search, this.props.transactions)
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.status, nextProps.status) ||
        !equals(this.props.search, nextProps.search) ||
        !equals(this.props.transactions, nextProps.transactions)) {
      this.filterTransactions(nextProps.status, nextProps.search, nextProps.transactions)
    }
  }

  filterTransactions (status, criteria, transactions) {
    const isOfType = curry((filter, tx) => propSatisfies(x => filter === '' || toUpper(x) === toUpper(filter), 'type', tx))
    const search = curry((text, property, tx) => compose(contains(toUpper(text || '')), toUpper, prop(property))(tx))
    const searchPredicate = anyPass(map(search(criteria), ['description', 'from', 'to']))
    const fullPredicate = allPass([isOfType(status), searchPredicate])
    this.filteredTransactions = filter(fullPredicate, transactions)
  }

  shouldComponentUpdate (nextProps) {
    if (!equals(this.props.status, nextProps.status)) return true
    if (!equals(this.props.search, nextProps.search)) return true
    if (!equals(this.props.transactions, nextProps.transactions)) return true
    return false
  }

  render () {
    return !isEmpty(this.filteredTransactions)
      ? <List transactions={this.filteredTransactions} />
      : <Empty />
  }
}

const mapStateToProps = (state) => ({
  status: formValueSelector('etherTransaction')(state, 'status') || '',
  search: formValueSelector('etherTransaction')(state, 'search') || '',
  transactions: selectors.core.common.getEthereumTransactions(state),
  scroll: selectors.scroll.selectScroll(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataActions: bindActionCreators(actions.data, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer)
