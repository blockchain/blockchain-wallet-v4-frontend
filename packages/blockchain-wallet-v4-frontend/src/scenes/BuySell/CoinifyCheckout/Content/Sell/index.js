import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getData } from './selectors'
import Success from './template.success'
import Loading from '../../../template.loading'

class SellContainer extends React.Component {
  constructor (props) {
    super(props)

    this.startSell = this.startSell.bind(this)
  }

  componentDidMount () {
    this.props.coinifyActions.initializeCheckoutForm()
  }

  startSell () {
    const { sellQuoteR, paymentMedium, coinifyActions } = this.props
    coinifyActions.coinifyLoading()
    sellQuoteR.map(q => this.props.coinifyActions.initiateSell({ quote: q, medium: paymentMedium }))
  }

  render () {
    const { data, modalActions, coinifyActions, coinifyDataActions, rateQuoteR, sellQuoteR, currency, paymentMedium, trade, ...rest } = this.props
    const { step, checkoutBusy, coinifyBusy } = rest
    const { handleTrade, fetchQuote } = coinifyDataActions
    const { showModal } = modalActions
    const { coinifyNotAsked } = coinifyActions

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
        sellQuoteR={sellQuoteR}
        rateQuoteR={rateQuoteR}
        fetchSellQuote={(quote) => fetchQuote({ quote, nextAddress: value.nextAddress })}
        currency={currency}
        checkoutBusy={checkoutBusy}
        setMax={(amt) => this.props.coinifyActions.setCheckoutMax(amt)}
        paymentMedium={paymentMedium}
        initiateSell={this.startSell}
        step={step}
        busy={busy}
        clearTradeError={() => coinifyNotAsked()}
        trade={trade}
      />,
      Failure: (msg) => <div>Failure: {msg.error}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
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

export default connect(mapStateToProps, mapDispatchToProps)(SellContainer)
