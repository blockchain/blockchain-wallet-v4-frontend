import React from 'react'
import { FormattedMessage } from 'react-intl'

import { convertCoinToCoin } from '@core/exchange'
import { NftOrdersType } from '@core/network/api/nfts/types'
import { RemoteDataType } from '@core/types'
import { Button, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { PageTitle, SubTitle, Title } from 'components/Layout'

import { Props as OwnProps } from '..'
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

const Marketplace: React.FC<Props> = (props: Props) => {
  const { nftsActions, ordersR } = props

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
              {orders
                .sort((a, b) => (a.basePrice.isLessThan(b.basePrice) ? -1 : 1))
                .map((order) => {
                  if (!order.paymentTokenContract) return null
                  if (!window.coins[order.paymentTokenContract.symbol]) return null
                  if (!order.asset) return null

                  return (
                    <Asset key={order.calldata}>
                      <ImageContainer
                        style={{
                          backgroundColor: `#${order.asset?.backgroundColor}` || '#fff'
                        }}
                      >
                        <AssetImage
                          alt={order.asset.imageUrl}
                          style={{ width: '100%' }}
                          src={order.asset.imageUrl}
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
                          <Text
                            style={{ marginTop: '4px' }}
                            size='12px'
                            color='grey800'
                            weight={600}
                          >
                            {order.asset.name}
                          </Text>
                        </div>
                        <PriceInfo>
                          <Text size='12px' color='grey600' weight={600}>
                            <FormattedMessage id='copy.price' defaultMessage='Price' />
                          </Text>
                          <Text
                            style={{ marginTop: '4px' }}
                            size='12px'
                            color='grey800'
                            weight={600}
                          >
                            <StyledCoinDisplay
                              size='12px'
                              color='grey800'
                              weight={600}
                              coin={order.paymentTokenContract.symbol}
                            >
                              {order.basePrice}
                            </StyledCoinDisplay>
                          </Text>
                          <FiatDisplay coin={order.paymentTokenContract.symbol}>
                            {order.basePrice}
                          </FiatDisplay>
                        </PriceInfo>
                      </AssetDetails>
                      <Button
                        data-e2e='buyNft'
                        nature='primary'
                        onClick={() => nftsActions.createBuyOrder({ order })}
                      >
                        <FormattedMessage id='copy.buy' defaultMessage='Buy' />
                      </Button>
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

type Props = OwnProps

export default Marketplace
