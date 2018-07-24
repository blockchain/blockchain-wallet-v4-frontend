import React from 'react'

import wizardProvider from 'providers/WizardProvider'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
import FourthStep from './FourthStep'

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
      case 4: return <FourthStep {...rest} />
      default: return <FirstStep {...rest} />
    }
  }
}

export default wizardProvider('reset2FA', 4)(Reset2FAContainer)
