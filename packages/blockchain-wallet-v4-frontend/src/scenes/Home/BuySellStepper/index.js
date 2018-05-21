import React from 'react'

import BuySellStepper from './template.js'

class BuySellStepperContainer extends React.PureComponent {

  goToBuySell = () => {
    window.alert('hi')
  }
  render () {
    return (
      <BuySellStepper currentStep={2} goToBuySell={this.goToBuySell} />
    )
  }
}

export default BuySellStepperContainer
