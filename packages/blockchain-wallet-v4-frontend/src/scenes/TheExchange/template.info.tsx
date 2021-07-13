import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Carousel, Text } from 'blockchain-info-components'
import { CustomBox } from 'components/Layout'

const Slide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 220px;
`

const ExchangeInfo = () => {
  return (
    <CustomBox>
      <Carousel height={220} arrows={false} chips={false}>
        <Slide>
          <Text size='20px' weight={600} color='grey800' style={{ marginBottom: '20px' }}>
            <FormattedMessage
              id='scenes.exchange.empty.carousel.access'
              defaultMessage='Access More Assets'
            />
          </Text>
          <Text size='14px' weight={500} color='grey600' lineHeight='20px'>
            <FormattedMessage
              id='scenes.exchange.empty.carousel.accessbody'
              defaultMessage='Expand your crypto portfolio. Easily deposit and withdraw dollars, euros and trade today’s top crypto currencies. Gain access to exclusive and emerging digital assets.'
            />
          </Text>
        </Slide>
        <Slide>
          <Text size='20px' weight={600} color='grey800' style={{ marginBottom: '20px' }}>
            <FormattedMessage
              id='scenes.exchange.empty.carousel.unlock'
              defaultMessage='Unlock Unlimited Trading'
            />
          </Text>
          <Text size='14px' weight={500} color='grey600' lineHeight='20px'>
            <FormattedMessage
              id='scenes.exchange.empty.carousel.unlockbody'
              defaultMessage='Already Verified? Share your Gold or Silver status to begin trading on the Exchange immediately.'
            />
          </Text>
        </Slide>
        <Slide>
          <Text size='20px' weight={600} color='grey800' style={{ marginBottom: '20px' }}>
            <FormattedMessage
              id='scenes.exchange.empty.carousel.seamless'
              defaultMessage='Seamlessly Transfer Crypto'
            />
          </Text>
          <Text size='14px' weight={500} color='grey600' lineHeight='20px'>
            <FormattedMessage
              id='scenes.exchange.empty.carousel.seamlessbody'
              defaultMessage="Link your Wallet to the Exchange to easily sweep crypto back and forth. No copy pasting or typos. It's the most secure way to trade while keeping your keys."
            />
          </Text>
        </Slide>
      </Carousel>
    </CustomBox>
  )
}

export default ExchangeInfo
