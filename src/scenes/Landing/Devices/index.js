import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Grid } from 'react-bootstrap'

import { Badge, Background, Text, DefaultColor } from 'blockchain-info-components'

const DevicesContainer = styled.div``
const BannerWrapper = styled(Background)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-position: 70% 100%;
`
const BannerContainer = styled(Grid)`
  color: #FFFFFF;
`
const BadgesContainer = styled.div`
  display: block;
  padding: 10px 0;
  & > * { display:inline; margin-right: 5px; }
`

const Devices = (props) => {
  return (
    <DevicesContainer>
      <BannerWrapper name='landing-page-banner-sm-overlay' height='300px'>
        <BannerContainer>
          <Text size='30px' weight={200} color={DefaultColor.white} capitalize>
            <FormattedMessage id='scenes.landing.devices.bitcoin' defaultMessage='Bitcoin on All Your Devices' />
          </Text>
          <Text size='16px' weight={300} color={DefaultColor.white}>
            <FormattedMessage id='scenes.landing.devices.wallet' defaultMessage='Access your bitcoin wallet securely anywhere you go.' />
          </Text>
          <BadgesContainer>
            <Badge type='applestore' />
            <Badge type='googleplay' />
          </BadgesContainer>
        </BannerContainer>
      </BannerWrapper>
    </DevicesContainer>
  )
}

export default Devices
