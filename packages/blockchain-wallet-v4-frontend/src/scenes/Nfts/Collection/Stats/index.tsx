import React from 'react'
import { FormattedMessage } from 'react-intl'
import { colors } from '@blockchain-com/constellation'
import * as numeral from 'numeral'
import styled from 'styled-components'

import { NftCollection } from '@core/network/api/nfts/types'
import { RemoteDataType } from '@core/types'
import { SpinningLoader, Text } from 'blockchain-info-components'
import { media, useMedia } from 'services/styles'

const StatsWrapper = styled.div`
  display: flex;
`

const Stat = styled.div`
  width: 25%;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  border: 1px solid ${colors.grey100};
  ${media.tabletL`
    padding: 10px;
    > div {
      font-size: 12px;
    }
  `}
`

const Stats: React.FC<Props> = ({ collection }) => {
  const tabletL = useMedia('tabletL')

  return (
    <div style={{ marginTop: '42px' }}>
      {collection.cata({
        Failure: () => null,
        Loading: () => (
          <div
            style={{
              display: 'flex',
              height: tabletL ? '56px' : '82px',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            <SpinningLoader height='14px' width='14px' borderWidth='3px' />
          </div>
        ),
        NotAsked: () => null,
        Success: (val) => (
          <StatsWrapper>
            <Stat>
              <Text size='16px' weight={500} color='grey600'>
                <FormattedMessage id='copy.items' defaultMessage='Items' />
              </Text>
              <Text style={{ marginTop: '4px' }} size='20px' color='black' weight={600}>
                {numeral(val.stats.count).format('0,0')}
              </Text>
            </Stat>
            <Stat>
              <Text size='16px' weight={500} color='grey600'>
                <FormattedMessage id='copy.floor_price' defaultMessage='Floor Price' />
              </Text>
              <Text style={{ marginTop: '4px' }} size='20px' color='black' weight={600}>
                {val.stats.floor_price} ETH
              </Text>
            </Stat>
            <Stat>
              <Text size='16px' weight={500} color='grey600'>
                <FormattedMessage id='copy.owners' defaultMessage='Owners' />
              </Text>
              <Text style={{ marginTop: '4px' }} size='20px' color='black' weight={600}>
                {numeral(val.stats.num_owners).format('0,0')}
              </Text>
            </Stat>
            <Stat>
              <Text size='16px' weight={500} color='grey600'>
                <FormattedMessage id='copy.total_vol' defaultMessage='Total Vol.' />
              </Text>
              <Text style={{ marginTop: '4px' }} size='20px' color='black' weight={600}>
                {numeral(val.stats.total_volume).format('0a')}
              </Text>
            </Stat>
          </StatsWrapper>
        )
      })}
    </div>
  )
}

type Props = {
  collection: RemoteDataType<string, NftCollection>
}

export default Stats
