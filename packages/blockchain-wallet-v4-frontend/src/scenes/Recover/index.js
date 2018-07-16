import React from 'react'

import wizardProvider from 'providers/WizardProvider'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class ReminderContainer extends React.PureComponent {
  componentWillMount () {
    this.props.resetStep()
  }

  render () {
    const { step, nextStep, previousStep, ...rest } = this.props

    switch (step) {
      case 1: return <FirstStep onSubmit={nextStep} {...rest} />
      case 2: return <SecondStep previousStep={previousStep} {...rest} />
      default: return <FirstStep onSubmit={nextStep} {...rest} />
    }
  }
}

export default wizardProvider('recover', 2)(ReminderContainer)
