import React from 'react'
import { FormattedMessage } from 'react-intl'
import * as numeral from 'numeral'
import styled from 'styled-components'

import { NftCollection } from '@core/network/api/nfts/types'
import { RemoteDataType } from '@core/types'
import { SpinningLoader, Text } from 'blockchain-info-components'
import { CollectionsQuery } from 'generated/graphql'
import { media, useMedia } from 'services/styles'

const StatsWrapper = styled.div`
  display: flex;
  gap: 8px;
`

const Stat = styled.div`
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  gap: 16px;
  background: ${(props) => props.theme.greyFade100};
  ${media.tabletL`
    padding: 10px;
    > div {
      font-size: 12px;
    }
  `}
`

const Stats: React.FC<Props> = ({ stats }) => {
  return (
    <div style={{ marginTop: '24px' }}>
      <StatsWrapper>
        <Stat>
          <Text size='16px' weight={500} color='grey600'>
            <FormattedMessage id='copy.items' defaultMessage='Items' />
          </Text>
          <Text size='16px' color='white' weight={600}>
            {numeral(stats?.total_supply).format('0,0')}
          </Text>
        </Stat>
        <Stat>
          <Text size='16px' weight={500} color='grey600'>
            <FormattedMessage id='copy.floor_price' defaultMessage='Floor Price' />
          </Text>
          <Text size='16px' color='white' weight={600}>
            {stats?.floor_price} ETH
          </Text>
        </Stat>
        {/* <Stat>
          <Text size='16px' weight={500} color='grey600'>
            <FormattedMessage id='copy.owners' defaultMessage='Owners' />
          </Text>
          <Text size='16px' color='white' weight={600}>
            {numeral(stats?.num_owners).format('0,0')}
          </Text>
        </Stat> */}
        <Stat>
          <Text size='16px' weight={500} color='grey600'>
            <FormattedMessage id='copy.total_vol' defaultMessage='Total Vol.' />
          </Text>
          <Text size='16px' color='white' weight={600}>
            {numeral(stats?.total_volume).format('0a')}
          </Text>
        </Stat>
      </StatsWrapper>
    </div>
  )
}

type Props = {
  stats: CollectionsQuery['collections'][0]['stats']
}

export default Stats
