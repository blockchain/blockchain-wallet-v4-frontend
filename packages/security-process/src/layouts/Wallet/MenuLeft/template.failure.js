import React from 'react'
import { prop } from 'ramda'
import { Container } from './template.success'
import { FormattedMessage } from 'react-intl'
import { Wrapper, MenuItem } from 'components/MenuLeft'
import { BlockchainLoader, Text } from 'blockchain-info-components'

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
