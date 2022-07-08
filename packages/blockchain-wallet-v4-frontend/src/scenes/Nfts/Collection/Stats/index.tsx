import React from 'react'
import { FormattedMessage } from 'react-intl'
import * as numeral from 'numeral'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions } from 'data'
import { CollectionsQuery } from 'generated/graphql.types'

import { Stat, StatsWrapper } from '../../components'

<<<<<<< Updated upstream
const Stats: React.FC<Props> = ({ formActions, stats, total_supply }) => {
=======
const Stats: React.FC<Props> = ({
  formActions,
  num_owners,
  routerActions,
  slug,
  stats,
  total_supply
}) => {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
  )
}

type Props = {
  formActions: typeof actions.form
<<<<<<< Updated upstream
=======
  num_owners: CollectionsQuery['collections'][0]['num_owners']
  routerActions: typeof actions.router
  slug: string
>>>>>>> Stashed changes
  stats: CollectionsQuery['collections'][0]['stats']
  total_supply: CollectionsQuery['collections'][0]['total_supply']
}

export default Stats
