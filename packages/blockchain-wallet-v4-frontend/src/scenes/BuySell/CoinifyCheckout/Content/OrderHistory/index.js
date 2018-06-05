import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getData, getTrade } from './selectors'
import Success from './template.success.js'
import Loading from 'components/BuySell/Loading'
import { path } from 'ramda'

class OrderHistoryContainer extends React.Component {
  componentDidMount () {
    this.props.coinifyDataActions.fetchTrades()
  }

  startBuy () {
    const { buyQuoteR, paymentMedium, coinifyActions } = this.props
    coinifyActions.coinifyLoading()
    buyQuoteR.map(q => this.props.coinifyActions.initiateBuy({ quote: q, medium: paymentMedium }))
  }

  render () {
    const { data, modalActions, coinifyActions, formActions, step, trade, busy, cancelTradeId, canTrade } = this.props
    const { showModal } = modalActions
    const { finishTrade, cancelTrade } = coinifyActions
    const { change } = formActions
    const status = busy.cata({ Success: () => false, Failure: (err) => err, Loading: () => true, NotAsked: () => false })

    return data.cata({
      Success: (value) => <Success
        value={value}
        showModal={showModal}
        finishTrade={finishTrade}
        trade={trade}
        step={step}
        cancelTrade={cancelTrade}
        status={status}
        cancelTradeId={cancelTradeId}
        canTrade={canTrade}
        changeTab={tab => change('buySellTabStatus', 'status', tab)}
      />,
      Failure: (msg) => <div>Failure: {msg.error}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  trade: getTrade(state),
  step: path(['coinify', 'checkoutStep'], state),
  busy: path(['coinify', 'coinifyBusy'], state),
  cancelTradeId: path(['coinify', 'cancelTradeId'], state)
})

const mapDispatchToProps = (dispatch) => ({
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistoryContainer)
