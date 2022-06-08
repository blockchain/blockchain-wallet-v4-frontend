import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const Wrapper = styled.div`
  background: ${(props) => props.theme.grey000};
  padding: 16px;
  border-radius: 8px;
`

const PendingTxMessage: React.FC<Props> = () => {
  return (
    <Wrapper>
      <Flex gap={8} flexDirection='column'>
        <Text color='grey900' weight={600}>
          <FormattedMessage
            id='copy.pending_wallet_tx'
            defaultMessage='Pending Wallet Transaction'
          />
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
      </Flex>
    </Wrapper>
  )
}

type Props = {}

export default PendingTxMessage
