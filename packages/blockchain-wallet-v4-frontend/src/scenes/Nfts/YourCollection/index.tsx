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
      <LazyLoadWrapper onLazyLoad={() => props.nftsActions.fetchNftAssets()}>
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
                  {asset.last_sale ? (
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
                  ) : (
                    <Text color='grey600' size='12px' weight={600}>
                      N/A
                    </Text>
                  )}
                </PriceInfo>
              </AssetDetails>
              <CTAWrapper>
                <Button
                  fullwidth
                  data-e2e='sellNft'
                  nature='primary'
                  onClick={() => props.nftsActions.nftOrderFlowOpen({ asset })}
                >
                  <FormattedMessage id='copy.view_details' defaultMessage='View Details' />
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
                  href={asset.permalink}
                  target='_blank'
                >
                  View on OpenSea
                </Link>
              </CTAWrapper>
            </Asset>
          )
        })}
        {props.assets.isLoading ? (
          <SpinningLoader width='14px' height='14px' borderWidth='3px' />
        ) : null}
        {props.assets.atBound && props.assets.collection === 'all' ? (
          props.assets.list.length === 0 ? (
            <Text weight={600}>
              <span aria-label='flag' role='img'>
                🏴‍☠️
              </span>{' '}
              Your collection is looking a bit empty there. How about{' '}
              <Link onClick={() => props.setActiveTab('explore')} weight={600}>
                exploring the market?
              </Link>
            </Text>
          ) : (
            <Text weight={600}>
              <span aria-label='cry' role='img'>
                😭
              </span>{' '}
              No more NFTs to view!
            </Text>
          )
        ) : null}
      </LazyLoadWrapper>
    </NftPageWrapper>
  )
}

export type Props = OwnProps & {
  setActiveTab: (tab: 'explore' | 'my-collection' | 'offers') => void
}

export default YourCollection
