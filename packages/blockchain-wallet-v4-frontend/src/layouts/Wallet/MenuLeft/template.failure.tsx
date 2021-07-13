import React from 'react'
import { FormattedMessage } from 'react-intl'

import { BlockchainLoader, Text } from 'blockchain-info-components'
import { MenuItem, Wrapper } from 'layouts/Wallet/components'

import { Container } from './template.success'

const Failure = () => {
  return (
    <Container>
      <Wrapper>
        <MenuItem>
          <BlockchainLoader height='30px' width='30px' />
        </MenuItem>
        <Text color='red600' size='14px' weight={600}>
          <FormattedMessage
            id='layouts.wallet.menuleft.failure.refresh'
            defaultMessage='Something went wrong. Please refresh.'
          />
        </Text>
      </Wrapper>
    </Container>
  )
}

export default Failure
