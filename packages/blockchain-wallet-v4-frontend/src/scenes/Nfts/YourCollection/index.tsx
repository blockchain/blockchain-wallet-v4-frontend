import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

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
import CollectionForm from './CollectionForm'

const YourCollection: React.FC<Props> = (props) => {
  useEffect(() => {
    props.nftsActions.fetchNftAssets()
  }, [])

  const assets =
    props.assets.collection === 'all'
      ? props.assets.list
      : props.assets.list.filter((asset) => asset.collection.slug === props.assets.collection)

  return (
    <NftPageWrapper>
      <CollectionForm {...props} />
      <LazyLoadWrapper onLazyLoad={() => /* TODO */ {}}>
        {assets.map((asset) => {
          if (!asset) return null
          return (
            <Asset key={asset.token_id}>
              <ImageContainer
                backgroundColor={`#${asset.background_color}` || '#fff'}
                background={`url(${asset.image_url})`}
              />
              <AssetDetails>
                <div>
                  <AssetCollection>
                    <Text style={{ whiteSpace: 'nowrap' }} size='14px' color='grey800' weight={600}>
                      {asset.collection.name}
                    </Text>
                  </AssetCollection>
                  <Text style={{ marginTop: '4px' }} size='16px' color='black' weight={600}>
                    {asset.name}
                  </Text>
                </div>
                <PriceInfo>
                  <Text size='12px' color='black' weight={600}>
                    <FormattedMessage id='copy.last_sale' defaultMessage='Last Sale' />
                  </Text>
                  <Text color='black' style={{ display: 'flex', marginTop: '4px' }}>
                    <StyledCoinDisplay
                      size='14px'
                      color='black'
                      weight={600}
                      coin={asset.last_sale.payment_token.symbol}
                    >
                      {asset.last_sale.total_price}
                    </StyledCoinDisplay>
                    &nbsp;-&nbsp;
                    <FiatDisplay
                      size='12px'
                      color='grey600'
                      weight={600}
                      coin={asset.last_sale.payment_token.symbol}
                    >
                      {asset.last_sale.total_price}
                    </FiatDisplay>
                  </Text>
                </PriceInfo>
              </AssetDetails>
              <CTAWrapper>
                {asset.sell_orders ? (
                  <Button
                    fullwidth
                    data-e2e='cancelListing'
                    nature='primary'
                    onClick={() => props.nftsActions.nftOrderFlowOpen({ asset })}
                  >
                    {asset.sell_orders.length > 1 ? (
                      <FormattedMessage
                        id='copy.cancel_listings'
                        defaultMessage='Cancel Listings'
                      />
                    ) : (
                      <FormattedMessage id='copy.cancel_listing' defaultMessage='Cancel Listing' />
                    )}
                  </Button>
                ) : (
                  <Button
                    fullwidth
                    data-e2e='sellNft'
                    nature='primary'
                    onClick={() => props.nftsActions.nftOrderFlowOpen({ asset })}
                  >
                    <FormattedMessage id='copy.sell' defaultMessage='Sell' />
                  </Button>
                )}
                <Link
                  style={{ display: 'block', marginTop: '8px', textAlign: 'center', width: '100%' }}
                  size='11px'
                  href={asset.permalink}
                  target='_blank'
                >
                  View on Opensea
                </Link>
              </CTAWrapper>
            </Asset>
          )
        })}
        {props.assets.isLoading ? (
          <SpinningLoader width='14px' height='14px' borderWidth='3px' />
        ) : null}
        {props.assets.atBound && props.assets.collection === 'all' ? (
          <Text weight={600}>
            <span aria-label='cry' role='img'>
              😭
            </span>{' '}
            No more NFTs to view!
          </Text>
        ) : null}
      </LazyLoadWrapper>
    </NftPageWrapper>
  )
}

export type Props = OwnProps

export default YourCollection
