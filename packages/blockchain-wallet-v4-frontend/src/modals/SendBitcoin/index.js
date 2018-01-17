import React from 'react'
import PropTypes from 'prop-types'
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
    const { step, position, total, closeAll, ...rest } = this.props

    return (
      <SendBitcoin position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep {...rest} />}
        {step === 2 && <SecondStep {...rest} />}
      </SendBitcoin>
    )
  }
}

SendBitcoinContainer.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const enhance = compose(
  modalEnhancer('SendBitcoin'),
  wizardProvider('sendBitcoin', 2)
)

export default enhance(SendBitcoinContainer)
