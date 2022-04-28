import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { CombinedError } from 'urql'

import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import { Button, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { EventSortFields, useFirehoseQuery } from 'generated/graphql'
import { EventFilterFields, SortDirection } from 'generated/graphql.types'

import { Asset, AssetCollection, AssetDetails, AssetImageContainer, PriceCTA } from '../components'
import { NftFilterFormValuesType } from '../NftFilter'

const NftFirehoseResults: React.FC<Props> = ({
  page,
  setIsFetchingNextPage,
  setMaxItemsFetched,
  setNextPageFetchError
}) => {
  const [result] = useFirehoseQuery({
    variables: {
      limit: NFT_ORDER_PAGE_LIMIT,
      offset: page * NFT_ORDER_PAGE_LIMIT,
      sort: { by: EventSortFields.CreatedDate, direction: SortDirection.Desc }
    }
  })

  useEffect(() => {
    setNextPageFetchError(result.error)
  }, [result.error])

  useEffect(() => {
    setIsFetchingNextPage(result.fetching)
  }, [result.fetching])

  useEffect(() => {
    if (result.data?.events.length !== undefined) {
      setMaxItemsFetched(result.data.events.length < NFT_ORDER_PAGE_LIMIT)
    }
  }, [result.data?.events?.length, setMaxItemsFetched])

  return (
    <>
      {result?.data?.events?.map((event) => {
        const lowestListing = event.asset?.listings
          ? event.asset?.listings.sort(
              (a, b) => Number(a?.starting_price) - Number(b?.starting_price)
            )[0]
          : null

        return event.asset ? (
          <Asset key={event.asset.token_id}>
            <LinkContainer
              to={`/nfts/asset/${event.asset.contract?.address}/${event.asset.token_id}`}
            >
              <AssetImageContainer
                background={`url(${event.asset.image_url?.replace(/=s\d*/, '')})`}
              />
            </LinkContainer>
            <AssetDetails>
              <div>
                <AssetCollection>
                  <Text style={{ whiteSpace: 'nowrap' }} size='14px' color='grey800' weight={600}>
                    {event.asset.collection?.name}
                  </Text>
                </AssetCollection>
                <Text style={{ marginTop: '4px' }} size='16px' color='black' weight={600}>
                  {event.asset.name}
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
                        coin={lowestListing.payment_token_symbol || 'ETH'}
                      >
                        {lowestListing.starting_price}
                      </CoinDisplay>
                      <FiatDisplay
                        size='12px'
                        color='grey600'
                        weight={600}
                        currency='USD'
                        coin={lowestListing.payment_token_symbol || 'ETH'}
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
                <LinkContainer
                  to={`/nfts/asset/${event.asset.contract?.address}/${event.asset.token_id}`}
                >
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
  setMaxItemsFetched: (maxItemsFetched: boolean) => void
  setNextPageFetchError: (error: CombinedError | undefined) => void
  slug: string
}

export default NftFirehoseResults
