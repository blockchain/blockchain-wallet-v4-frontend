import React from 'react'
import { compose } from 'redux'

import wizardProvider from 'providers/WizardProvider'
import modalEnhancer from 'providers/ModalEnhancer'

import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class RequestBitcoinContainer extends React.Component {
  constructor (props) {
    super(props)
    props.resetStep()
  }

  render () {
    switch (this.props.step) {
      case 1: return <FirstStep {...this.props} />
      case 2: return <SecondStep {...this.props} />
      default: return null
    }
  }
}

const enhance = compose(
  modalEnhancer('RequestBitcoin'),
  wizardProvider('requestBitcoin', 2)
)

export default enhance(RequestBitcoinContainer)
