import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getBase, getData, getErrors, getQuote, getRateQuote, getTrades, getCurrency } from './selectors'
import Success from './template.success'
import { formValueSelector } from 'redux-form'

class Checkout extends React.PureComponent {
  componentWillMount () {
    this.props.coinifyDataActions.fetchQuote({ quote: { amt: 1e8, baseCurr: 'BTC', quoteCurr: 'EUR' } }) // only pass quoteCurr as amt and base will always ben 1e8 and "BTC"
    this.props.coinifyDataActions.fetchTrades()
  }

  componentDidMount () {
    this.props.data.map(d => {
      if (d.profile._level) {
        this.props.coinifyDataActions.fetchRateQuote(d.profile._level.currency)
      }
    })
    this.props.actions.initialized()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.currency !== this.props.currency) {
      this.props.coinifyDataActions.fetchRateQuote(this.props.currency)
    }
  }

  render () {
    const { data, modalActions, coinifyDataActions, rateQuoteR, buyQuoteR, currency } = this.props
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
      />,
      Failure: (msg) => <div>Failure: {msg.error}</div>,
      Loading: () => <div>Loading...</div>,
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
  defaultCurrency: getCurrency(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  actions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)
