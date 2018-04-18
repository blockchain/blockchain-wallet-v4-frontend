import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getBase, getData, getErrors, getQuote, getSellQuote, getTrades } from './selectors'
import Success from './template.success'

class Checkout extends React.Component {
  /* eslint-disable */
  state = {
    busy: false
  }
  /* eslint-enable */
  componentWillMount () {
    this.props.sfoxDataActions.fetchTrades()
    this.props.sfoxDataActions.fetchProfile()
    this.props.sfoxDataActions.sfoxFetchAccounts()
    // this.props.sfoxDataActions.fetchQuote({quote: { amt: 1e8, baseCurr: 'BTC', quoteCurr: 'USD' }})
  }

  render () {
    const { data, modalActions, sfoxActions, sfoxDataActions } = this.props
    const { handleTrade, fetchQuote, refreshQuote, fetchSellQuote } = sfoxDataActions
    const { showModal } = modalActions

    return data.cata({
      Success: (value) => <Success {...this.props}
        value={value}
        handleTrade={handleTrade}
        showModal={showModal}
        fetchQuote={(quote) => fetchQuote({ quote, nextAddress: value.nextAddress })}
        fetchSellQuote={(quote) => fetchSellQuote({ quote })}
        refreshQuote={() => refreshQuote()}
        submitQuote={(quote) => { sfoxActions.submitQuote(quote); this.setState({ busy: true }) }}
        busy={this.state.busy}
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
  quoteR: getQuote(state),
  sellQuoteR: getSellQuote(state),
  trades: getTrades(state),
  errors: getErrors(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  sfoxActions: bindActionCreators(actions.modules.sfox, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)
