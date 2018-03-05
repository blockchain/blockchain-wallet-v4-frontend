import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getBase, getData, getErrors, getQuote, getTrades } from './selectors'
import Success from './template.success'
import Failure from './template.failure'

class Checkout extends React.Component {
  componentWillMount () {
    // this.props.sfoxDataActions.fetchProfile()
    this.props.sfoxDataActions.fetchAccounts()
    this.props.sfoxDataActions.fetchQuote({quote: { amt: 1e8, baseCurr: 'BTC', quoteCurr: 'USD' }})
  }

  componentDidMount () {
    this.props.sfoxDataActions.fetchProfile()
  }

  render () {
    const { data, errors, quote, base, trades, modalActions, sfoxDataActions, sfox } = this.props
    const { handleTrade, fetchQuote } = sfoxDataActions
    const { showModal } = modalActions
    console.log('sfox checkout index render', data)
    // return <div>hello sfoxCheckout index</div>
    return data.cata({
      Success: (value) => <Success user={sfox.user} base={base} value={value} errors={errors} quote={quote} handleTrade={handleTrade} showModal={showModal} fetchQuote={(quote) => fetchQuote({ quote, nextAddress: value.nextAddress })} />,
      Failure: (msg) => <Failure user={sfox.user} showModal={showModal} msg={msg} />,
      Loading: () => <div>Loading...</div>,
      NotAsked: () => <div>not asked</div>
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  base: getBase(state),
  data: getData(state, ownProps),
  quote: getQuote(state),
  // trades: getTrades(state),
  errors: getErrors(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)
