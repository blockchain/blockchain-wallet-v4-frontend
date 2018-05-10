import React from 'react'
import { connect } from 'react-redux'
import { getData } from './selectors'
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

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps, undefined)(Checkout)
