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

const LoadingWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`

const Loading = () => {
  return (
    <Wrapper>
      <LoadingWrapper>
        <SpinningLoader width='40px' height='40px' />
      </LoadingWrapper>
      <Text style={{ marginTop: '24px' }} size='14px' weight={400}>
        <FormattedMessage
          id='scenes.verifyemailtoken.loading'
          defaultMessage="We're verifying your email address. Please wait..."
        />
      </Text>
    </Wrapper>
  )
}

export default Loading
