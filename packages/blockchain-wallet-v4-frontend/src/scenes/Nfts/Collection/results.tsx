import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'
import { CombinedError } from 'urql'

import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import { Button, Link, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { AssetFields, useAssetsQuery } from 'generated/graphql'

import {
  Asset,
  AssetCollection,
  AssetDetails,
  AssetImageContainer,
  CTAWrapper,
  PriceCTA,
  StyledCoinDisplay
} from '../components'

const MarketplaceAsset = styled(Asset)``

const ResultsPage: React.FC<Props> = ({
  isBuyNow,
  page,
  setIsFetchingNextPage,
  setNextPageFetchError,
  slug
}) => {
  const [result] = useAssetsQuery({
    variables: {
      filter: [{ field: AssetFields.CollectionSlug, value: slug }],
      forSale: !!isBuyNow,
      limit: NFT_ORDER_PAGE_LIMIT,
      offset: page * NFT_ORDER_PAGE_LIMIT
    }
  })

  useEffect(() => {
    setNextPageFetchError(result.error)
  }, [result.error])

  useEffect(() => {
    setIsFetchingNextPage(result.fetching)
  }, [result.fetching])

  return (
    <>
      {result?.data?.assets?.map((asset) => {
        return asset ? (
          <MarketplaceAsset key={asset?.token_id}>
            <LinkContainer to={`/nfts/${asset.contract?.address}/${asset.token_id}`}>
              <AssetImageContainer
                background={`url(${asset?.image_url?.replace(/=s\d*/, '')})`}
                // backgroundColor={`#${asset?.}` || '#fff'}
              />
            </LinkContainer>
            <AssetDetails>
              <div>
                <AssetCollection>
                  <Text style={{ whiteSpace: 'nowrap' }} size='14px' color='grey800' weight={600}>
                    {asset?.collection?.name}
                  </Text>
                </AssetCollection>
                <Text style={{ marginTop: '4px' }} size='16px' color='black' weight={600}>
                  {asset?.name}
                </Text>
              </div>

              <PriceCTA>
                <div>
                  <Text size='12px' color='black' weight={600}>
                    <FormattedMessage id='copy.price' defaultMessage='Price' />
                  </Text>
                  {isBuyNow ? (
                    <Text color='black' style={{ display: 'flex', marginTop: '4px' }}>
                      {/* <StyledCoinDisplay
                        size='14px'
                        color='black'
                        weight={600}
                        coin={asset.events[0].payment_token?.symbol}
                      >
                        {asset.events[0].starting_price}
                      </StyledCoinDisplay>
                      &nbsp;-&nbsp;
                      <FiatDisplay
                        size='12px'
                        color='grey600'
                        weight={600}
                        currency='USD'
                        coin={asset.events[0].payment_token?.symbol}
                      >
                        {asset.events[0].starting_price}
                      </FiatDisplay> */}
                    </Text>
                  ) : (
                    <Text
                      size='12px'
                      color='grey600'
                      weight={600}
                      style={{ display: 'flex', marginBottom: '4px', marginTop: '6px' }}
                    >
                      <FormattedMessage
                        id='copy.not_for_sale'
                        defaultMessage='This asset is not for sale.'
                      />
                      <TooltipHost id='tooltip.nft_asset_not_for_sale'>
                        <TooltipIcon name='question-in-circle-filled' />
                      </TooltipHost>
                    </Text>
                  )}
                </div>
                <LinkContainer to={`/nfts/${asset.contract?.address}/${asset.token_id}`}>
                  <Button data-e2e='nftAssetPage' nature='primary' small>
                    <FormattedMessage id='copy.view_details' defaultMessage='View Details' />
                  </Button>
                </LinkContainer>
              </PriceCTA>
            </AssetDetails>
            <CTAWrapper>
              <Link
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  marginTop: '14px',
                  textAlign: 'center',
                  width: '100%'
                }}
                size='11px'
                href={asset?.permalink || ''}
                target='_blank'
              >
                View on OpenSea
              </Link>
            </CTAWrapper>
          </MarketplaceAsset>
        ) : null
      })}
    </>
  )
}

type Props = {
  isBuyNow: boolean
  page: number
  setIsFetchingNextPage: (isFetching: boolean) => void
  setNextPageFetchError: (error: CombinedError | undefined) => void
  slug: string
}

export default ResultsPage
