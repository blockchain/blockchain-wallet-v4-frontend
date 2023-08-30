import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Modal, ModalBody, ModalHeader, Text } from 'blockchain-info-components'

const Body = styled(ModalBody)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`
const Error = (props: Props) => {
  const { handleSubmit, position, total } = props

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
        <Text style={{ margin: '16px 0 16px' }}>
          <FormattedMessage
            id='sweep.failedtransaction'
            defaultMessage='Your transaction failed to send. Please try again.'
          />
        </Text>
        <Button data-e2e='sweepTryAgain' nature='primary' fullwidth onClick={handleSubmit}>
          <FormattedMessage id='buttons.tryagain' defaultMessage='Try Again' />
        </Button>
      </Body>
    </Modal>
  )
}

type Props = {
  handleSubmit: () => void
  position: number
  total: number
}

export default Error
