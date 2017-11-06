import React from 'react'

import wizardProvider from 'providers/WizardProvider'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class ExchangeBoxContainer extends React.Component {
  componentWillMount () {
    this.props.resetStep()
  }

  render () {
    switch (this.props.step) {
      case 1: return <FirstStep {...this.props} />
      case 2: return <SecondStep {...this.props} />
      default: return <div />
    }
  }
}

export default wizardProvider('ExchangeBox', 2)(ExchangeBoxContainer)
