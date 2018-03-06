import React from 'react'
import { isEmpty } from 'ramda'
import { actions, selectors } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getBase, getData, getErrors, getQuote, getTrades } from './selectors'
import Success from './template.success'
import NotAsked from './template.notAsked'

class Checkout extends React.Component {
  componentWillMount () {
    console.log('will mount', this.props, !this.props.value.value.sfox.profile)
    if (!this.props.value.value.sfox.profile) {
      this.props.modalActions.showModal('SfoxExchangeData', { step: 'create' })
    } else {
      this.props.sfoxDataActions.fetchTrades()
      this.props.sfoxDataActions.fetchProfile()
      this.props.sfoxDataActions.fetchAccounts()
      this.props.sfoxDataActions.fetchQuote({quote: { amt: 1e8, baseCurr: 'BTC', quoteCurr: 'USD' }})
    }
  }

  render () {
    const { data, modalActions, sfoxDataActions } = this.props
    const { handleTrade, fetchQuote } = sfoxDataActions
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
  trades: getTrades(state),
  errors: getErrors(state),
  profile: selectors.core.data.sfox.getProfile(state),
  accounts: selectors.core.data.sfox.getAccounts(state),
  verificationStatus: selectors.core.data.sfox.getVerificationStatus(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)
