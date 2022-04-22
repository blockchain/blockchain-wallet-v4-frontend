import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { CombinedError } from 'urql'

import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import { Button, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import {
  AssetFilterFields,
  AssetSortFields,
  SortDirection,
  useAssetsQuery
} from 'generated/graphql'

import {
  Asset,
  AssetCollection,
  AssetDetails,
  AssetImageContainer,
  PriceCTA
} from '../../components'
import { NftFilterFormValuesType } from '../../NftFilter'
import { getTraitFilters } from '../../utils/NftUtils'

const CollectionItemsResults: React.FC<Props> = ({
  formValues,
  page,
  setIsFetchingNextPage,
  setNextPageFetchError,
  slug
}) => {
  const traits = getTraitFilters(formValues)

  const traitFilter = traits?.reduce((acc, trait) => {
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
        by: formValues.sortBy.split('-')[0] as AssetSortFields,
        direction: formValues.sortBy.split('-')[1] as SortDirection
      }
    : null

  const [result] = useAssetsQuery({
    variables: {
      filter: [{ field: AssetFilterFields.CollectionSlug, value: slug }],
      forSale: !!formValues?.forSale,
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
        const lowestListing = asset.listings
          ? asset.listings.sort((a, b) => Number(a?.starting_price) - Number(b?.starting_price))[0]
          : null

        return asset ? (
          <Asset key={asset?.token_id}>
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
                  {lowestListing && lowestListing.starting_price ? (
                    <Text color='black' style={{ marginTop: '4px', textAlign: 'left' }}>
                      <CoinDisplay
                        size='14px'
                        color='black'
                        weight={600}
                        coin={lowestListing.payment_token?.symbol || 'ETH'}
                      >
                        {lowestListing.starting_price}
                      </CoinDisplay>
                      <FiatDisplay
                        size='12px'
                        color='grey600'
                        weight={600}
                        currency='USD'
                        coin={lowestListing.payment_token?.symbol || 'ETH'}
                      >
                        {lowestListing.starting_price}
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
          </Asset>
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

export default CollectionItemsResults
