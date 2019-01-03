import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import { getData, getQuote } from './selectors'
import Success from './template.success'
import Loading from 'components/BuySell/Loading'
import Failure from 'components/BuySell/Failure'
import { KYC_MODAL } from 'data/components/identityVerification/model'

class PaymentContainer extends Component {
  state = {
    medium: ''
  }

  componentDidMount () {
    const quote = this.props.quote
    if (quote) this.props.coinifyDataActions.getPaymentMediums(quote)
  }

  componentWillUnmount () {
    this.props.coinifyActions.coinifyNotAsked()
  }

  handlePaymentClick = (medium) => {
    this.setState({ medium })
    this.props.coinifyActions.saveMedium(medium)
  }

  render () {
    const { data, coinifyBusy, coinifyActions, modalActions } = this.props
    const { checkoutCardMax } = coinifyActions
    const { showModal } = modalActions

    const busy = coinifyBusy.cata({
      Success: () => false,
      Failure: err => err,
      Loading: () => true,
      NotAsked: () => false
    })

    return data.cata({
      Success: value => (
        <Success
          value={value}
          getAccounts={this.getAccounts}
          handlePaymentClick={this.handlePaymentClick}
          medium={this.state.medium}
          quote={this.props.quote}
          triggerKyc={() => showModal(KYC_MODAL)}
          busy={busy}
          handlePrefillCardMax={checkoutCardMax}
        />
      ),
      Failure: msg => <Failure error={msg} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

PaymentContainer.propTypes = {
  quote: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  data: getData(state),
  quote: getQuote(state).getOrElse(null),
  coinifyBusy: selectors.components.coinify.getCoinifyBusy(state)
})

const mapDispatchToProps = dispatch => ({
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyActions: bindActionCreators(actions.components.coinify, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentContainer)
