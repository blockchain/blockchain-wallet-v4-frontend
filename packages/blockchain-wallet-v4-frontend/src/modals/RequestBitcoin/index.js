import React from 'react'
import { compose } from 'redux'

import wizardProvider from 'providers/WizardProvider'
import modalEnhancer from 'providers/ModalEnhancer'
import RequestBitcoin from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class RequestBitcoinContainer extends React.PureComponent {
  componentWillMount () {
    this.props.resetStep()
  }

  render () {
    const { step, position, total, closeAll, ...rest } = this.props

    return (
      <RequestBitcoin position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep {...rest} />}
        {step === 2 && <SecondStep {...rest} />}
      </RequestBitcoin>
    )
  }
}

const enhance = compose(
  modalEnhancer('RequestBitcoin'),
  wizardProvider('requestBitcoin', 2)
)

export default enhance(RequestBitcoinContainer)
