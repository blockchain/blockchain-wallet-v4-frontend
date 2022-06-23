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
  const { seaportOffer, userHasPendingTxR } = orderFlow
  const userHasPendingTx = userHasPendingTxR.getOrElse(false)

  const disabled = Remote.Loading.is(orderFlow.fees) || orderFlow.isSubmitting

  const dispatch = useDispatch()
  const cancelOfferClicked = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_CANCEL_OFFER_CLICKED,
        properties: {}
      })
    )
  }

  if (!isInvited) return <NftNotInvited />

  if (userHasPendingTx) {
    return (
      <>
        <PendingEthTxMessage />
        <br />
        <Button jumbo nature='primary' fullwidth data-e2e='cancelOfferNft' disabled={disabled}>
          <FormattedMessage id='copy.cancel_offer' defaultMessage='Cancel Offer' />
        </Button>
      </>
    )
  }

  return (
    <div>
      {orderFlow.fees.cata({
        Failure: () => (
          <Text size='14px' weight={600}>
            <FormattedMessage
              id='copy.no_active_offers'
              defaultMessage='Error. You may have already cancelled this offer, or it has expired.'
            />
          </Text>
        ),
        Loading: () => null,
        NotAsked: () => null,
        Success: (gasData) =>
          seaportOffer ? (
            <Button
              jumbo
              nature='primary'
              fullwidth
              data-e2e='cancelOfferNft'
              disabled={disabled}
              onClick={() => {
                cancelOfferClicked()
                nftActions.cancelOffer({
                  asset,
                  gasData,
                  offer: seaportOffer
                })
              }}
            >
              {orderFlow.isSubmitting ? (
                <HeartbeatLoader color='blue100' height='20px' width='20px' />
              ) : (
                <FormattedMessage id='copy.cancel_offer' defaultMessage='Cancel Offer' />
              )}
            </Button>
          ) : (
            <Text size='14px' weight={600}>
              <FormattedMessage
                id='copy.no_active_offers'
                defaultMessage='Error. You may have already cancelled this offer, or it has expired.'
              />
            </Text>
          )
      })}
    </div>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default CTA
