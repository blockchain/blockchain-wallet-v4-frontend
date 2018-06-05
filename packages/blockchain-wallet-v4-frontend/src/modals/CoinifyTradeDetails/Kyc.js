import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'

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
          <FormattedMessage id='modals.coinifytradedetails.kyc.identityverification.header' defaultMessage='Buy & Sell Bitcoin' />
        </Text>
      </ModalHeader>
      <ModalBody>
        <Text color={kycHeader.color} style={spacing('mb-10')}>
          { prop('text', kycHeader) }
        </Text>
        <Text size='13px' weight={300}>
          { prop('text', kycBody) }
        </Text>
        <ButtonRow>
          <Button width='100px' onClick={close} nature='primary'>
            <FormattedMessage id='modals.coinifytradedetails.kyc.close' defaultMessage='Close' />
          </Button>
        </ButtonRow>
      </ModalBody>
    </Fragment>
  )
}

export default Kyc
