import { BlockchainLoader, Text } from 'blockchain-info-components'
import { Container } from './template.success'
import { FormattedMessage } from 'react-intl'
import { MenuItem, Wrapper } from 'components/MenuLeft'
import { prop } from 'ramda'
import React from 'react'

const Failure = props => {
  return (
    <Container>
      <Wrapper>
        <MenuItem>
          <BlockchainLoader height='30px' width='30px' />
        </MenuItem>
        <Text color='error'>
          {prop('msg', props) || (
            <FormattedMessage
              id='layouts.wallet.menuleft.failure'
              defaultMessage='Something went wrong. Please refresh'
            />
          )}
        </Text>
      </Wrapper>
    </Container>
  )
}

export default Failure
