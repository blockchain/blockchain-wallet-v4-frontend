import React from 'react'
import { compose } from 'redux'

import wizardProvider from 'providers/WizardProvider'
import modalEnhancer from 'providers/ModalEnhancer'
import SendBitcoin from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class SendBitcoinContainer extends React.Component {
  componentWillMount () {
    this.props.resetStep()
  }

  render () {
    const { step } = this.props

    return (
      <SendBitcoin>
        {step === 1 && <FirstStep {...this.props} />}
        {step === 2 && <SecondStep {...this.props} />}
      </SendBitcoin>
    )
  }
}

const enhance = compose(
  modalEnhancer('SendBitcoin'),
  wizardProvider('sendBitcoin', 2)
)

export default enhance(SendBitcoinContainer)
