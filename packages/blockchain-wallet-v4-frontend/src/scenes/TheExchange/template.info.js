import { CustomBox } from 'components/Layout'
import { FormattedMessage } from 'react-intl'
import EmptySceneCarousel from 'components/EmptySceneCarousel'
import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const Slide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  & > :first-child {
    margin-bottom: 20px;
  }
`

const ExchangeInfo = () => {
  return (
    <CustomBox>
      <EmptySceneCarousel height={250}>
        <Slide>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='scenes.exchange.empty.carousel.access'
              defaultMessage='Access More Assets'
            />
          </Text>
          <Text size='14px' weight={500} color='grey600'>
            <FormattedMessage
              id='scenes.exchange.empty.carousel.accessbody'
              defaultMessage='Expand your crypto portfolio. Easily deposit and withdraw dollars, euros and trade today’s top crypto currencies. Gain access to exclusive and emerging digital assets.'
            />
          </Text>
        </Slide>
        <Slide>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='scenes.exchange.empty.carousel.unlock'
              defaultMessage='Unlock Unlimited Trading'
            />
          </Text>
          <Text size='14px' weight={500} color='grey600'>
            <FormattedMessage
              id='scenes.exchange.empty.carousel.unlockbody'
              defaultMessage='Already Verified? Share your Gold or Silver status to begin trading on the Exchange immediately.'
            />
          </Text>
        </Slide>
        <Slide>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='scenes.exchange.empty.carousel.seamless'
              defaultMessage='Seamlessly Transfer Crypto'
            />
          </Text>
          <Text size='14px' weight={500} color='grey600'>
            <FormattedMessage
              id='scenes.exchange.empty.carousel.seamlessbody'
              defaultMessage="Link your Wallet to the Exchange to easily sweep crypto back and forth. No copy pasting or typos. It's the most secure way to trade while keeping your keys."
            />
          </Text>
        </Slide>
      </EmptySceneCarousel>
    </CustomBox>
  )
}

export default ExchangeInfo
