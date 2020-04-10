import { BlockchainLoader, Text } from 'blockchain-info-components'
import { Container } from './template.success'
import { FormattedMessage } from 'react-intl'
import { MenuItem, Wrapper } from 'components/MenuLeft'
import React from 'react'

const Failure = () => {
  return (
    <Container>
      <Wrapper>
        <MenuItem>
          <BlockchainLoader height='30px' width='30px' />
        </MenuItem>
        <Text color='red600' size='14px' weight={600}>
          <FormattedMessage
            id='layouts.wallet.menuleft.failure'
            defaultMessage='Something went wrong. Please refresh.'
          />
        </Text>
      </Wrapper>
    </Container>
  )
}

export default Failure
