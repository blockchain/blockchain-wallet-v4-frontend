import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Link, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { media } from 'services/styles'

import { Props as OwnProps } from '..'
import {
  Asset,
  AssetCollection,
  AssetDetails,
  AssetImage,
  ImageContainer,
  PriceInfo,
  StyledCoinDisplay
} from '../components'
import MarketForm from './MarketForm'

const MarketplaceWrapper = styled.div`
  display: flex;
  width: 100%;
`

const LazyLoadWrapper = styled(LazyLoadContainer)`
  ${media.atLeastLaptopM`
    width: 75%;
  `}
  > div {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    overflow: scroll;
    gap: 20px;
    margin-bottom: 20px;
  }
`

const MarketplaceAsset = styled(Asset)``

const Marketplace: React.FC<Props> = (props: Props) => {
  const { nftsActions, orders } = props

  return (
    <MarketplaceWrapper>
      <MarketForm {...props} />
      <LazyLoadWrapper onLazyLoad={nftsActions.fetchNftOrders} triggerDistance={300}>
        {orders.list.map((order) => {
          if (!order.paymentTokenContract) return null
          if (!window.coins[order.paymentTokenContract.symbol]) return null
          if (!order.asset) return null

          return (
            <MarketplaceAsset key={order.calldata}>
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
                    <Text style={{ whiteSpace: 'nowrap' }} size='12px' color='grey600' weight={600}>
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
            </MarketplaceAsset>
          )
        })}
        {props.orders.isLoading ? <div>Loading</div> : null}
      </LazyLoadWrapper>
      {props.marketplace.atBound ? <div>No more NFTs for sale in this collection</div> : null}
    </MarketplaceWrapper>
  )
}

type Props = OwnProps

export default Marketplace
