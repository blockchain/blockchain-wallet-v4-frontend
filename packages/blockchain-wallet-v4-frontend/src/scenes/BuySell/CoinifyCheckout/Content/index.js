import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getBase, getData, getErrors, getQuote, getTrades } from './selectors'
import Success from './template.success'

class Checkout extends React.Component {
  componentWillMount () {
    // this.props.coinifyDataActions.fetchTrades()
    this.props.coinifyDataActions.fetchProfile()
    // this.props.coinifyDataActions.fetchAccounts()
    this.props.coinifyDataActions.fetchQuote({quote: { amt: 1e8, baseCurr: 'BTC', quoteCurr: 'EUR' }})
  }

  render () {
    const { data, modalActions, coinifyDataActions } = this.props
    const { handleTrade, fetchQuote } = coinifyDataActions
    const { showModal } = modalActions

    return data.cata({
      Success: (value) => <Success {...this.props}
        value={value}
        handleTrade={handleTrade}
        showModal={showModal}
        fetchQuote={(quote) => fetchQuote({ quote, nextAddress: value.nextAddress })}
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
  quote: getQuote(state),
  // trades: getTrades(state),
  errors: getErrors(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)
