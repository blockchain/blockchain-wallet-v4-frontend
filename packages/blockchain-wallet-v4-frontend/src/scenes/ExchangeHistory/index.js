import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { SceneWrapper } from 'components/Layout'
import Error from './template.error'
import Header from './template.header'
import Loading from './template.loading'
import Menu from '../Exchange/Menu'
import React from 'react'
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
    const { showHelpModal } = this.props
    const Content = this.props.data.cata({
      Success: value => (
        <Success {...value} onScrollPastFinish={this.onScrollPastFinish} />
      ),
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })

    return (
      <SceneWrapper>
        <Header showHelpModal={showHelpModal} />
        <Menu showDownloadBtn />
        {Content}
      </SceneWrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchangeHistory, dispatch),
  showHelpModal: () => dispatch(actions.modals.showModal('Support'))
})

export default connect(
  getData,
  mapDispatchToProps
)(ExchangeHistoryContainer)
