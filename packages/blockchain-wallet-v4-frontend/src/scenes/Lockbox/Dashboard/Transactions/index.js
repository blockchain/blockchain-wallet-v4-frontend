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
      Success: val => (
        <Success
          currency={val.currency}
          loadMore={this.loadMore}
          isLoading={val.isLoading}
          searchesApplied={val.searchesApplied}
          transactions={val.filteredTransactions}
          transactionsAtBounds={val.transactionsAtBounds}
        />
      ),
      Loading: () => <Loading />,
      Failure: () => <div>Something went wrong.</div>,
      NotAsked: () => <div />
    })
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const mapStateToProps = state => ({
  data: getData(state)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionsContainer)
