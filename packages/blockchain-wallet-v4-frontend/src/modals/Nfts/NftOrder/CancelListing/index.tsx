import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { colors } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'

import { Remote } from '@core'
import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { StickyHeaderWrapper } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { Row } from 'components/Flyout/model'
import { actions } from 'data'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import { StickyCTA } from '../../components'
import NftAssetHeaderRow from '../../components/NftAssetHeader'
import NftFlyoutFailure from '../../components/NftFlyoutFailure'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import CancelListingFees from './fees'

const CancelListing: React.FC<Props> = (props) => {
  const { close, nftActions, openSeaAssetR, orderFlow } = props
  const { listingToCancel } = orderFlow

  const openSeaAsset = useRemote(() => openSeaAssetR)
  const dispatch = useDispatch()
  const cancelListingClicked = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_CANCEL_LISTING_CLICKED,
        properties: {}
      })
    )
  }
  const disabled = Remote.Loading.is(orderFlow.fees) || props.orderFlow.isSubmitting
  if (openSeaAsset.isLoading) return <NftFlyoutLoader />
  if (openSeaAsset.error)
    return <NftFlyoutFailure error={openSeaAsset.error || ''} close={props.close} />

  const val = openSeaAsset.data

  if (!val) return <NftFlyoutFailure error='Error fetching asset data.' close={props.close} />

  return (
    <>
      <StickyHeaderWrapper>
        <FlyoutHeader data-e2e='cancelListing' mode='back' onClick={() => close()}>
          <FormattedMessage id='copy.cancel_listing' defaultMessage='Cancel Listing' />
        </FlyoutHeader>
      </StickyHeaderWrapper>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <NftAssetHeaderRow asset={val} />
        <StickyCTA>
          <CancelListingFees {...props} />
          <br />
          {orderFlow.fees.cata({
            Failure: () => (
              <Text size='14px' weight={600}>
                <FormattedMessage
                  id='copy.no_active_listings'
                  defaultMessage='Error. You may not have any active listings for this asset.'
                />
              </Text>
            ),
            Loading: () => null,
            NotAsked: () => null,
            Success: (val) =>
              listingToCancel ? (
                <Button
                  jumbo
                  nature='primary'
                  fullwidth
                  data-e2e='cancelListingNft'
                  disabled={disabled}
                  onClick={() => {
                    cancelListingClicked()
                    nftActions.cancelListing({ gasData: val, order: listingToCancel })
                  }}
                >
                  {props.orderFlow.isSubmitting ? (
                    <HeartbeatLoader color='blue100' height='20px' width='20px' />
                  ) : (
                    <FormattedMessage id='copy.cancel_listing' defaultMessage='Cancel Listing' />
                  )}
                </Button>
              ) : (
                <Text size='14px' weight={600}>
                  <FormattedMessage
                    id='copy.no_active_listings'
                    defaultMessage='Error. You may not have any active listings for this asset.'
                  />
                </Text>
              )
          })}
        </StickyCTA>
      </div>
      )
    </>
  )
}

type Props = OwnProps

export default CancelListing
