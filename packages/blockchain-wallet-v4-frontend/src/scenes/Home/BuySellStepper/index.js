import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import BuySellStepper from './template.js'

class BuySellStepperContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.goToBuySell = this.goToBuySell.bind(this)
  }

  goToBuySell = () => {
    this.props.history.push('/buy-sell')
  }

  render () {
    return (
      <BuySellStepper currentStep={2} goToBuySell={this.goToBuySell} />
    )
  }
}

const mapStateToProps = (state) => ({
  // data: getData(state),
  // canBuy: selectors.exchange.getCanTrade(state, 'Buy')
})

export default withRouter(connect(mapStateToProps)(BuySellStepperContainer))
