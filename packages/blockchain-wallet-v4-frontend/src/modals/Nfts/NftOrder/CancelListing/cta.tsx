import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { Remote } from '@core'
import { NftAsset } from '@core/network/api/nfts/types'
import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { Analytics } from 'data/types'

import NftNotInvited from '../../components/NftNotInvited'
import PendingEthTxMessage from '../../components/PendingEthTxMessage'
import { Props as OwnProps } from '..'

const CTA: React.FC<Props> = ({ asset, isInvited, nftActions, orderFlow }) => {
  const { seaportOrder, userHasPendingTxR } = orderFlow

  const dispatch = useDispatch()
  const cancelListingClicked = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_CANCEL_LISTING_CLICKED,
        properties: {}
      })
    )
  }

  const userHasPendingTx = userHasPendingTxR.getOrElse(false)

  const disabled = Remote.Loading.is(orderFlow.fees) || orderFlow.isSubmitting

  if (!isInvited) {
    return <NftNotInvited />
  }

  if (userHasPendingTx) {
    return <PendingEthTxMessage />
  }

  return (
    <>
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
          seaportOrder ? (
            <Button
              jumbo
              nature='primary'
              fullwidth
              data-e2e='cancelListingNft'
              disabled={disabled}
              onClick={() => {
                cancelListingClicked()
                nftActions.cancelListing({ asset, gasData: val, order: seaportOrder })
              }}
            >
              {orderFlow.isSubmitting ? (
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
    </>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default CTA
