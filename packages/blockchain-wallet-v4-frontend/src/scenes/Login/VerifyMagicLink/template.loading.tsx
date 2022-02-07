import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { SpinningLoader, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

const LoadingWrapper = styled(Wrapper)`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Loading = () => {
  return (
    <LoadingWrapper>
      <SpinningLoader width='40px' height='40px' />
      <Text size='16px' weight={400} style={{ marginTop: '24px' }}>
        <FormattedMessage
          id='scenes.login.verify'
          defaultMessage="We're verifying your login attempt. Please wait..."
        />
      </Text>
    </LoadingWrapper>
  )
}

export default Loading
