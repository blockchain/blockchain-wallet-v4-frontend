import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

import { Box } from './../components'

const InfoBox = styled(Box)`
  background-image: url('/img/buy-sell-learn-more.png');
  /* stylelint-disable */
  background-image: -webkit-image-set(
    url('/img/buy-sell-learn-more.png') 1x,
    url('/img/buy-sell-learn-more@2x.png') 2x
  );
  /* stylelint-enable */
  background-repeat: no-repeat;
`

const LearnMoreCard = () => (
  <InfoBox>
    <Icon name='cart-filled' color='blue600' size='32px' />
    <Text
      size='20px'
      color='grey800'
      weight={600}
      style={{ marginTop: '16px' }}
    >
      <FormattedMessage
        id='scenes.buysell.info.learn-more-title'
        defaultMessage={`How do you want{break} to get Crypto?`}
        values={{ break: <br /> }}
      />
    </Text>
    <Text
      color='grey600'
      lineHeight='1.5'
      size='14px'
      style={{ marginTop: '8px', width: '265px' }}
      weight={500}
    >
      <FormattedMessage
        id='scenes.buysell.info.learn-more-desc'
        defaultMessage='Blockchain is the fastest way to buy and sell cryptocurrencies. Trade in our exchange The PIT.'
      />
    </Text>
  </InfoBox>
)

export default LearnMoreCard
