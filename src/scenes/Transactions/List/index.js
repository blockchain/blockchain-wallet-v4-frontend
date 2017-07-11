import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// import { isEmpty, filter, propSatisfies, toUpper } from 'ramda'
import { isEmpty } from 'ramda'
import { selectors, actions } from 'data'
import TransactionList from './template.js'

const txsPerPage = 50

class TransactionListContainer extends React.Component {

  componentWillMount () {
    if (isEmpty(this.props.transactions)) {
      this.props.tActions.fetchTransactions(this.props.addressFilter, txsPerPage)
    }
  }
  componentWillUpdate (nextProps) {
    if (this.props.addressFilter !== nextProps.addressFilter) {
      this.props.tActions.fetchTransactions(nextProps.addressFilter, txsPerPage)
    }
  }

  render () {
    return (
      <TransactionList transactions={this.props.transactions} />
    )
  }
}

function mapStateToProps (state) {
  return {
    transactions: selectors.core.common.getWalletTransactions(state),
    addressFilter: selectors.core.transactions.getAddressFilter(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  tActions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionListContainer)
