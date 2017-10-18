import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;

  @media(min-width: 768px) { flex-direction: row; }
`
const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  min-height: 150px;
  padding: 0 50px;
  text-align: justify;

  & > * { margin-bottom: 10px; }
`

const Page1 = () => (
  <Page>
    <Block>
      <Icon name='wallet' size='50px' />
      <Text size='18px' weight={300} uppercase>
        <FormattedMessage id='scenes.landing.wallet.simple' defaultMessage='Simple' />
      </Text>
      <Text size='14px' weight={200}>
        <FormattedMessage id='scenes.landing.wallet.simple_explain' defaultMessage='We make using bitcoin safe, simple, and fun. Securely store your bitcoin and instantly transact with anyone in the world' />
      </Text>
    </Block>
    <Block>
      <Icon name='lock' size='50px' />
      <Text size='18px' weight={300} uppercase>
        <FormattedMessage id='scenes.landing.wallet.safe' defaultMessage='Safe & Secure' />
      </Text>
      <Text size='14px' weight={200}>
        <FormattedMessage id='scenes.landing.wallet.safe_explain' defaultMessage='Our step-by-step Security Center helps you backup your funds, and protect them from unauthorized access.' />
      </Text>
    </Block>
    <Block>
      <Icon name='cart' size='50px' />
      <Text size='18px' weight={300} uppercase>
        <FormattedMessage id='scenes.landing.wallet.buy' defaultMessage='Buy & Sell' />
      </Text>
      <Text size='14px' weight={200}>
        <FormattedMessage id='scenes.landing.wallet.buy_explain' defaultMessage='Blockchain works with exchange partners all around the world to make buying bitcoin in your wallet both a seamless and secure experience.' />
      </Text>
    </Block>
  </Page>
)

export default Page1
