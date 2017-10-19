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

const Page2 = () => (
  <Page>
    <Block>
      <Icon name='sophisticated' size='50px' />
      <Text size='18px' weight={300} uppercase>
        <FormattedMessage id='scenes.landing.wallet.sophisticated' defaultMessage='Sophisticated' />
      </Text>
      <Text size='14px' weight={200}>
        <FormattedMessage id='scenes.landing.wallet.sophisticated_explain' defaultMessage='Hierarchical deterministic addresses. Dynamic transaction fees. Monitoring and spending from Watch Only addresses.' />
      </Text>
    </Block>
    <Block>
      <Icon name='globe' size='50px' />
      <Text size='18px' weight={300} uppercase>
        <FormattedMessage id='scenes.landing.wallet.global' defaultMessage='Global' />
      </Text>
      <Text size='14px' weight={200}>
        <FormattedMessage id='scenes.landing.wallet.global_explain' defaultMessage='140+ countries served. 20+ currency conversion rates, including JPY, RUB, SGD, USD, CNY, EUR, GBP, and many more. 25+ languages.' />
      </Text>
    </Block>
    <Block>
      <Icon name='support' size='50px' />
      <Text size='18px' weight={300} uppercase>
        <FormattedMessage id='scenes.landing.wallet.supported' defaultMessage='Always supported' />
      </Text>
      <Text size='14px' weight={200}>
        <FormattedMessage id='scenes.landing.wallet.supported_explain' defaultMessage='Should you need help or have a question, our best in class support team will always be there for you.' />
      </Text>
    </Block>
  </Page>
)

export default Page2
