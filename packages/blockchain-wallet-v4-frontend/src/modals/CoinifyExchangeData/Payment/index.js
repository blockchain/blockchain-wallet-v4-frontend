import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { getData, getQuote } from './selectors'
import Success from './template.success'
import { path } from 'ramda'
import Loading from 'components/BuySell/Loading'

class PaymentContainer extends Component {
  constructor (props) {
    super(props)

    this.handlePaymentClick = this.handlePaymentClick.bind(this)
    this.triggerKyc = this.triggerKyc.bind(this)

    this.state = { medium: '' }
  }

  componentDidMount () {
    this.props.coinifyDataActions.getPaymentMediums(this.props.quote.data)
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
    const { data, coinifyBusy } = this.props

    const busy = coinifyBusy.cata({
      Success: () => false,
      Failure: (err) => err,
      Loading: () => true,
      NotAsked: () => false
    })

    return data.cata({
      Success: (value) =>
        <Success
          value={value}
          getAccounts={this.getAccounts}
          // onSubmit={this.onSubmit}
          handlePaymentClick={this.handlePaymentClick}
          medium={this.state.medium}
          quote={this.props.quote}
          triggerKyc={this.triggerKyc}
          busy={busy}
        />,
      Failure: (msg) => <div>ERROR: {msg}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <div>Payment Medium Not asked...</div>
    })
  }
}

PaymentContainer.propTypes = {
  quote: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  data: getData(state),
  quote: getQuote(state),
  coinifyBusy: path(['coinify', 'coinifyBusy'], state)
})

const mapDispatchToProps = (dispatch) => ({
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PaymentContainer)
