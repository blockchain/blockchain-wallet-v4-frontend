import React, { useState } from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconDeposit, IconSettings } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const PageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const ContentWrapper = styled.div`
  box-sizing: border-box;
  width: 550px;
  margin-top: 72px;
  background-color: ${(props) => props.theme.white};
  padding: 24px;
  border-radius: 24px;
  border: 1px solid ${(props) => props.theme.grey100};
  text-align: center;

  ${media.tablet`
    width: 100%;
  `}
  ${media.mobile`
    padding: 20px;
  `}
`
const SwapWrapper = styled.div`
  position: relative;
  > :nth-child(3) {
    margin-top: 8px;
  }
`
const PairWrapper = styled.div`
  height: 40px;
  background-color: ${(props) => props.theme.grey000};
  border-radius: 16px;
  padding: 8px 16px;
`
const PairTransition = styled.div`
  position: absolute;
  top: calc(50% - 16px);
  right: calc(50% - 16px);
  height: 32px;
  width: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.white};

  > :nth-child(1) {
    position: relative;
    top: 8px;
    z-index: 99 !important;
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 6px;
    right: 6px;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.grey000};
  }
`

const Dex = () => {
  const [step, setStep] = useState(0)
  return (
    <PageWrapper>
      {step === 0 && (
        <ContentWrapper>
          <Image width='100%' height='100px' name='nft-img-placeholder' />
          <Text
            color='textBlack'
            lineHeight='135%'
            size='24px'
            weight={600}
            style={{ margin: '20px 0 8px' }}
          >
            All On-Chain
          </Text>
          <Text color='grey600' lineHeight='150%' size='16px' weight={500}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tellus tortor, feugiat fusce
            facilisis. Cursus in turpis neque et.
          </Text>
          <Button
            data-e2e='startTrading'
            fullwidth
            jumbo
            nature='primary'
            onClick={() => setStep(1)}
            style={{ marginTop: '20px' }}
          >
            Start Trading
          </Button>
        </ContentWrapper>
      )}
      {step === 1 && (
        <ContentWrapper>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <Text color='textBlack' lineHeight='135%' size='24px' weight={600}>
                Swap
              </Text>
            </div>
            <div style={{ alignItems: 'center', cursor: 'pointer', display: 'flex' }}>
              <Icon label='settings' color='grey400' size='md'>
                <IconSettings />
              </Icon>
            </div>
          </div>
          <SwapWrapper>
            <PairWrapper />
            <PairTransition>
              <Icon label='arrow down' color='grey400' size='sm'>
                <IconDeposit />
              </Icon>
            </PairTransition>
            <PairWrapper />
          </SwapWrapper>
          <Button
            data-e2e='swap'
            fullwidth
            jumbo
            nature='primary'
            onClick={() => setStep(0)}
            style={{ marginTop: '20px' }}
          >
            Swap
          </Button>
        </ContentWrapper>
      )}
    </PageWrapper>
  )
}

export default Dex
