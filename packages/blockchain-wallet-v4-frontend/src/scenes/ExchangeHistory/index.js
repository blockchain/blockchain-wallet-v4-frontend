import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ExchangeHistoryContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.fetchNextPage()
  }

  componentWillUnmount () {
    const { actions, canUseExchange } = this.props
    actions.destroyed()
    if (canUseExchange) {
      actions.clearTrades()
      actions.stopPollingTrades()
    }
  }

  onScrollPastFinish = () => {
    const { actions, canUseExchange, canLoadNextPage } = this.props
    if (!canUseExchange || !canLoadNextPage) return

    actions.fetchNextPage()
  }

  render () {
    return this.props.data.cata({
      Success: value => (
        <Success {...value} onScrollPastFinish={this.onScrollPastFinish} />
      ),
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchangeHistory, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(ExchangeHistoryContainer)
