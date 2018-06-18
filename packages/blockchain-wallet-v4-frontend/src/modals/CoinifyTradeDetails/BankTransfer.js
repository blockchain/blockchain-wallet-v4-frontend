import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { ModalBody, ModalHeader, Button, Text } from 'blockchain-info-components'
import BankTransferDetails from 'components/BuySell/BankTransferDetails'

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
`

const BankTransfer = ({ trade, close }) => {
  return (
    <Fragment>
      <ModalHeader onClose={close}>
        <Text color={'transferred'}>
          <FormattedMessage id='modals.coinifytradedetails.banktransfer.header' defaultMessage='Buy Trade Awaiting Funds' />
        </Text>
      </ModalHeader>
      <ModalBody>
        <BankTransferDetails trade={trade} inModal />
        <ButtonRow>
          <Button width='100px' onClick={close} nature='primary'>
            <FormattedMessage id='close' defaultMessage='Close' />
          </Button>
        </ButtonRow>
      </ModalBody>
    </Fragment>
  )
}

export default BankTransfer
