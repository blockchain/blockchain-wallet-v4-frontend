import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { getData, getQuote } from './selectors'
import Success from './template.success'
import { path } from 'ramda'
import Loading from 'components/BuySell/Loading'
import Failure from 'components/BuySell/Failure'

class PaymentContainer extends Component {
  constructor (props) {
    super(props)

    this.handlePaymentClick = this.handlePaymentClick.bind(this)
    this.triggerKyc = this.triggerKyc.bind(this)

    this.state = { medium: '' }
  }

  componentDidMount () {
    const quote = this.props.quote
    if (quote) this.props.coinifyDataActions.getPaymentMediums(quote)
  }

  componentWillUnmount () {
    this.props.coinifyActions.coinifyNotAsked()
  }

  triggerKyc () {
    this.props.coinifyActions.coinifyLoading()
    this.props.coinifyActions.triggerKYC()
  }

  handlePaymentClick (medium) {
    this.setState({ medium })
    this.props.coinifyActions.saveMedium(medium)
  }

  render () {
    const { data, coinifyBusy, coinifyActions } = this.props
    const { openKYC, checkoutCardMax } = coinifyActions

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
          triggerKyc={this.triggerKyc}
          busy={busy}
          openPendingKyc={openKYC}
          handlePrefillCardMax={limits => checkoutCardMax(limits)}
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
  coinifyBusy: path(['coinify', 'coinifyBusy'], state)
})

const mapDispatchToProps = dispatch => ({
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentContainer)
