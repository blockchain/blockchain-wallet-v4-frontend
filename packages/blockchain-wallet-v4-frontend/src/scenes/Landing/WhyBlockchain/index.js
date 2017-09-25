import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Carousel, Image, Text, TextGroup } from 'blockchain-info-components'
import Container from 'components/Container'

const Wrapper = styled.div`
  padding: 70px 0;
  background-color: ${props => props.theme['white']};
`
const Content = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`
const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 150px;
  padding: 0 50px;
  text-align: justify;

  & > * { margin-bottom: 10px; }
`

const WhyBlockchain = (props) => {
  return (
    <Wrapper>
      <Content>
        <Text size='36px' weight={300} uppercase>
          <FormattedMessage id='scenes.landing.wallet.why' defaultMessage='Why blockchain?' />
        </Text>
        <TextGroup inline>
          <Text size='16px' weight={300}>
            <FormattedMessage id='scenes.landing.wallet.loved' defaultMessage='Loved by Users.' />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage id='scenes.landing.wallet.praised' defaultMessage='Praised by Geeks.' />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage id='scenes.landing.wallet.recognized' defaultMessage='Recognized by the Press.' />
          </Text>
        </TextGroup>
      </Content>
      <Carousel height={150} auto>
        <Block>
          <Image name='sophisticated' height='50px' />
          <Text size='18px' weight={300} uppercase>
            <FormattedMessage id='scenes.landing.wallet.simple' defaultMessage='Simple' />
          </Text>
          <Text size='14px' weight={200}>
            <FormattedMessage id='scenes.landing.wallet.simple_explain' defaultMessage='We make using bitcoin safe, simple, and fun. Securely store your bitcoin and instantly transact with anyone in the world' />
          </Text>
        </Block>
        <Block>
          <Image name='sophisticated' height='50px' />
          <Text size='18px' weight={300} uppercase>
            <FormattedMessage id='scenes.landing.wallet.safe' defaultMessage='Safe & Secure' />
          </Text>
          <Text size='14px' weight={200}>
            <FormattedMessage id='scenes.landing.wallet.safe_explain' defaultMessage='Our step-by-step Security Center helps you backup your funds, and protect them from unauthorized access.' />
          </Text>
        </Block>
        <Block>
          <Image name='sophisticated' height='50px' />
          <Text size='18px' weight={300} uppercase>
            <FormattedMessage id='scenes.landing.wallet.buy' defaultMessage='Buy & Sell' />
          </Text>
          <Text size='14px' weight={200}>
            <FormattedMessage id='scenes.landing.wallet.buy_explain' defaultMessage='Blockchain works with exchange partners all around the world to make buying bitcoin in your wallet both a seamless and secure experience.' />
          </Text>
        </Block>
        <Block>
          <Image name='sophisticated' height='50px' />
          <Text size='18px' weight={300} uppercase>
            <FormattedMessage id='scenes.landing.wallet.sophisticated' defaultMessage='Sophisticated' />
          </Text>
          <Text size='14px' weight={200}>
            <FormattedMessage id='scenes.landing.wallet.sophisticated_explain' defaultMessage='Hierarchical deterministic addresses. Dynamic transaction fees. Monitoring and spending from Watch Only addresses.' />
          </Text>
        </Block>
        <Block>
          <Image name='sophisticated' height='50px' />
          <Text size='18px' weight={300} uppercase>
            <FormattedMessage id='scenes.landing.wallet.global' defaultMessage='Global' />
          </Text>
          <Text size='14px' weight={200}>
            <FormattedMessage id='scenes.landing.wallet.global_explain' defaultMessage='140+ countries served. 20+ currency conversion rates, including JPY, RUB, SGD, USD, CNY, EUR, GBP, and many more. 25+ languages.' />
          </Text>
        </Block>
        <Block>
          <Image name='sophisticated' height='50px' />
          <Text size='18px' weight={300} uppercase>
            <FormattedMessage id='scenes.landing.wallet.supported' defaultMessage='Always supported' />
          </Text>
          <Text size='14px' weight={200}>
            <FormattedMessage id='scenes.landing.wallet.supported_explain' defaultMessage='Should you need help or have a question, our best in class support team will always be there for you.' />
          </Text>
        </Block>
      </Carousel>
    </Wrapper>
  )
}

export default WhyBlockchain
