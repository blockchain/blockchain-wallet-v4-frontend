import React from 'react'

import wizardProvider from 'providers/WizardProvider'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class ReminderContainer extends React.PureComponent {
  componentWillMount () {
    this.props.resetStep()
  }

  render () {
    const { step, ...rest } = this.props

    switch (step) {
      case 1: return <FirstStep {...rest} />
      case 2: return <SecondStep {...rest} />
      default: return <FirstStep {...rest} />
    }
  }
}

export default wizardProvider('recover', 2)(ReminderContainer)
