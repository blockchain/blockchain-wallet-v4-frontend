import React from 'react'
import { compose } from 'redux'

import wizardProvider from 'providers/WizardProvider'
import modalEnhancer from 'providers/ModalEnhancer'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class SendBitcoinContainer extends React.Component {
  constructor (props) {
    super(props)
    props.resetStep()
  }

  render () {
    switch (this.props.step) {
      case 1: return <FirstStep {...this.props} />
      case 2: return <SecondStep {...this.props} />
      default: return <div />
    }
  }
}

const enhance = compose(
  modalEnhancer('SendBitcoin'),
  wizardProvider('sendBitcoin', 2)
)

export default enhance(SendBitcoinContainer)
