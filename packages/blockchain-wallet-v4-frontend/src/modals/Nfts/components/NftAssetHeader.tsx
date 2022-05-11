import React from 'react'
import { colors } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'

import { NftAsset, RawOrder } from '@core/network/api/nfts/types'
import { Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import { Row } from 'components/Flyout'

const NftAssetHeaderRow: React.FC<Props> = ({ asset }) => {
  const sellOrders =
    asset?.orders?.filter((x) => {
      return x.side === 1
    }) || []
  const lowest_order = sellOrders.sort((a, b) =>
    new BigNumber(a.base_price).isLessThan(b.base_price) ? -1 : 1
  )[0]

  return (
    <Row>
      <Flex justifyContent='space-between'>
        <Flex>
          <img
            style={{
              borderRadius: '8px',
              height: '64px',
              marginRight: '12px',
              width: 'auto'
            }}
            alt='nft-asset'
            src={asset.image_url.replace(/=s\d*/, '')}
          />
          <div>
            <Text size='16px' color='grey900' weight={600}>
              {asset?.name}
            </Text>
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
          </div>
        </Flex>
        {lowest_order?.base_price && (
          <Text
            style={{
              justifyContent: 'right'
            }}
          >
            <CoinDisplay
              size='14px'
              color='black'
              weight={600}
              coin='ETH'
              style={{ justifyContent: 'right' }}
            >
              {lowest_order?.base_price}
            </CoinDisplay>
            <FiatDisplay
              size='14px'
              color={colors.grey600}
              weight={600}
              coin='ETH'
              style={{ justifyContent: 'right' }}
            >
              {lowest_order?.base_price}
            </FiatDisplay>
          </Text>
        )}
      </Flex>
    </Row>
  )
}

type Props = {
  asset: NftAsset
  lowest_order?: RawOrder
}

export default NftAssetHeaderRow
