import React from 'react'
import Buy from './Buy'
import Sell from './Sell'
import OrderHistory from './OrderHistory'

class Checkout extends React.Component {
  render () {
    const { type } = this.props
    switch (type) {
      case 'buy': return <Buy />
      case 'sell': return <Sell />
      default: return <OrderHistory />
    }
  }
}

export default Checkout
