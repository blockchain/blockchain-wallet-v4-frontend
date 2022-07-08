import React from 'react'
import { FormattedMessage } from 'react-intl'
<<<<<<< Updated upstream
import { useDispatch } from 'react-redux'

import { Remote } from '@core'
import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
=======
import { getIsSharedStorefront } from 'blockchain-wallet-v4-frontend/src/scenes/Nfts/utils/NftUtils'

import { OPENSEA_SHARED_MARKETPLACE_RINKEBY } from '@core/redux/payment/nfts/constants'
import { Text } from 'blockchain-info-components'
>>>>>>> Stashed changes
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import FlyoutHeader from 'components/Flyout/Header'
import { actions } from 'data'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import { NftFlyoutRow, StickyCTA } from '../../components'
import NftAssetHeaderRow from '../../components/NftAssetHeader'
import NftFlyoutFailure from '../../components/NftFlyoutFailure'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import CancelOfferFees from './fees'

const CancelOffer: React.FC<Props> = (props) => {
<<<<<<< Updated upstream
  const { close, isInvited, nftActions, openSeaAssetR, orderFlow } = props
  const { offerToCancel } = orderFlow
=======
  const { close, openSeaAssetR, orderFlow } = props
  const { seaportOrder, wyvernOrder } = orderFlow
>>>>>>> Stashed changes

  const disabled = Remote.Loading.is(orderFlow.fees) || props.orderFlow.isSubmitting
  const dispatch = useDispatch()
  const cancelOfferClicked = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_CANCEL_OFFER_CLICKED,
        properties: {}
      })
    )
  }

  const openSeaAsset = useRemote(() => openSeaAssetR)
  if (openSeaAsset.isLoading) return <NftFlyoutLoader close={props.close} />
  if (openSeaAsset.error)
    return <NftFlyoutFailure error={openSeaAsset.error || ''} close={props.close} />

  const val = openSeaAsset.data

  if (!val) return <NftFlyoutFailure error='Error fetching asset data.' close={props.close} />

  const IS_SHARED_STOREFRONT = getIsSharedStorefront(asset)

  return (
    <>
      <FlyoutHeader sticky data-e2e='cancelOffer' mode='back' onClick={() => close()}>
        <FormattedMessage id='copy.cancel_offer' defaultMessage='Cancel Offer' />
      </FlyoutHeader>
      <div style={{ height: '100%' }}>
        <NftAssetHeaderRow asset={val} />
        <NftFlyoutRow>
          <Flex alignItems='center' justifyContent='space-between'>
            <Text color='black' weight={600} size='20px'>
              <FormattedMessage id='copy.offer' defaultMessage='Offer' />
            </Text>
            <Flex flexDirection='column' alignItems='flex-end' gap={4}>
              {/* TODO: SEAPORT */}
              <CoinDisplay size='14px' color='black' weight={600} coin='WETH'>
                {IS_SHARED_STOREFRONT && wyvernOrder
                  ? wyvernOrder.current_price
                  : seaportOrder?.current_price}
              </CoinDisplay>
              {/* TODO: SEAPORT */}
              <FiatDisplay size='12px' color='grey600' weight={600} coin='WETH'>
                {IS_SHARED_STOREFRONT && wyvernOrder
                  ? wyvernOrder.current_price
                  : seaportOrder?.current_price}
              </FiatDisplay>
            </Flex>
          </Flex>
        </NftFlyoutRow>
      </div>
      <StickyCTA>
        <CancelOfferFees {...props} asset={asset} />
        <br />
        {isInvited ? (
          orderFlow.fees.cata({
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
              offerToCancel ? (
                <Button
                  jumbo
                  nature='primary'
                  fullwidth
                  data-e2e='cancelOfferNft'
                  disabled={disabled}
                  onClick={() => {
                    cancelOfferClicked()
                    nftActions.cancelOffer({
                      asset: val,
                      gasData,
                      order: offerToCancel
                    })
                  }}
                >
                  {props.orderFlow.isSubmitting ? (
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
          })
        ) : (
          <Link href='https://www.blockchain.com/waitlist/nft' target='_blank'>
            <Button jumbo nature='primary' fullwidth data-e2e='joinWaitlist'>
              <FormattedMessage id='copy.join_waitlist' defaultMessage='Join the Waitlist' />
            </Button>
          </Link>
        )}
      </StickyCTA>
    </>
  )
}

type Props = OwnProps

export default CancelOffer
