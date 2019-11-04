import {
  Button,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import BankTransferDetails from 'components/BuySell/BankTransferDetails'
import React, { Fragment } from 'react'
import styled from 'styled-components'

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
          <FormattedMessage
            id='modals.coinifytradedetails.banktransfer.header'
            defaultMessage='Buy Trade Awaiting Funds'
          />
        </Text>
      </ModalHeader>
      <ModalBody>
        <BankTransferDetails trade={trade} inModal />
        <ButtonRow>
          <Button width='100px' onClick={close} nature='primary'>
            <FormattedMessage
              id='modals.coinifytradedetails.banktransfer.close'
              defaultMessage='Close'
            />
          </Button>
        </ButtonRow>
      </ModalBody>
    </Fragment>
  )
}

export default BankTransfer
