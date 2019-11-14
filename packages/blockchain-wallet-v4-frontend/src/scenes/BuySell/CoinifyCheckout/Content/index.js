import Buy from './Buy'
import OrderHistory from './OrderHistory'
import React from 'react'
import Sell from './Sell'

class Checkout extends React.PureComponent {
  render () {
    const { type } = this.props
    switch (type) {
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
