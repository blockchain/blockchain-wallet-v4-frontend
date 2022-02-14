import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { CombinedError } from 'urql'

import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import { Button, Link, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { useAssetsQuery } from 'generated/graphql'

import { Props as OwnProps } from '..'
import {
  Asset,
  AssetCollection,
  AssetDetails,
  AssetImageContainer,
  CTAWrapper,
  PriceInfo,
  StyledCoinDisplay
} from '../components'

const MarketplaceAsset = styled(Asset)``

const ResultsPage: React.FC<Props> = ({
  defaultEthAddr,
  nftsActions,
  page,
  setIsFetchingNextPage,
  setNextPageFetchError,
  slug
}) => {
  const [result] = useAssetsQuery({
    variables: {
      eventsFilter: {
        event_type: 'created'
      },
      filter: {
        collection_slug: slug
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
      {result?.data?.assets?.map((asset) => {
        const walletUserIsAssetOwnerHack =
          asset?.owner_address?.toLowerCase() === defaultEthAddr.toLowerCase()

        return asset ? (
          <MarketplaceAsset key={asset?.token_id}>
            <AssetImageContainer
              onClick={() =>
                nftsActions.nftOrderFlowOpen({
                  asset_contract_address: asset.contract_address!,
                  token_id: asset.token_id!,
                  walletUserIsAssetOwnerHack
                })
              }
              background={`url(${asset?.image_url?.replace(/=s\d*/, '')})`}
              // backgroundColor={`#${asset?.}` || '#fff'}
            />
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

              <PriceInfo>
                <Text size='12px' color='black' weight={600}>
                  <FormattedMessage id='copy.price' defaultMessage='Price' />
                </Text>
                {asset?.events && asset.events[0] ? (
                  <Text color='black' style={{ display: 'flex', marginTop: '4px' }}>
                    <StyledCoinDisplay
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
                      coin={asset.events[0].payment_token?.symbol}
                    >
                      {asset.events[0].starting_price}
                    </FiatDisplay>
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
              </PriceInfo>
            </AssetDetails>
            <CTAWrapper>
              <Button
                data-e2e='openNftFlow'
                nature='primary'
                fullwidth
                onClick={() =>
                  nftsActions.nftOrderFlowOpen({
                    asset_contract_address: asset.contract_address!,
                    token_id: asset.token_id!,
                    walletUserIsAssetOwnerHack
                  })
                }
              >
                {asset?.events &&
                asset.events[0] &&
                asset?.events &&
                asset.events[0].event_type === 'created' ? (
                  <FormattedMessage id='copy.buy' defaultMessage='Buy' />
                ) : (
                  <FormattedMessage id='copy.make_an_offer' defaultMessage='Make an Offer' />
                )}
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
      })}
    </>
  )
}

type Props = {
  defaultEthAddr: string
  nftsActions: OwnProps['nftsActions']
  page: number
  setIsFetchingNextPage: (isFetching: boolean) => void
  setNextPageFetchError: (error: CombinedError | undefined) => void
  slug: string
}

export default ResultsPage
