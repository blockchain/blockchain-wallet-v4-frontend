import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { CombinedError } from 'urql'

import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import { Button, Text } from 'blockchain-info-components'
import { AssetFilterFields, useOwnerQuery } from 'generated/graphql'

import { Asset, AssetCollection, AssetDetails, AssetImageContainer, PriceCTA } from '../components'

const NftAddressResults: React.FC<Props> = ({
  address,
  page,
  setIsFetchingNextPage,
  setNextPageFetchError
}) => {
  const [result] = useOwnerQuery({
    variables: {
      filter: {
        field: AssetFilterFields.OwnerAddress,
        value: address
      },
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
      {result.data?.assets.map((asset) => {
        if (!asset) return null
        return (
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
                <LinkContainer to={`/nfts/${asset.contract?.address}/${asset.token_id}`}>
                  <Button data-e2e='nftAssetPage' nature='primary' small>
                    <FormattedMessage id='copy.view_details' defaultMessage='View Details' />
                  </Button>
                </LinkContainer>
              </PriceCTA>
            </AssetDetails>
          </Asset>
        )
      })}
    </>
  )
}

type Props = {
  address: string
  page: number
  setIsFetchingNextPage: (isFetching: boolean) => void
  setNextPageFetchError: (error: CombinedError | undefined) => void
}

export default NftAddressResults
