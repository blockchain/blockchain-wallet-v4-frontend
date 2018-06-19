import React from 'react'

import wizardProvider from 'providers/WizardProvider'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'

class Reset2FAContainer extends React.PureComponent {
  componentWillMount () {
    this.props.resetStep()
  }

  render () {
    const { step, ...rest } = this.props

    switch (step) {
      case 1: return <FirstStep {...rest} />
      case 2: return <SecondStep {...rest} />
      case 3: return <ThirdStep {...rest} />
      default: return <FirstStep {...rest} />
    }
  }
}

export default wizardProvider('reset2FA', 3)(Reset2FAContainer)
