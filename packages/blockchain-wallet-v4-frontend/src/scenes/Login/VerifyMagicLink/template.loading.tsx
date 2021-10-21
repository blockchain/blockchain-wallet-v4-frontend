import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { SpinningLoader, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Loading = () => {
  return (
    <Wrapper>
      <SpinningLoader width='40px' height='40px' />

      <Text size='16px' weight={400} style={{ marginTop: '24px' }}>
        <FormattedMessage
          id='scenes.login.verify'
          defaultMessage="We're verifying your login attempt. Please wait..."
        />
      </Text>
    </Wrapper>
  )
}

export default Loading
