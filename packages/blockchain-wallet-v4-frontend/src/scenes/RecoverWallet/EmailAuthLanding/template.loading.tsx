import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { SpinningLoader, Text } from 'blockchain-info-components'

const LoadingWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`

const Loading = () => {
  return (
    <Flex alignItems='center' flexDirection='column'>
      <LoadingWrapper>
        <SpinningLoader width='40px' height='40px' />
      </LoadingWrapper>
      <Text style={{ marginTop: '24px' }} size='14px' weight={400}>
        <FormattedMessage
          id='scenes.verifyaccountrecovery.loading'
          defaultMessage="We're approving your request. Please wait..."
        />
      </Text>
    </Flex>
  )
}

export default Loading
