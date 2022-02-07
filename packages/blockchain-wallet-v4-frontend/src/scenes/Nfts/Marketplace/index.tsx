import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Link, SpinningLoader, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'

import { Props as OwnProps } from '..'
import {
  Asset,
  AssetCollection,
  AssetDetails,
  CTAWrapper,
  ImageContainer,
  LazyLoadWrapper,
  NftPageWrapper,
  PriceInfo,
  StyledCoinDisplay
} from '../components'
import MarketForm from './MarketForm'

const MarketplaceAsset = styled(Asset)``

const Marketplace: React.FC<Props> = (props: Props) => {
  const { marketplace, nftsActions } = props

  return (
    <NftPageWrapper>
      <MarketForm {...props} />
      <LazyLoadWrapper
        onLazyLoad={() => !marketplace.isLoading && nftsActions.fetchNftOrders()}
        triggerDistance={300}
      >
        {marketplace.list.length ? (
          marketplace.list.map((order) => {
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
                      <Text
                        style={{ whiteSpace: 'nowrap' }}
                        size='14px'
                        color='grey800'
                        weight={600}
                      >
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
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      marginTop: '14px',
                      textAlign: 'center',
                      width: '100%'
                    }}
                    size='11px'
                    href={order.asset.openseaLink}
                    target='_blank'
                  >
                    View on OpenSea
                  </Link>
                </CTAWrapper>
              </MarketplaceAsset>
            )
          })
        ) : props.marketplace.isLoading || props.marketplace.isFailure ? null : (
          <Text weight={600}>
            <span aria-label='see no evil' role='img'>
              🙈
            </span>{' '}
            No NFTs for sale in this collection.
          </Text>
        )}
        {props.marketplace.isLoading ? (
          <SpinningLoader width='14px' height='14px' borderWidth='3px' />
        ) : props.marketplace.isFailure ? (
          <Text weight={600}>
            <span aria-label='cry' role='img'>
              😭
            </span>{' '}
            Error fetching NFTs!
          </Text>
        ) : null}
      </LazyLoadWrapper>
      {props.marketplace.atBound ? <div>No more NFTs for sale in this collection</div> : null}
    </NftPageWrapper>
  )
}

type Props = OwnProps

export default Marketplace
