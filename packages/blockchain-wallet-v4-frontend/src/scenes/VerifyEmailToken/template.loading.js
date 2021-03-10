import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { css, keyframes } from 'styled-components'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const rotateFrames = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`
const rotateAnimation = css`
  animation: ${rotateFrames} 1s infinite linear;
`
const LoadingWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`
const LoadingIcon = styled.div`
  height: 60px;
  width: 60px;
  border-top: 3px solid rgba(0, 0, 0, 0.5);
  border-right: 3px solid transparent;
  border-radius: 50%;
  ${rotateAnimation};
`

const Loading = () => {
  return (
    <Wrapper>
      <LoadingWrapper>
        <LoadingIcon />
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
