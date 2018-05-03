import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import ui from 'redux-ui'
import { getData, getQuote } from './selectors'
import Success from './template.success'

class PaymentContainer extends Component {
  constructor (props) {
    super(props)

    // this.onSubmit = this.onSubmit.bind(this)
    this.handlePaymentClick = this.handlePaymentClick.bind(this)

    this.state = { medium: '' }
  }

  componentDidMount () {
    this.props.coinifyDataActions.getPaymentMediums(this.props.quote.data)
  }

  handlePaymentClick (medium) {
    this.setState({ medium })
    this.props.coinifyActions.saveMedium(medium)
  }

  // onSubmit (e) {
  //   e.preventDefault()
  //   this.props.coinifyActions.saveMedium(this.state.medium)
  // }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) =>
        <Success
          value={value}
          getAccounts={this.getAccounts}
          // onSubmit={this.onSubmit}
          handlePaymentClick={this.handlePaymentClick}
          medium={this.state.medium}
          quote={this.props.quote}
        />,
      Failure: (msg) => <div>ERROR: {console.warn('ERR', msg)}</div>,
      Loading: () => <div>Loading...</div>,
      NotAsked: () => <div>Payment Medium Not asked...</div>
    })
  }
}

PaymentContainer.propTypes = {
  ui: PropTypes.object,
  updateUI: PropTypes.function,
  smsVerified: PropTypes.number.isRequired,
  emailVerified: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  data: getData(state),
  quote: getQuote(state)
})

const mapDispatchToProps = (dispatch) => ({
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: {} })
)

export default enhance(PaymentContainer)
