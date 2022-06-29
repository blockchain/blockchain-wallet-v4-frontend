import React from 'react'
import { FormattedMessage } from 'react-intl'
import * as numeral from 'numeral'

import { Text } from 'blockchain-info-components'
import { actions } from 'data'
import { CollectionsQuery } from 'generated/graphql.types'

import { Stat, StatsWrapper } from '../../components'

const Stats: React.FC<Props> = ({ formActions, stats, total_supply }) => {
  return (
    <div style={{ marginTop: '24px' }}>
      <StatsWrapper>
        <Stat>
          <Text size='16px' weight={500} color='white'>
            <FormattedMessage id='copy.items' defaultMessage='Items' />
          </Text>
          <Text size='16px' color='white' weight={600}>
            {numeral(total_supply).format('0,0')}
          </Text>
        </Stat>
        <Stat
          onClick={() => formActions.change('nftFilter', 'forSale', true)}
          style={{ cursor: 'pointer' }}
        >
          <Text size='16px' weight={500} color='white'>
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
          <Text size='16px' weight={500} color='white'>
            <FormattedMessage id='copy.total_vol' defaultMessage='Total Vol.' />
          </Text>
          <Text size='16px' color='white' weight={600}>
            {numeral(stats?.total_volume).format('0a')} ETH
          </Text>
        </Stat>
      </StatsWrapper>
    </div>
  )
}

type Props = {
  formActions: typeof actions.form
  stats: CollectionsQuery['collections'][0]['stats']
  total_supply: CollectionsQuery['collections'][0]['total_supply']
}

export default Stats
