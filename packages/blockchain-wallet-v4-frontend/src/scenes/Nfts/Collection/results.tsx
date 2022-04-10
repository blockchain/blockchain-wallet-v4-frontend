import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'
import { CombinedError } from 'urql'

import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import { Button, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { AssetFields, SortDirection, useAssetsQuery } from 'generated/graphql'

import {
  Asset,
  AssetCollection,
  AssetDetails,
  AssetImageContainer,
  PriceCTA,
  StyledCoinDisplay
} from '../components'
import { NftFilterFormValuesType } from '.'

const MarketplaceAsset = styled(Asset)``

const ResultsPage: React.FC<Props> = ({
  formValues,
  page,
  setIsFetchingNextPage,
  setNextPageFetchError,
  slug
}) => {
  const traits = formValues
    ? Object.keys(formValues).filter((key) => key !== 'min' && key !== 'max')
    : []

  const traitFilter = traits.reduce((acc, trait) => {
    Object.keys(formValues[trait]).map((value) => {
      if (formValues[trait][value]) {
        acc.push({ trait_type: trait, value })
      }

      return acc
    })

    return acc
  }, [] as { trait_type: string; value: string }[])

  const sort = formValues?.sortBy
    ? {
        by: formValues.sortBy.split('-')[0] as AssetFields,
        direction: formValues.sortBy.split('-')[1] as SortDirection
      }
    : null

  const [result] = useAssetsQuery({
    variables: {
      filter: [{ field: AssetFields.CollectionSlug, value: slug }],
      forSale: !!formValues?.forSale || formValues?.sortBy?.includes('price'),
      limit: NFT_ORDER_PAGE_LIMIT,
      offset: page * NFT_ORDER_PAGE_LIMIT,
      sort,
      traitFilter
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
              <AssetImageContainer background={`url(${asset?.image_url?.replace(/=s\d*/, '')})`} />
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
                  {asset.listing && asset.listing.total_price ? (
                    <Text color='black' style={{ display: 'flex', marginTop: '4px' }}>
                      <StyledCoinDisplay
                        size='14px'
                        color='black'
                        weight={600}
                        coin={asset.listing.payment_token_symbol}
                      >
                        {asset.listing.total_price}
                      </StyledCoinDisplay>
                      &nbsp;-&nbsp;
                      <FiatDisplay
                        size='12px'
                        color='grey600'
                        weight={600}
                        currency='USD'
                        coin={asset.listing.payment_token_symbol}
                      >
                        {asset.listing.total_price}
                      </FiatDisplay>
                    </Text>
                  ) : (
                    <Text
                      size='12px'
                      color='grey600'
                      weight={600}
                      style={{ display: 'flex', marginBottom: '4px', marginTop: '6px' }}
                    >
                      <FormattedMessage id='copy.not_for_sale' defaultMessage='Not for sale' />
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
          </MarketplaceAsset>
        ) : null
      })}
    </>
  )
}

type Props = {
  formValues: NftFilterFormValuesType
  page: number
  setIsFetchingNextPage: (isFetching: boolean) => void
  setNextPageFetchError: (error: CombinedError | undefined) => void
  slug: string
}

export default ResultsPage
