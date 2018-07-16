import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { ModalBody, Button } from 'blockchain-info-components'
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
      <ModalBody>
        <BankTransferDetails trade={trade} />
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
