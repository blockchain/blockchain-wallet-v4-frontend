import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Badge, Background, Text } from 'blockchain-info-components'
import Container from 'components/Container'

const Wrapper = styled.div``
const BannerBackground = styled(Background)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-position: 70% 100%;
`
const Banner = styled(Container)`
  color: #FFFFFF;
`
const Badges = styled.div`
  display: block;
  padding: 10px 0;
  & > * { display:inline; margin-right: 5px; }
`

const Devices = (props) => {
  return (
    <Wrapper>
      <BannerBackground name='landing-page-banner-sm-overlay' height='300px'>
        <Banner>
          <Text size='30px' weight={200} color='white' capitalize>
            <FormattedMessage id='scenes.landing.devices.bitcoin' defaultMessage='Bitcoin on All Your Devices' />
          </Text>
          <Text size='16px' weight={300} color='white'>
            <FormattedMessage id='scenes.landing.devices.wallet' defaultMessage='Access your bitcoin wallet securely anywhere you go.' />
          </Text>
          <Badges>
            <Badge type='applestore' />
            <Badge type='googleplay' />
          </Badges>
        </Banner>
      </BannerBackground>
    </Wrapper>
  )
}

export default Devices
