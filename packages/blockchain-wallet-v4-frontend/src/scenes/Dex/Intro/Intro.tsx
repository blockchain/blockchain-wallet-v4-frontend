import React, { useState } from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconArrowLeft, IconArrowRight } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'

import { DEX_INTRO_VIEWED_KEY } from '../Dex.model'
import Swap from '../Swap'

const StepBubble = styled.div<{ active?: boolean }>`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? props.theme.blue600 : props.theme.grey100)};
  margin: 0 5px;
  cursor: pointer;
`
const StepBubblesWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
const IntroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4px 64px 0;
  text-align: center;
`
const IntroStepWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0;
`

// TODO: translations once copy is finalized
// TODO: create stepper and step templates once designs finalized
const DexIntro = () => {
  const [wasIntroViewed, setIntroViewed] = useState(false)

  return wasIntroViewed ? (
    <Swap />
  ) : (
    <>
      <Image width='100%' height='100px' name='nft-img-placeholder' />
      <IntroWrapper>
        <Text
          color='textBlack'
          lineHeight='32px'
          size='24px'
          weight={600}
          style={{ margin: '20px 0 8px' }}
        >
          Welcome to the DEX
        </Text>
        <Text color='grey600' lineHeight='24px' size='16px' weight={500}>
          A Decentralized Exchange (DEX) is a way to swap and exchange cryptocurrencies on-chain.
        </Text>
      </IntroWrapper>
      <IntroStepWrapper>
        <Icon label='step back' color='blue600' size='md'>
          <IconArrowLeft />
        </Icon>
        <StepBubblesWrapper>
          <StepBubble active />
          <StepBubble />
          <StepBubble />
        </StepBubblesWrapper>
        <Icon label='step forward' color='blue600' size='md'>
          <IconArrowRight />
        </Icon>
      </IntroStepWrapper>
      <Button
        data-e2e='startTrading'
        fullwidth
        jumbo
        nature='primary'
        onClick={() => {
          localStorage.setItem(DEX_INTRO_VIEWED_KEY, 'true')
          setIntroViewed(true)
        }}
      >
        Start Trading
      </Button>
    </>
  )
}

export default DexIntro
