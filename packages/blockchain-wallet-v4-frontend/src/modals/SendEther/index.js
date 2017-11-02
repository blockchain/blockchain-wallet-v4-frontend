import React from 'react'
import { compose } from 'redux'

import wizardProvider from 'providers/WizardProvider'
import modalEnhancer from 'providers/ModalEnhancer'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class SendEtherContainer extends React.Component {
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

const enhance = compose(
  modalEnhancer('SendEther'),
  wizardProvider('sendEther', 2)
)

export default enhance(SendEtherContainer)
