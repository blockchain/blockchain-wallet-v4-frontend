import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getBase, getData, getErrors, getRateQuote, getTrades } from './selectors'
import Success from './template.success'

class Checkout extends React.Component {
  componentWillMount () {
    this.props.coinifyDataActions.fetchRateQuote('EUR') // only pass quoteCurr as amt and base will always ben 1e8 and "BTC"
  }

  render () {
    const { data, modalActions, coinifyDataActions, rateQuote } = this.props
    const { handleTrade, fetchQuote } = coinifyDataActions
    const { showModal } = modalActions

    return data.cata({
      Success: (value) => <Success {...this.props}
        value={value}
        handleTrade={handleTrade}
        showModal={showModal}
        rateQuote={rateQuote}
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
  rateQuote: getRateQuote(state),
  trades: getTrades(state),
  errors: getErrors(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)
