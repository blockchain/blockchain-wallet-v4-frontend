import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Button, Link, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import { GreyBlueGradientCartridge, GreyCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import { Flex } from 'components/Flex'
import { AssetsQuery } from 'generated/graphql.types'

import {
  Asset,
  AssetCollection,
  AssetDetails,
  AssetImageContainer,
  CollectionImageSmall,
  PriceCTA
} from '.'

const NftAssetItem: React.FC<Props> = ({ asset }) => {
  // TODO: FIX LISTINGS
  // const lowestListing = asset.listings
  //   ? asset.listings.sort((a, b) => Number(a?.starting_price) - Number(b?.starting_price))[0]
  //   : null
  const lowestListing = null

  return (
    <Asset key={asset?.token_id}>
      <Flex alignItems='center' gap={8}>
        <LinkContainer to={`/nfts/collection/${asset.collection.slug}`}>
          <Link style={{ display: 'flex' }}>
            <CollectionImageSmall alt='collection' src={asset.collection.image_url || ''} />
          </Link>
        </LinkContainer>
        <AssetCollection>
          <Text style={{ whiteSpace: 'nowrap' }} size='14px' color='grey800' weight={600}>
            {asset?.collection?.name}
          </Text>
        </AssetCollection>
      </Flex>
      <LinkContainer to={`/nfts/asset/${asset.contract?.address}/${asset.token_id}`}>
        <AssetImageContainer background={`url(${asset?.image_url?.replace(/=s\d*/, '')})`} />
      </LinkContainer>
      <AssetDetails>
        <div>
          <Text style={{ marginTop: '4px' }} size='14px' color='black' weight={600}>
            {asset?.name}
          </Text>
        </div>

        <PriceCTA>
          <LinkContainer to={`/nfts/asset/${asset.contract?.address}/${asset.token_id}`}>
            {/* // TODO: FIX LISTINGS */}
            {/* @ts-ignore */}
            {lowestListing && lowestListing.starting_price ? (
              <Button data-e2e='nftAssetPage' nature='empty-blue' small>
                <FormattedMessage id='copy.buy_now' defaultMessage='Buy Now' />
              </Button>
            ) : (
              <Link weight={600}>
                <FormattedMessage id='copy.view_details' defaultMessage='View Details' />
              </Link>
            )}
          </LinkContainer>
          {/* // TODO: FIX LISTINGS */}
          {/* @ts-ignore */}
          {lowestListing && lowestListing.starting_price ? (
            <GreyBlueGradientCartridge>
              {/* // TODO: FIX LISTINGS */}
              <CoinDisplay
                coin={/* lowestListing.payment_token_symbol || */ 'ETH'}
                size='14px'
                weight={600}
              >
                {/* @ts-ignore */}
                {lowestListing.starting_price}
              </CoinDisplay>
            </GreyBlueGradientCartridge>
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
