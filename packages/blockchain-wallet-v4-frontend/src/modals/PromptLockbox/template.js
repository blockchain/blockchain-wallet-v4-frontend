import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { CONFIRM_STEPS } from './model'

import {
  Button,
  Icon,
  Modal,
  ModalHeader,
  ModalBody,
  Text
} from 'blockchain-info-components'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  width: 100%;
`

const PromptLockbox = props => {
  const { position, total, close, ...rest } = props
  const { coin, currentConnection, step } = rest
  const { ready } = currentConnection
  const disabled = !ready || step === CONFIRM_STEPS.review

  return (
    <Modal size='medium' position={position} total={total} closeButton={false}>
      <ModalHeader icon='safe' onClose={close}>
        <FormattedMessage
          id='modals.promptforlockbox.title'
          defaultMessage='Connect {coin} App'
          values={{ coin }}
        />
      </ModalHeader>
      <ModalBody>
        {step === CONFIRM_STEPS.connect ? (
          <Row>
            <Text weight={300}>
              <FormattedHTMLMessage
                id='modals.promptforlockbox.connectcoinapp'
                defaultMessage='Connect and unlock your hardware device. Then open the <b>{coin} app</b> on the device.'
                values={{ coin }}
              />
            </Text>
            {ready ? (
              <Icon
                name='checkmark-in-circle-filled'
                color='brand-secondary'
                size='24px'
              />
            ) : (
              <Icon name='refresh' />
            )}
          </Row>
        ) : (
          <Row>
            <Text weight={300}>
              <FormattedMessage
                id='modals.promptforlockbox.confirmcointx'
                defaultMessage='Review the transaction details on your device screen. Press the top right button to confirm and sign the transaction.'
              />
            </Text>
          </Row>
        )}
        <Button
          fullwidth
          disabled={disabled}
          nature={disabled ? 'gray' : 'success'}
          onClick={() => props.handleStepChange(CONFIRM_STEPS.review)}
        >
          {step === CONFIRM_STEPS.connect ? (
            ready ? (
              <FormattedMessage
                id='modals.promptforlockbox.button.success'
                defaultMessage='Success! Click to Continue'
              />
            ) : (
              <FormattedMessage
                id='modals.promptforlockbox.button.connect'
                defaultMessage='Connect Your Lockbox'
              />
            )
          ) : (
            <FormattedMessage
              id='modals.promptforlockbox.button.review'
              defaultMessage='Confirm Transaction on Device'
            />
          )}
        </Button>
      </ModalBody>
    </Modal>
  )
}

PromptLockbox.propTypes = {
  coin: PropTypes.string
}

export default PromptLockbox
