import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Link, SpinningLoader, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { media } from 'services/styles'

import { Props as OwnProps } from '..'
import {
  Asset,
  AssetCollection,
  AssetDetails,
  ImageContainer,
  PriceInfo,
  StyledCoinDisplay
} from '../components'
import MarketForm from './MarketForm'

const MarketplaceWrapper = styled.div`
  display: flex;
  width: 100%;
  ${media.tabletL`
    flex-direction: column;
  `}
`

const CTAWrapper = styled.div`
  padding: 8px;
`

const LazyLoadWrapper = styled(LazyLoadContainer)`
  max-width: 1000px;
  ${media.atLeastTabletL`
    width: 75%;
  `}
  > div {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    overflow: scroll;
    gap: 20px;
    margin-bottom: 20px;
  }
  ${media.atLeastLaptopL`
    > div {
      grid-template-columns: repeat(3, minmax(0, 1fr));  
    }
  `}
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
                background={`url(${order.asset.imageUrl.replace(/=s\d*/, '')})`}
                backgroundColor={`#${order.asset?.backgroundColor}` || '#fff'}
              />
              <AssetDetails>
                <div>
                  <AssetCollection>
                    <Text style={{ whiteSpace: 'nowrap' }} size='14px' color='grey800' weight={600}>
                      {order.asset.collection.name}
                    </Text>
                  </AssetCollection>
                  <Text style={{ marginTop: '4px' }} size='16px' color='black' weight={600}>
                    {order.asset.name}
                  </Text>
                </div>
                <PriceInfo>
                  <Text size='12px' color='black' weight={600}>
                    <FormattedMessage id='copy.price' defaultMessage='Price' />
                  </Text>
                  <Text color='black' style={{ display: 'flex', marginTop: '4px' }}>
                    <StyledCoinDisplay
                      size='14px'
                      color='black'
                      weight={600}
                      coin={order.paymentTokenContract.symbol}
                    >
                      {order.basePrice}
                    </StyledCoinDisplay>
                    &nbsp;-&nbsp;
                    <FiatDisplay
                      size='12px'
                      color='grey600'
                      weight={600}
                      coin={order.paymentTokenContract.symbol}
                    >
                      {order.basePrice}
                    </FiatDisplay>
                  </Text>
                </PriceInfo>
              </AssetDetails>
              <CTAWrapper>
                <Button
                  data-e2e='buyNft'
                  nature='primary'
                  fullwidth
                  onClick={() => nftsActions.nftOrderFlowOpen({ order })}
                >
                  <FormattedMessage id='copy.buy' defaultMessage='Buy' />
                </Button>
                <Link
                  style={{ marginTop: '2px' }}
                  size='11px'
                  href={order.asset.openseaLink}
                  target='_blank'
                >
                  View on Opensea
                </Link>
              </CTAWrapper>
            </MarketplaceAsset>
          )
        })}
        {props.orders.isLoading ? (
          <SpinningLoader width='14px' height='14px' borderWidth='3px' />
        ) : null}
      </LazyLoadWrapper>
      {props.marketplace.atBound ? <div>No more NFTs for sale in this collection</div> : null}
    </MarketplaceWrapper>
  )
}

type Props = OwnProps

export default Marketplace
