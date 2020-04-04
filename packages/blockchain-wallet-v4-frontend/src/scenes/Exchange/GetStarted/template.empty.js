import { Box } from 'components/Box'
import { FormattedMessage } from 'react-intl'
import { Image, Text } from 'blockchain-info-components'
import EmptySceneCarousel from 'components/EmptySceneCarousel'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const Slide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  & > :first-child {
    margin-bottom: 10px;
  }
  & > :last-child {
    align-self: flex-end;
    justify-self: flex-end;
  }
`
const EmptySwapCarousel = () => {
  return (
    <Wrapper>
      <Box>
        <EmptySceneCarousel height={230}>
          <Slide>
            <Text size='20px' weight={600} color='grey800'>
              <FormattedMessage
                id='swap.carousel.title.page2'
                defaultMessage='Real-time Exchange Rates'
              />
            </Text>
            <Text size='14px' weight={500} color='grey600' lineHeight='20px'>
              <FormattedMessage
                id='swap.carousel.desc.page2'
                defaultMessage='Access competitive crypto prices right at your fingertips.'
              />
            </Text>
            <Image name='swap-carousel2' width='170px' />
          </Slide>
          <Slide>
            <Text size='20px' weight={600} color='grey800'>
              <FormattedMessage
                id='swap.carousel.title.page3'
                defaultMessage='100% On-Chain'
              />
            </Text>
            <Text size='14px' weight={500} color='grey600' lineHeight='20px'>
              <FormattedMessage
                id='swap.carousel.desc.page3'
                defaultMessage='All Swap trades are confirmed and settled directly on-chain.'
              />
            </Text>
            <Image name='swap-carousel3' width='170px' />
          </Slide>
          <Slide>
            <Text size='20px' weight={600} color='grey800'>
              <FormattedMessage
                id='swap.carousel.title.page4'
                defaultMessage='You Control Your Key'
              />
            </Text>
            <Text size='14px' weight={500} color='grey600' lineHeight='20px'>
              <FormattedMessage
                id='swap.carousel.desc.page4'
                defaultMessage='With Swap your crypto is safe, secure, and your keys are always intact.'
              />
            </Text>
            <Image name='swap-carousel4' width='170px' />
          </Slide>
          <Slide>
            <Text size='20px' weight={600} color='grey800'>
              <FormattedMessage
                id='swap.carousel.title.page5'
                defaultMessage='Manage Risk Better'
              />
            </Text>
            <Text size='14px' weight={500} color='grey600' lineHeight='20px'>
              <FormattedMessage
                id='swap.carousel.desc.page5-1'
                defaultMessage='Introducing Digital Dollars (USD Digital) to de-risk your crypto investment or lock-in gains.'
              />
            </Text>
            <Image name='swap-carousel5' width='170px' />
          </Slide>
        </EmptySceneCarousel>
      </Box>
      <Box />
    </Wrapper>
  )
}

export default EmptySwapCarousel
