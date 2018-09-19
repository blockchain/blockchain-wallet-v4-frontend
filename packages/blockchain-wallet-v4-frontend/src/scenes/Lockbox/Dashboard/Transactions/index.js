import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { actions } from 'data'
import Success from './template.success'
import Loading from './template.loading'

class TransactionsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.loadMore = this.loadMore.bind(this)
  }

  componentDidMount () {
    this.props.lockboxActions.initializeDashboard(this.props.deviceIndex)
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

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionsContainer)
