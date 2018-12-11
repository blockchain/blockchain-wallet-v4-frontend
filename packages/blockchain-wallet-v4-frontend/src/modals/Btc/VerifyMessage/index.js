// Verify the signature of a message signed with a Bitcoin address.

import {
  Banner,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TooltipIcon,
  TooltipHost
} from 'blockchain-info-components'

import { FormItem, FormLabel, TextArea, TextBox } from 'components/Form'
import * as core from './core'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { validBitcoinAddress } from 'services/FormHelper'

const getItem = (label, input) => (
  <FormItem style={{ marginBottom: `15px` }}>
    <FormLabel>
      <div style={{ marginBottom: `5px` }}>{label}</div>
      {input}
    </FormLabel>
  </FormItem>
)

const ItemAddress = ({ address, network, onChange }) =>
  getItem(
    <FormattedMessage
      id='modals.verifyMessage.address'
      defaultMessage='Bitcoin Address:'
    />,
    <TextBox
      input={{
        onChange,
        name: 'address'
      }}
      meta={{
        error: validBitcoinAddress(address, null, { network }),
        touched: address !== ``
      }}
    />
  )

const ItemMessage = ({ onChange }) =>
  getItem(
    <FormattedMessage
      id='modals.verifyMessage.message'
      defaultMessage='Message:'
    />,
    <TextArea
      input={{
        name: 'message',
        onChange
      }}
      meta={{}}
    />
  )

const ItemSignature = ({ onChange }) =>
  getItem(
    <FormattedMessage
      id='modals.verifyMessage.signature'
      defaultMessage='Signature:'
    />,
    <TextArea
      input={{
        name: 'signature',
        onChange
      }}
      meta={{}}
    />
  )

class VerifyMessage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { address: ``, message: ``, signature: `` }
  }

  render () {
    const { close, network } = this.props

    const onChange = ({ target: { name, value } }) => {
      this.setState({ [name]: value })
    }

    return (
      <Modal>
        <ModalHeader onClose={close}>
          <FormattedMessage
            id='modals.verifyMessage.title'
            defaultMessage='Verify Message'
          />
          <TooltipHost id='verifyMessage'>
            <TooltipIcon name='question-in-circle' />
          </TooltipHost>
        </ModalHeader>
        <ModalBody>
          <ItemAddress
            address={this.state.address}
            network={network}
            onChange={onChange}
          />
          <ItemMessage onChange={onChange} />
          <ItemSignature onChange={onChange} />
          <div
            style={{
              visibility: core.showResult(this.state) ? `visible` : `hidden`
            }}
          >
            {core.verifySignature(this.state) ? (
              <Banner type='success'>
                <FormattedMessage
                  id='modals.verifyMessage.success'
                  defaultMessage='The message has a valid signature from the address.'
                />
              </Banner>
            ) : (
              <Banner type='caution'>
                <FormattedMessage
                  id='modals.verifyMessage.failure'
                  defaultMessage='The signature does not match the message.'
                />
              </Banner>
            )}
          </div>
        </ModalBody>
        <ModalFooter align='right'>
          <Button onClick={close} nature='primary'>
            <FormattedMessage id='close' defaultMessage='Close' />
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default modalEnhancer('VerifyMessage')(VerifyMessage)
