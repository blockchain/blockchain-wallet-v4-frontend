import React from 'react'
import { colors } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { NftAsset, RawOrder } from '@core/network/api/nfts/types'
import { Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import { Row } from 'components/Flyout'

const BorderRow = styled(Row)`
  border-top: 1px solid ${(props) => props.theme.grey000};
  border-bottom: 1px solid ${(props) => props.theme.grey000};
`

const NftAssetHeaderRow: React.FC<Props> = ({ asset }) => {
  const sellOrders =
    asset?.orders?.filter((x) => {
      return x.side === 1
    }) || []
  const lowest_order = sellOrders.sort((a, b) =>
    new BigNumber(a.current_price).isLessThan(b.current_price) ? -1 : 1
  )[0]

  return (
    <BorderRow>
      <Flex justifyContent='space-between'>
        <Flex>
          <img
            style={{
              borderRadius: '8px',
              height: '56px',
              marginRight: '8px',
              width: 'fit-content'
            }}
            alt='nft-asset'
            src={asset.image_url?.replace(/=s\d*/, '')}
          />
        </Flex>
        <Flex style={{ width: '100%' }} flexDirection='column' justifyContent='space-between'>
          <Flex justifyContent='space-between' alignItems='center'>
            <Text size='16px' color='grey900' weight={600}>
              {asset?.name || `#${asset?.token_id}`}
            </Text>
            {lowest_order?.current_price ? (
              <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                {lowest_order.current_price}
              </CoinDisplay>
            ) : null}
          </Flex>
          <Flex alignItems='center' justifyContent='space-between'>
            {asset.collection.safelist_request_status === 'verified' ? (
              <Text
                size='14px'
                weight={600}
                color='green600'
                style={{
                  background: colors.green100,
                  borderRadius: '8px',
                  padding: '5px 8px',
                  textAlign: 'center',
                  width: 'fit-content'
                }}
              >
                Verified
              </Text>
            ) : (
              <Text
                size='14px'
                weight={600}
                color='orange600'
                style={{
                  background: colors.orange100,
                  borderRadius: '8px',
                  padding: '5px 8px',
                  textAlign: 'center',
                  width: 'fit-content'
                }}
              >
                Not Verified
              </Text>
            )}
            {lowest_order?.current_price ? (
              <FiatDisplay
                size='14px'
                color={colors.grey600}
                weight={600}
                currency='USD'
                coin='ETH'
              >
                {lowest_order.current_price}
              </FiatDisplay>
            ) : null}
          </Flex>
        </Flex>
      </Flex>
    </BorderRow>
  )
}

type Props = {
  asset: NftAsset
  lowest_order?: RawOrder
}

export default NftAssetHeaderRow
