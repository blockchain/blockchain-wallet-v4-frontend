import React from 'react'
import { FormattedMessage } from 'react-intl'

import { convertCoinToCoin } from '@core/exchange'
import { NftOrdersType } from '@core/network/api/nfts/types'
import { RemoteDataType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { PageTitle, SubTitle, Title } from 'components/Layout'

import {
  Asset,
  AssetCollection,
  AssetDetails,
  AssetImage,
  CollectionWrapper,
  ImageContainer,
  PriceInfo,
  StyledCoinDisplay
} from '../components'

const Marketplace: React.FC<Props> = ({ ordersR }) => {
  return (
    <div>
      <PageTitle>
        <div>
          <Title>
            <Text color='grey800' size='24px' weight={600}>
              <FormattedMessage id='copy.nfts.marketplace' defaultMessage='Marketplace' />
            </Text>
          </Title>
          <SubTitle>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='scenes.nfts.marketplace.sub'
                defaultMessage='Buy/Sell NFTs directly from your blockchain.com Wallet'
              />
            </Text>
          </SubTitle>
        </div>
      </PageTitle>
      <div>
        {ordersR.cata({
          Failure: (e) => e,
          Loading: () => 'Loading...',
          NotAsked: () => 'Loading...',
          Success: (orders) => (
            <CollectionWrapper>
              {orders.map((order) => {
                if (!window.coins[order.payment_token_contract.symbol]) return null

                return (
                  <Asset key={order.id}>
                    <ImageContainer
                      style={{
                        backgroundColor: `#${order.asset.background_color}` || '#fff'
                      }}
                    >
                      <AssetImage
                        alt={order.asset.image_url}
                        style={{ width: '100%' }}
                        src={order.asset.image_url}
                      />
                    </ImageContainer>
                    <AssetDetails>
                      <div>
                        <AssetCollection>
                          <Text
                            style={{ whiteSpace: 'nowrap' }}
                            size='12px'
                            color='grey600'
                            weight={600}
                          >
                            {order.asset.collection.name}
                          </Text>
                        </AssetCollection>
                        <Text style={{ marginTop: '4px' }} size='12px' color='grey800' weight={600}>
                          {order.asset.name}
                        </Text>
                      </div>
                      <PriceInfo>
                        <Text size='12px' color='grey600' weight={600}>
                          <FormattedMessage id='copy.price' defaultMessage='Price' />
                        </Text>
                        <Text style={{ marginTop: '4px' }} size='12px' color='grey800' weight={600}>
                          <StyledCoinDisplay
                            size='12px'
                            color='grey800'
                            weight={600}
                            coin={order.payment_token_contract.symbol}
                          >
                            {convertCoinToCoin({
                              baseToStandard: false,
                              coin: 'ETH',
                              value: order.payment_token_contract.eth_price
                            })}
                          </StyledCoinDisplay>
                        </Text>
                      </PriceInfo>
                    </AssetDetails>
                  </Asset>
                )
              })}
            </CollectionWrapper>
          )
        })}
      </div>
    </div>
  )
}

type Props = {
  ordersR: RemoteDataType<string, NftOrdersType['orders']>
}

export default Marketplace
