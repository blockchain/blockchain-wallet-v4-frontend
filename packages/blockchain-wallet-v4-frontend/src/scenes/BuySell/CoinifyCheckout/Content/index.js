import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getBase, getData, getErrors, getQuote, getRateQuote, getTrades, getCurrency } from './selectors'
import Success from './template.success'
import { formValueSelector } from 'redux-form'
import Loading from '../../template.loading'

class Checkout extends React.PureComponent {
  componentDidMount () {
    this.props.actions.initializeCheckoutForm()
    this.props.coinifyDataActions.fetchTrades()
  }

  render () {
    const { data, modalActions, coinifyDataActions, rateQuoteR, buyQuoteR, currency, checkoutBusy } = this.props
    const { handleTrade, fetchQuote } = coinifyDataActions
    const { showModal } = modalActions
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
        setMax={(amt) => this.props.actions.setCheckoutMax(amt)}
      />,
      Failure: (msg) => <div>Failure: {msg.error}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <div>Not Asked</div>
    })
  }
}

const mapStateToProps = state => ({
  base: getBase(state),
  data: getData(state),
  buyQuoteR: getQuote(state),
  rateQuoteR: getRateQuote(state),
  trades: getTrades(state),
  errors: getErrors(state),
  currency: formValueSelector('coinifyCheckout')(state, 'currency'),
  defaultCurrency: getCurrency(state),
  checkoutBusy: state.coinify.checkoutBusy
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  actions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)
