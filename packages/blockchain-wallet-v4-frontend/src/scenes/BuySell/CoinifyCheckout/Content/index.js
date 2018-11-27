import React from 'react'
import Buy from './Buy'
import Sell from './Sell'
import OrderHistory from './OrderHistory'
import EmailVerification from './EmailVerification'
import { model } from 'data'

const { COINIFY_SIGNUP_STATES } = model.coinify

class Checkout extends React.Component {
  render () {
    const { type, countrySelection } = this.props
    switch (type) {
      case COINIFY_SIGNUP_STATES.EMAIL:
        return <EmailVerification country={countrySelection} />
      case COINIFY_SIGNUP_STATES.BUY:
        return <Buy />
      case COINIFY_SIGNUP_STATES.SELL:
        return <Sell />
      default:
        return <OrderHistory />
    }
  }
}

export default Checkout
