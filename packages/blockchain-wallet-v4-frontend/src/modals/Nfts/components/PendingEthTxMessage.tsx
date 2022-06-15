import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Button, Text } from 'blockchain-info-components'

import GreyMessage from './GreyMessage'

const PendingEthTxMessage: React.FC<Props> = () => {
  return (
    <GreyMessage>
      <Text color='grey900' weight={600}>
        <FormattedMessage id='copy.pending_wallet_tx' defaultMessage='Pending Wallet Transaction' />
      </Text>
      <Text size='12px'>
        <FormattedMessage
          id='copy.pending_tx_wait'
          defaultMessage='You have a pending transaction on your Ethereum Wallet. Once settled, you will be able to transact again.'
        />
      </Text>
      <LinkContainer to='/coins/ETH'>
        <a>
          <Button rounded fullwidth={false} data-e2e='viewEthActivity' small nature='dark-grey'>
            <FormattedMessage id='copy.view_my_activity' defaultMessage='View My Activity' />
          </Button>
        </a>
      </LinkContainer>
    </GreyMessage>
  )
}

type Props = {}

export default PendingEthTxMessage
