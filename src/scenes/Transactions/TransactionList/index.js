import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { isEmpty } from 'ramda'
import { selectors, actions } from 'data'
import TransactionList from './template.js'

const txsPerPage = 50

class TransactionListContainer extends React.Component {

  componentWillMount () {
    if (isEmpty(this.props.transactions)) {
      this.props.tActions.requestTxs({onlyShow: this.props.onlyShow, n: txsPerPage})
    }
  }
  componentWillUpdate (nextProps) {
    if (this.props.onlyShow !== nextProps.onlyShow) {
      this.props.tActions.requestTxs({onlyShow: nextProps.onlyShow, n: txsPerPage})
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
    onlyShow: selectors.core.transactions.getOnlyShow(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  tActions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionListContainer)
