import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Button, Link, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import { GreyBlueGradientCartridge, GreyCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import { Flex } from 'components/Flex'
import { actions } from 'data'
import { Analytics } from 'data/types'
import { AssetsQuery } from 'generated/graphql.types'

import { Asset, AssetCollection, AssetDetails, AssetImageContainer, PriceCTA } from '.'
import NftAssetImageType from './NftAssetImageType'
import NftCollectionImageSmall from './NftCollectionImageSmall'

const XSmallButton = styled(Button)`
  padding: 6px 8px;
  height: auto;
`

const NftAssetItem: React.FC<Props> = ({ asset }) => {
  const dispatch = useDispatch()

  const logoClickTracking = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_NFT_CLICKED,
        properties: {
          collection_name: asset.collection.name,
          image_logo: true,
          name_click: false
        }
      })
    )
  }
  const nameClickTracking = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_NFT_CLICKED,
        properties: {
          collection_name: asset.collection.name,
          image_logo: false,
          name_click: true
        }
      })
    )
  }
  const viewDetailsTracking = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_VIEW_BUTTON_VIEWED,
        properties: {}
      })
    )
  }

  const lowestListing = asset.listings
    ? asset.listings.sort((a, b) => Number(a?.starting_price) - Number(b?.starting_price))[0]
    : null

  return (
    <Asset key={asset?.token_id} className='asset'>
      <LinkContainer onClick={logoClickTracking} to={`/nfts/collection/${asset.collection.slug}`}>
        <Link>
          <Flex alignItems='center' gap={8}>
            {asset.collection.image_url ? (
              <NftCollectionImageSmall
                isVerified={asset.collection.safelist_request_status === 'verified'}
                alt='Dapp Logo'
                src={asset.collection.image_url || ''}
              />
            ) : null}
            <AssetCollection onClick={nameClickTracking}>
              <Text
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                size='14px'
                color='grey800'
                weight={600}
              >
                {asset?.collection?.name}
              </Text>
            </AssetCollection>
          </Flex>
        </Link>
      </LinkContainer>
      <LinkContainer
        style={{ position: 'relative' }}
        to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}
      >
        <Link>
          <AssetImageContainer
            className='asset-image-container'
            background={`url(${asset?.image_url?.replace(/=s\d*/, '')})`}
          />
          <NftAssetImageType
            top='20px'
            right='10px'
            animation_url={asset.animation_url}
            image_url={asset.image_url}
          />
        </Link>
      </LinkContainer>
      <AssetDetails>
        <div>
          <Text style={{ marginTop: '4px' }} size='14px' color='black' weight={600}>
            {asset?.name}
          </Text>
        </div>

        <PriceCTA>
          <LinkContainer to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}>
            {lowestListing && lowestListing.starting_price ? (
              <XSmallButton data-e2e='nftAssetPage' nature='primary' small>
                <FormattedMessage id='copy.buy_now' defaultMessage='Buy Now' />
              </XSmallButton>
            ) : (
              <XSmallButton
                onClick={viewDetailsTracking}
                data-e2e='nftAssetPage'
                nature='dark-grey'
                small
              >
                <FormattedMessage id='copy.make_offer' defaultMessage='Make Offer' />
              </XSmallButton>
            )}
          </LinkContainer>
          {lowestListing && lowestListing.starting_price ? (
            <LinkContainer to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}>
              <Link>
                <GreyBlueGradientCartridge>
                  <CoinDisplay
                    coin={lowestListing.payment_token_symbol || 'ETH'}
                    size='14px'
                    weight={600}
                  >
                    {lowestListing.starting_price}
                  </CoinDisplay>
                </GreyBlueGradientCartridge>
              </Link>
            </LinkContainer>
          ) : (
            <GreyCartridge>
              <FormattedMessage id='copy.not_for_sale' defaultMessage='Not for sale' />
              <TooltipHost id='tooltip.nft_asset_not_for_sale'>
                <TooltipIcon name='question-in-circle-filled' />
              </TooltipHost>
            </GreyCartridge>
          )}
        </PriceCTA>
      </AssetDetails>
    </Asset>
  )
}

type Props = {
  asset: AssetsQuery['assets'][0]
}

export default NftAssetItem
