import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData, getTrade } from './selectors'
import Failure from 'components/BuySell/Failure'
import Loading from 'components/BuySell/Loading'
import React from 'react'
import Success from './template.success.js'

class OrderHistoryContainer extends React.Component {
  componentDidMount () {
    this.props.coinifyDataActions.fetchTrades()
    this.props.sfoxDataActions.fetchTrades()
  }

  startBuy () {
    const { buyQuoteR, paymentMedium, coinifyActions } = this.props
    coinifyActions.coinifyLoading()
    buyQuoteR.map(q =>
      this.props.coinifyActions.initiateBuy({ quote: q, medium: paymentMedium })
    )
  }

  render () {
    const {
      data,
      modalActions,
      coinifyActions,
      formActions,
      step,
      trade,
      cancelTradeId
    } = this.props
    const { showModal } = modalActions
    const { finishTrade, cancelTrade, cancelSubscription } = coinifyActions
    const { change } = formActions

    return data.cata({
      Success: value =>
        value.isLoading ? (
          <Loading />
        ) : (
          <Success
            value={value}
            showModal={showModal}
            finishTrade={finishTrade}
            trade={trade}
            step={step}
            cancelTrade={cancelTrade}
            cancelTradeId={cancelTradeId}
            onCancelSubscription={cancelSubscription}
            changeTab={tab => change('buySellTabStatus', 'status', tab)}
          />
        ),
      Failure: msg => <Failure error={msg} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  trade: getTrade(state),
  step: selectors.components.coinify.getCoinifyCheckoutStep(state),
  cancelTradeId: selectors.components.coinify.getCoinifyCancelTradeId(state)
})

const mapDispatchToProps = dispatch => ({
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  coinifyActions: bindActionCreators(actions.components.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderHistoryContainer)
