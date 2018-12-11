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
import * as services from './services'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { validBitcoinAddress } from 'services/FormHelper'
import styled from 'styled-components'

const Item = styled(FormItem)`
  margin-bottom: 15px;
`

// For some reason we couldn't style FormattedMessage directly.
const LabelMessage = styled.div`
  margin-bottom: 5px;
`

const ItemAddress = ({ address, network, onChange }) => (
  <Item>
    <FormLabel>
      <LabelMessage>
        <FormattedMessage
          id='modals.verifyMessage.address'
          defaultMessage='Bitcoin Address:'
        />
      </LabelMessage>
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
    </FormLabel>
  </Item>
)

const ItemMessage = ({ onChange }) => (
  <Item>
    <FormLabel>
      <LabelMessage>
        <FormattedMessage
          id='modals.verifyMessage.message'
          defaultMessage='Message:'
        />
      </LabelMessage>
      <TextArea
        input={{
          name: 'message',
          onChange
        }}
        meta={{}}
      />
    </FormLabel>
  </Item>
)

const ItemSignature = ({ onChange }) => (
  <Item>
    <FormLabel>
      <LabelMessage>
        <FormattedMessage
          id='modals.verifyMessage.signature'
          defaultMessage='Signature:'
        />
      </LabelMessage>
      <TextArea
        input={{
          name: 'signature',
          onChange
        }}
        meta={{}}
      />
    </FormLabel>
  </Item>
)

const Result = styled.div`
  display: flex;
  justify-content: center;
  visibility: ${({ visible }) => (visible ? `visible` : `hidden`)};
`

class VerifyMessage extends React.PureComponent {
  state = { address: ``, message: ``, signature: `` }

  onChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value })
  }

  render () {
    const { close, network } = this.props

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
            onChange={this.onChange}
          />
          <ItemMessage onChange={this.onChange} />
          <ItemSignature onChange={this.onChange} />
          <Result visible={services.showResult(this.state)}>
            {services.verifySignature(this.state) ? (
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
          </Result>
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
