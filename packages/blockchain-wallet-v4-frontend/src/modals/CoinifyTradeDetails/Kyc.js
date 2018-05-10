import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { ModalHeader, ModalBody, Text, Button } from 'blockchain-info-components'
import { kycBodyHelper, kycHeaderHelper } from 'services/CoinifyService'
import { spacing } from 'services/StyleService'

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
`

const Kyc = ({ close, status }) => {
  const kycHeader = kycHeaderHelper(status)
  const kycBody = kycBodyHelper(status)

  return (
    <Fragment>
      <ModalHeader onClose={close}>
        <Text>
          <FormattedMessage id='order_details.identity_verification.header' defaultMessage='Buy & Sell Bitcoin' />
        </Text>
      </ModalHeader>
      <ModalBody>
        <Text color={kycHeader.color} style={spacing('mb-10')}>
          { kycHeader.text }
        </Text>
        <Text size='13px' weight={300}>
          { kycBody.text }
        </Text>
        <ButtonRow>
          <Button width='100px' onClick={close} nature='primary'>
            <FormattedMessage id='close' defaultMessage='Close' />
          </Button>
        </ButtonRow>
      </ModalBody>
    </Fragment>
  )
}

export default Kyc
