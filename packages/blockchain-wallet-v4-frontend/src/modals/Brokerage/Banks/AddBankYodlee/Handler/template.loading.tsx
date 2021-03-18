import React from 'react'
import styled from 'styled-components'

import { Image, SpinningLoader, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

const Wrapper = styled(FlyoutWrapper)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  text-align: center;
`

const SpinnerContainer = styled.div`
  transform: translate(47px, 35px);
  border: 5px solid white;
  border-radius: 50%;
  background-color: white;
`

const HeadingText = styled(Text)`
  font-weight: 600;
  font-size: 20px;
  margin-top: 22px;
`
const BodyText = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  margin: 5px 30px;
`

const Loading: React.FC<Props> = () => {
  return (
    <Wrapper>
      <SpinnerContainer>
        <SpinningLoader borderWidth='7px' height='32px' width='32px' />
      </SpinnerContainer>
      <Image name='blockchain-logo-circle' width='106px' />
      <HeadingText color='grey900'>Updating Your Wallet...</HeadingText>
      <BodyText color='grey600'>
        This could take up to 30 secconds. Please do not go back or close the
        app.
      </BodyText>
    </Wrapper>
  )
}

type Props = { order?: boolean; polling?: boolean }

export default Loading
