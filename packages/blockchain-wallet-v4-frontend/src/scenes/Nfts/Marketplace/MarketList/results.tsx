import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useOpenseaAssetsQuery } from 'blockchain-wallet-v4-frontend/src/generated/graphql'
import styled from 'styled-components'
import { CombinedError } from 'urql'

import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import { Button, Link, Text } from 'blockchain-info-components'

import { Props as OwnProps } from '../..'
import { Asset, AssetCollection, AssetDetails, CTAWrapper, ImageContainer } from '../../components'

const MarketplaceAsset = styled(Asset)``

const ResultsPage: React.FC<Props> = ({ nftsActions, page, setError, setIsFetching, slug }) => {
  const [result] = useOpenseaAssetsQuery({
    variables: {
      collectionSlug: slug,
      limit: NFT_ORDER_PAGE_LIMIT,
      offset: page * NFT_ORDER_PAGE_LIMIT
    }
  })

  useEffect(() => {
    setError(result.error)
  }, [result.error])

  useEffect(() => {
    setIsFetching(result.fetching)
  }, [result.fetching])

  return (
    <>
      {result?.data?.openseaAssets?.map((asset) =>
        asset ? (
          <MarketplaceAsset key={asset?.token_id}>
            <ImageContainer
              background={`url(${asset?.image_original_url?.replace(/=s\d*/, '')})`}
              // backgroundColor={`#${asset?.}` || '#fff'}
            />
            <AssetDetails>
              <div>
                <AssetCollection>
                  <Text style={{ whiteSpace: 'nowrap' }} size='14px' color='grey800' weight={600}>
                    {/* {asset?.collection?.name} */}
                  </Text>
                </AssetCollection>
                <Text style={{ marginTop: '4px' }} size='16px' color='black' weight={600}>
                  {asset?.name}
                </Text>
              </div>
              {/* <PriceInfo>
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
        </PriceInfo> */}
            </AssetDetails>
            <CTAWrapper>
              <Button
                data-e2e='buyNft'
                nature='primary'
                fullwidth
                onClick={() =>
                  nftsActions.nftOrderFlowOpen({
                    asset_contract_address: asset.contract_address!,
                    token_id: asset.token_id!
                  })
                }
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
                href={asset?.permalink || ''}
                target='_blank'
              >
                View on OpenSea
              </Link>
            </CTAWrapper>
          </MarketplaceAsset>
        ) : null
      )}
    </>
  )
}

type Props = {
  nftsActions: OwnProps['nftsActions']
  page: number
  setError: (error: CombinedError | undefined) => void
  setIsFetching: (isFetching: boolean) => void
  slug: string
}

export default ResultsPage
