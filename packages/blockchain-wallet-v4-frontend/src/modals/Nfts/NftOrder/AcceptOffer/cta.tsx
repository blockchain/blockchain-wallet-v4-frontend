import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { getIsSharedStorefront } from 'blockchain-wallet-v4-frontend/src/scenes/Nfts/utils/NftUtils'

import { Remote } from '@core'
import { NftAsset } from '@core/network/api/nfts/types'
import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { Analytics } from 'data/types'

import NftNotInvited from '../../components/NftNotInvited'
import PendingEthTxMessage from '../../components/PendingEthTxMessage'
import { Props as OwnProps } from '.'

const CTA: React.FC<Props> = ({ asset, data_LEGACY, isInvited, nftActions, orderFlow }) => {
  const { userHasPendingTxR } = orderFlow
  const IS_SHARED_STOREFRONT = getIsSharedStorefront(asset)

  const dispatch = useDispatch()
  const acceptOfferClicked = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_ACCEPT_OFFER_CLICKED,
        properties: {}
      })
    )
  }

  const disabled = Remote.Loading.is(orderFlow.fees) || orderFlow.isSubmitting
  const userHasPendingTx = userHasPendingTxR.getOrElse(false)

  if (!isInvited) {
    return <NftNotInvited />
  }

  if (userHasPendingTx) {
    return <PendingEthTxMessage />
  }

  if (IS_SHARED_STOREFRONT) {
    return (
      <>
        {data_LEGACY.cata({
          Failure: (e) => (
            <>
              <Text size='14px' weight={600} style={{ marginBottom: '8px', maxHeight: '200px' }}>
                {e}
              </Text>
              <Button jumbo nature='sent' fullwidth data-e2e='n/a' disabled>
                <FormattedMessage id='copy.accept_offer' defaultMessage='Accept Offer' />
              </Button>
            </>
          ),
          Loading: () => (
            <Button jumbo nature='primary' fullwidth data-e2e='n/a' disabled>
              <FormattedMessage id='copy.accept_offer' defaultMessage='Accept Offer' />
            </Button>
          ),
          NotAsked: () => null,
          Success: (val) => (
            <Button
              jumbo
              nature='primary'
              fullwidth
              data-e2e='acceptNftOffer'
              disabled={disabled}
              type='submit'
              onClick={() => {
                acceptOfferClicked()
                nftActions.acceptOffer_LEGACY({
                  asset,
                  gasData: val.fees,
                  ...val.matchingOrder_LEGACY
                })
              }}
            >
              {orderFlow.isSubmitting ? (
                <HeartbeatLoader color='blue100' height='20px' width='20px' />
              ) : (
                <FormattedMessage id='copy.accept_offer' defaultMessage='Accept Offer' />
              )}
            </Button>
          )
        })}
      </>
    )
  }

  return (
    <>
      {orderFlow.fees.cata({
        Failure: (e) => (
          <>
            <Text size='14px' weight={600} style={{ marginBottom: '8px', maxHeight: '200px' }}>
              {e}
            </Text>
            <Button jumbo nature='sent' fullwidth data-e2e='n/a' disabled>
              <FormattedMessage id='copy.accept_offer' defaultMessage='Accept Offer' />
            </Button>
          </>
        ),
        Loading: () => (
          <Button jumbo nature='primary' fullwidth data-e2e='n/a' disabled>
            <FormattedMessage id='copy.accept_offer' defaultMessage='Accept Offer' />
          </Button>
        ),
        NotAsked: () => null,
        Success: (val) => (
          <Button
            jumbo
            nature='primary'
            fullwidth
            data-e2e='acceptNftOffer'
            disabled={disabled}
            type='submit'
            onClick={() => {
              acceptOfferClicked()
              nftActions.acceptOffer({
                asset,
                gasData: val,
                seaportOrder: orderFlow.seaportOrder!
              })
            }}
          >
            {orderFlow.isSubmitting ? (
              <HeartbeatLoader color='blue100' height='20px' width='20px' />
            ) : (
              <FormattedMessage id='copy.accept_offer' defaultMessage='Accept Offer' />
            )}
          </Button>
        )
      })}
    </>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default CTA
