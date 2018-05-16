import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getBase, getData, getErrors, getQuote, getSellQuote, getTrades, getPayment } from './selectors'
import Success from './template.success'
import Loading from '../../template.loading'
import { path } from 'ramda'

class Checkout extends React.PureComponent {
  componentWillMount () {
    this.props.sfoxDataActions.fetchTrades()
    this.props.sfoxDataActions.fetchProfile()
    this.props.sfoxDataActions.sfoxFetchAccounts()
    this.props.sfoxDataActions.fetchQuote({quote: { amt: 1e8, baseCurr: 'BTC', quoteCurr: 'USD' }})
    this.props.sfoxDataActions.fetchSellQuote({quote: { amt: 1e8, baseCurr: 'BTC', quoteCurr: 'USD' }})
  }

  componentDidMount () {
    this.props.sendBtcActions.sendBtcInitialized({ feeType: 'priority' })
  }

  render () {
    const { data, modalActions, sfoxActions, sfoxDataActions, payment, orderState } = this.props
    const { handleTrade, fetchQuote, refreshQuote, fetchSellQuote } = sfoxDataActions
    const { sfoxNotAsked } = sfoxActions
    const { showModal } = modalActions

    const busy = orderState.cata({
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
        fetchBuyQuote={(quote) => fetchQuote({ quote, nextAddress: value.nextAddress })}
        fetchSellQuote={(quote) => fetchSellQuote({ quote })}
        refreshQuote={() => refreshQuote()}
        submitBuyQuote={(quote) => { sfoxActions.submitQuote(quote); this.setState({ busy: true }) }}
        submitSellQuote={(quote) => { sfoxActions.submitSellQuote(quote); this.setState({ busy: true }) }}
        busy={busy}
        payment={payment}
        clearTradeError={() => sfoxNotAsked()}
      />,
      Failure: (msg) => <div>Failure: {msg}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <div>Not Asked</div>
    })
  }
}

const mapStateToProps = state => ({
  base: getBase(state),
  data: getData(state),
  buyQuoteR: getQuote(state),
  sellQuoteR: getSellQuote(state),
  trades: getTrades(state),
  errors: getErrors(state),
  payment: getPayment(state),
  orderState: path(['sfoxSignup', 'sfoxBusy'], state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  sfoxActions: bindActionCreators(actions.modules.sfox, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch),
  sendBtcActions: bindActionCreators(actions.components.sendBtc, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)
