import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getData } from './selectors'
import Success from './template.success'
import Loading from '../../../template.loading'

class BuyContainer extends React.Component {
  constructor (props) {
    super(props)

    this.startBuy = this.startBuy.bind(this)
  }

  componentDidMount () {
    this.props.coinifyActions.initializeCheckoutForm()
    this.props.coinifyDataActions.fetchTrades()
    this.props.coinifyDataActions.getKycs()
    if (this.props.step === 'isx') this.props.coinifyActions.coinifyNextCheckoutStep('checkout')
  }

  startBuy () {
    const { buyQuoteR, paymentMedium, coinifyActions } = this.props
    coinifyActions.coinifyLoading()
    buyQuoteR.map(q => this.props.coinifyActions.initiateBuy({ quote: q, medium: paymentMedium }))
  }

  render () {
    const { data, modalActions, coinifyActions, coinifyDataActions, rateQuoteR, buyQuoteR, currency, paymentMedium, trade, ...rest } = this.props
    const { step, checkoutBusy, coinifyBusy } = rest
    const { handleTrade, fetchQuote } = coinifyDataActions
    const { showModal } = modalActions
    const { coinifyNotAsked, triggerKYC, openKYC } = coinifyActions

    const busy = coinifyBusy.cata({
      Success: () => false,
      Failure: (err) => err,
      Loading: () => true,
      NotAsked: () => false
    })

    return data.cata({
      Success: (value) => <Success {...this.props}
        value={value}
        handleTrade={handleTrade}
        showModal={showModal}
        buyQuoteR={buyQuoteR}
        rateQuoteR={rateQuoteR}
        fetchBuyQuote={(quote) => fetchQuote({ quote, nextAddress: value.nextAddress })}
        currency={currency}
        checkoutBusy={checkoutBusy}
        setMax={(amt) => this.props.coinifyActions.setCheckoutMax(amt)}
        setMin={(amt) => this.props.coinifyActions.setCheckoutMin(amt)}
        paymentMedium={paymentMedium}
        initiateBuy={this.startBuy}
        step={step}
        busy={busy}
        clearTradeError={() => coinifyNotAsked()}
        trade={trade}
        triggerKyc={() => triggerKYC()}
        handleKycAction={(kyc) => openKYC(kyc)}
      />,
      Failure: (msg) => <div>Failure: {msg.error}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <div>Not Asked</div>
    })
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BuyContainer)
