import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { Menu } from '../Exchange/Menu'
import Error from './template.error'
import Loading from './template.loading'
import React from 'react'
import styled from 'styled-components'
import Success from './template.success'

const Wrapper = styled.div`
  display: block;
  width: 100%;
`

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
    const Content = this.props.data.cata({
      Success: value => (
        <Success {...value} onScrollPastFinish={this.onScrollPastFinish} />
      ),
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })

    return (
      <Wrapper>
        <Menu />
        {Content}
      </Wrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchangeHistory, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(ExchangeHistoryContainer)
