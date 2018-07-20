import React from 'react'
import { compose } from 'redux'
import { Tooltip } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

import wizardProvider from 'providers/WizardProvider'
import modalEnhancer from 'providers/ModalEnhancer'
import RequestBitcoin from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class RequestBitcoinContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { receiveAddress: '' }
    this.setReceiveAddress = this.setReceiveAddress.bind(this)
  }

  componentWillMount () {
    this.props.resetStep()
  }

  setReceiveAddress (addr) {
    this.setState({ receiveAddress: addr })
  }

  render () {
    const { receiveAddress } = this.state
    const { step, position, total, closeAll, ...rest } = this.props

    return (
      <RequestBitcoin position={position} total={total} closeAll={closeAll}>
        {step === 1 && (
          <FirstStep setReceiveAddress={this.setReceiveAddress} {...rest} />
        )}
        {step === 2 && <SecondStep receiveAddress={receiveAddress} {...rest} />}
        <Tooltip id='reqBitcoinShare'>
          <FormattedMessage
            id='modals.requestbitcoin.firststep.sharetooltip'
            defaultMessage='Share this address with others, and they can send you BTC directly to your wallet. Your address changes with every payment. You can also create a request by attaching an amount below.'
          />
        </Tooltip>
      </RequestBitcoin>
    )
  }
}

const enhance = compose(
  modalEnhancer('RequestBitcoin'),
  wizardProvider('requestBitcoin', 2)
)

export default enhance(RequestBitcoinContainer)
