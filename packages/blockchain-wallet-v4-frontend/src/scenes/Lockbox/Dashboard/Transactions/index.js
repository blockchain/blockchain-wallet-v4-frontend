import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class TransactionsContainer extends React.PureComponent {
  loadMore = () => {
    this.props.lockboxActions.updateTransactionList(this.props.deviceIndex)
  }

  render() {
    const { data } = this.props
    return data.cata({
      Failure: () => <div>Something went wrong.</div>,
      Loading: () => <Loading />,
      NotAsked: () => <div />,
      Success: (val) => (
        <Success
          currency={val.currency}
          loadMore={this.loadMore}
          isLoading={val.isLoading}
          searchesApplied={val.searchesApplied}
          transactions={val.filteredTransactions}
          transactionsAtBounds={val.transactionsAtBounds}
        />
      )
    })
  }
}

const mapDispatchToProps = (dispatch) => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsContainer)
