import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Modal, ModalBody, ModalHeader, Text } from 'blockchain-info-components'
import { ModalName } from 'data/types'

import { Props as OwnProps } from '.'

const Body = styled(ModalBody)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`
const Error = (props: Props) => {
  const { btcError, handleSubmit, position, total } = props
  const notEnoughFunds = btcError === 'Not enough funds'

  const okClicked = () => {
    props.modalActions.closeModal(ModalName.RECOMMENDED_IMPORTED_SWEEP)
    props.cacheActions.noActionRequiredSweep({ guid: props.walletGuid, seen: true })
  }

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader closeButton={false}>
        <FormattedMessage id='modals.securitynotice.title' defaultMessage='Security Notice' />
      </ModalHeader>

      <Body>
        <Icon color='error' name='close-circle' size='40px' />
        <Text size='20px' weight={500} color='black'>
          <FormattedMessage id='copy.oops' defaultMessage='Oops. Something went wrong.' />
        </Text>
        {notEnoughFunds ? (
          <Text style={{ margin: '16px 0 16px' }}>
            <FormattedMessage
              id='sweep.failedtransaction.notenoughfunds'
              defaultMessage='One or more of your addresses do not have enough funds for this transaction.'
            />
          </Text>
        ) : (
          <Text style={{ margin: '16px 0 16px' }}>
            <FormattedMessage
              id='sweep.failedtransaction'
              defaultMessage='Your transaction failed to send. Please try again.'
            />
          </Text>
        )}
        {notEnoughFunds ? (
          <Button data-e2e='sweepOk' nature='primary' fullwidth onClick={okClicked}>
            <FormattedMessage id='buttons.ok' defaultMessage='Ok' />
          </Button>
        ) : (
          <Button data-e2e='sweepTryAgain' nature='primary' fullwidth onClick={handleSubmit}>
            <FormattedMessage id='buttons.tryagain' defaultMessage='Try Again' />
          </Button>
        )}
      </Body>
    </Modal>
  )
}

type Props = {
  btcError?: boolean | string
  handleSubmit: () => void
  position: number
  total: number
} & OwnProps

export default Error
