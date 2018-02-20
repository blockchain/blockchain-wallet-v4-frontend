import React from 'react'
import { compose } from 'redux'

import wizardProvider from 'providers/WizardProvider'
import modalEnhancer from 'providers/ModalEnhancer'
import RequestBtc from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class RequestBtcContainer extends React.Component {
  componentWillMount () {
    this.props.resetStep()
  }

  render () {
    const { step, position, total, closeAll, ...rest } = this.props

    return (
      <RequestBtc position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep {...rest} />}
        {step === 2 && <SecondStep {...rest} />}
      </RequestBtc>
    )
  }
}

const enhance = compose(
  modalEnhancer('RequestBtc'),
  wizardProvider('requestBtc', 2)
)

export default enhance(RequestBtcContainer)
