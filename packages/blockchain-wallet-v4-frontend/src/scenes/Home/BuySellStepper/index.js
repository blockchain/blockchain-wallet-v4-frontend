import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { selectors } from 'data'
import * as SfoxService from 'services/SfoxService'
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
    const { canTrade } = this.props
    const partner = canTrade.cata({ Success: (val) => val, Loading: () => false, Failure: () => false, NotAsked: () => false })
    const totalSteps = partner === 'sfox' ? 4 : 2

    if (partner === 'sfox') {
      console.info(SfoxService.determineStep())
    } else {
      console.log('coinify')
    }

    return (partner ? <BuySellStepper partner={partner} currentStep={1} totalSteps={totalSteps} goToBuySell={this.goToBuySell} /> : null)
  }
}

const mapStateToProps = (state) => ({
  canTrade: selectors.exchange.getCanTrade(state)
})

export default withRouter(connect(mapStateToProps)(BuySellStepperContainer))
