import React from 'react'
import Buy from './Buy'
import Sell from './Sell'
import OrderHistory from './OrderHistory'
import EmailVerification from './EmailVerification'

class Checkout extends React.Component {
  render () {
    const { type, countrySelection } = this.props
    switch (type) {
      case 'emailVerify':
        return <EmailVerification country={countrySelection} />
      case 'buy':
        return <Buy />
      case 'sell':
        return <Sell />
      default:
        return <OrderHistory />
    }
  }
}

export default Checkout
