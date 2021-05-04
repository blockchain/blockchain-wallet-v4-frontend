// Verify the signature of a message signed with a Bitcoin address.

import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Banner,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { FormItem, FormLabel, TextArea, TextBox } from 'components/Form'
import modalEnhancer from 'providers/ModalEnhancer'
import { validBtcAddress } from 'services/forms'

import * as services from './services'

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
          error: validBtcAddress(address, null, { network }),
          touched: address !== ``
        }}
        data-e2e='bitcoinAddressInput'
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
        data-e2e='messageInput'
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
        data-e2e='signatureInput'
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

  render() {
    const { closeAll, network } = this.props

    return (
      <Modal>
        <ModalHeader onClose={closeAll}>
          <FormattedMessage
            id='modals.verifyMessage.title'
            defaultMessage='Verify Message'
          />
          <TooltipHost id='verifyMessage'>
            <TooltipIcon name='info' />
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
              <Banner type='success' data-e2e='validSignatureBadge'>
                <FormattedMessage
                  id='modals.verifyMessage.success'
                  defaultMessage='The message has a valid signature from the address.'
                />
              </Banner>
            ) : (
              <Banner type='caution' data-e2e='incorrectSignatureBadge'>
                <FormattedMessage
                  id='modals.verifyMessage.failure'
                  defaultMessage='The signature does not match the message.'
                />
              </Banner>
            )}
          </Result>
        </ModalBody>
        <ModalFooter align='right'>
          <Button
            onClick={close}
            nature='primary'
            data-e2e='closeVerifyMessageButton'
          >
            <FormattedMessage id='buttons.close' defaultMessage='Close' />
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default modalEnhancer('VERIFY_MESSAGE_AIRDROP')(VerifyMessage)
