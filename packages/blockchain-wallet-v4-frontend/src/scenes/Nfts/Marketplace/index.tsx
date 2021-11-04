import React from 'react'
import { FormattedMessage } from 'react-intl'

import { convertCoinToCoin } from '@core/exchange'
import { NftOrdersType } from '@core/network/api/nfts/types'
import { RemoteDataType } from '@core/types'
import { Button, Link, Text } from 'blockchain-info-components'
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
import MarketForm from './MarketForm'

const Marketplace: React.FC<Props> = (props: Props) => {
  const { listOfRemoteOrders, nftsActions } = props

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
                defaultMessage='Buy/Sell NFTs directly from your blockchain.com Wallet.'
              />
            </Text>
          </SubTitle>
        </div>
      </PageTitle>
      <div>
        <MarketForm {...props} />
        <SubTitle>
          <Text color='grey600' size='14px' weight={600}>
            <FormattedMessage
              id='scenes.nfts.marketplace.sub2'
              defaultMessage='Note: Orders are sorted by most recently created.'
            />
          </Text>
        </SubTitle>
        <CollectionWrapper>
          {listOfRemoteOrders.map((ordersR) =>
            ordersR.cata({
              Failure: (e) => e,
              Loading: () => 'Loading...',
              NotAsked: () => 'Loading...',
              Success: (orders) =>
                orders.map((order) => {
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
                      <Link href={order.asset.openseaLink} target='_blank'>
                        <Button data-e2e='buyNft' nature='primary'>
                          View on Opensea
                        </Button>
                      </Link>
                    </Asset>
                  )
                })
            })
          )}
        </CollectionWrapper>
        {props.marketplace.atBound ? <div>No more NFTs for sale in this collection</div> : null}
        <Button data-e2e='removethis' nature='primary' onClick={() => nftsActions.fetchNftOrders()}>
          get more
        </Button>
      </div>
    </div>
  )
}

type Props = OwnProps

export default Marketplace
