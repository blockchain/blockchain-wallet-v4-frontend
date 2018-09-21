import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import Success from './template.success'
import Loading from './template.loading'

class TransactionsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.loadMore = this.loadMore.bind(this)
  }

  loadMore () {
    this.props.lockboxActions.updateTransactionList(this.props.deviceIndex)
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: val => (
        <Success
          currency={val.currency}
          loadMore={this.loadMore}
          isLoading={val.isLoading}
          transactions={val.filteredTransactions}
          searchesApplied={val.searchesApplied}
        />
      ),
      Loading: () => <Loading />,
      Failure: () => <div>Something went wrong.</div>,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

export default connect(mapStateToProps)(TransactionsContainer)
