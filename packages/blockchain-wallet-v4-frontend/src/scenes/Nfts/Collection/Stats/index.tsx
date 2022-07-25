import React from 'react'
import { FormattedMessage } from 'react-intl'
import * as numeral from 'numeral'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions } from 'data'
import { CollectionsQuery } from 'generated/graphql.types'

import { Stat, StatsWrapper } from '../../components'

const Stats: React.FC<Props> = ({
  formActions,
  num_owners,
  routerActions,
  slug,
  stats,
  total_supply
}) => {
  return (
    <StatsWrapper>
      <Flex gap={8} justifyContent='center'>
        <Stat>
          <Text size='16px' weight={500} color='grey400'>
            <FormattedMessage id='copy.items' defaultMessage='Items' />
          </Text>
          <Text size='16px' color='black' weight={600}>
            {numeral(total_supply).format('0,0')}
          </Text>
        </Stat>
        {stats?.floor_price ? (
          <Stat
            onClick={() => {
              routerActions.push(`/nfts/collection/${slug}`)
              formActions.change('nftFilter', 'forSale', true)
            }}
            style={{ cursor: 'pointer' }}
          >
            <Text size='16px' weight={500} color='grey400'>
              <FormattedMessage id='copy.floor_price' defaultMessage='Floor Price' />
            </Text>
            <Text size='16px' color='black' weight={600}>
              {stats?.floor_price} ETH
            </Text>
          </Stat>
        ) : null}
      </Flex>
      <Flex gap={8} justifyContent='center'>
        {num_owners ? (
          <Stat>
            <Text size='16px' weight={500} color='grey400'>
              <FormattedMessage id='copy.owners' defaultMessage='Owners' />
            </Text>
            <Text size='16px' color='black' weight={600}>
              {numeral(num_owners).format('0,0')}
            </Text>
          </Stat>
        ) : null}
        {stats?.total_volume ? (
          <Stat>
            <Text size='16px' weight={500} color='grey400'>
              <FormattedMessage id='copy.total_vol' defaultMessage='Total Vol.' />
            </Text>
            <Text size='16px' color='black' weight={600}>
              {numeral(stats?.total_volume).format('0a')} ETH
            </Text>
          </Stat>
        ) : null}
      </Flex>
    </StatsWrapper>
  )
}

type Props = {
  formActions: typeof actions.form
  num_owners: CollectionsQuery['collections'][0]['num_owners']
  routerActions: typeof actions.router
  slug: string
  stats: CollectionsQuery['collections'][0]['stats']
  total_supply: CollectionsQuery['collections'][0]['total_supply']
}

export default Stats
