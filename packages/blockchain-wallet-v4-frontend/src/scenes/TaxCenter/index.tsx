import React from 'react'
import styled from 'styled-components'

import { Carousel, Link, Text, TextGroup } from 'blockchain-info-components'
import { SceneWrapper, StickyHeader } from 'components/Layout'
import MenuHeader from 'components/MenuHeader'

const NumberText = styled(Text)`
  width: 32px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  background-color: #ecf5fe;
  border-radius: 16px;
`

const Subtitle = styled(Text)`
  margin-bottom: 8px;
`
const Slide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Box = styled.div`
  position: relative;
  margin-top: 64px;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.grey000};
  display: flex;
  flex: 1;
`

const TaxCenterContainer = () => (
  <SceneWrapper>
    <StickyHeader>
      <MenuHeader>
        <Subtitle size='40px' weight={600} color='black'>
          Blockchain.com Tax Center
        </Subtitle>
        <Text size='14px' weight={500} color='grey700'>
          Here’s everything you’ll need from Blockchain.com to file your taxes this year.
        </Text>
      </MenuHeader>
    </StickyHeader>
    <Box>
      <Carousel height={90} arrows={false} chips={false}>
        <Slide>
          <Subtitle weight={600} size='20px' color='black'>
            Do I owe taxes on my crypto?
          </Subtitle>
          <Text size='14px' weight={500} color='black'>
            {`If you sold or converted your crypto last year, the transactions are likely subject to U.S. capital
            gains taxes.`}
          </Text>
        </Slide>
        <Slide>
          <Subtitle weight={600} size='20px' color='black'>
            How do I file?
          </Subtitle>
          <Text size='14px' weight={500} color='black'>
            {`Export your transaction history then manually calculate your gains/losses using your cost
            basis. If you want to simplify the process, use our crypto tax partner CoinTracker to get free
            tax reports for up to 1,000 transactions.`}
          </Text>
        </Slide>
        <Slide>
          <Subtitle weight={600} size='20px' color='black'>
            What if I use other crypto services?
          </Subtitle>
          <TextGroup inline>
            <Text size='14px' weight={500} color='black'>
              {`This file only contains your Blockchain.com Wallet activity. If you use other crypto services,
                those transactions will not appear here. If you use the Blockchain.com Exchange, you can
                connect your account to CoinTracker via API.`}
            </Text>
            <Text>
              <Link
                href='https://support.blockchain.com/hc/en-us/sections/360004368351-USD-Pax-FAQ'
                target='_blank'
                weight={500}
                size='14px'
              >
                Learn more
              </Link>
            </Text>
          </TextGroup>
        </Slide>
      </Carousel>
    </Box>
    <Box>
      <NumberText weight={600} color='blue600'>
        1
      </NumberText>
      <Text size='20px' weight={600} color='black'>
        Export your transaction history
      </Text>
      <Text size='12px' weight={500} color='grey700'>
        {`Get the full transaction history from your Wallet's Trading,
        Rewards, and Private Key accounts.`}
      </Text>
    </Box>
  </SceneWrapper>
)

export default TaxCenterContainer
