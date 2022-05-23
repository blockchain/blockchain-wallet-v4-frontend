import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { Remote } from '@core'
import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import { Row } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { actions } from 'data'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import { StickyCTA } from '../../components'
import NftAssetHeaderRow from '../../components/NftAssetHeader'
import NftFlyoutFailure from '../../components/NftFlyoutFailure'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import CancelOfferFees from './fees'

const CancelOffer: React.FC<Props> = (props) => {
  const { close, isInvited, nftActions, openSeaAssetR, orderFlow } = props
  const { offerToCancel } = orderFlow

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
  if (openSeaAsset.isLoading) return <NftFlyoutLoader />
  if (openSeaAsset.error)
    return <NftFlyoutFailure error={openSeaAsset.error || ''} close={props.close} />

  const val = openSeaAsset.data

  if (!val) return <NftFlyoutFailure error='Error fetching asset data.' close={props.close} />

  return (
    <>
      <FlyoutHeader sticky data-e2e='cancelOffer' mode='back' onClick={() => close()}>
        <FormattedMessage id='copy.cancel_offer' defaultMessage='Cancel Offer' />
      </FlyoutHeader>
      <div style={{ height: '100%' }}>
        <NftAssetHeaderRow asset={val} />
        <Row>
          <Flex alignItems='center' justifyContent='space-between'>
            <Text color='black' weight={600} size='20px'>
              <FormattedMessage id='copy.offer' defaultMessage='Offer' />
            </Text>
            <Flex flexDirection='column' alignItems='flex-end' gap={4}>
              <CoinDisplay
                size='14px'
                color='black'
                weight={600}
                coin={offerToCancel?.payment_token_contract?.symbol}
              >
                {offerToCancel?.current_price}
              </CoinDisplay>
              <FiatDisplay
                size='12px'
                color='grey600'
                weight={600}
                coin={offerToCancel?.payment_token_contract?.symbol}
              >
                {offerToCancel?.current_price}
              </FiatDisplay>
            </Flex>
          </Flex>
        </Row>
      </div>
      <StickyCTA>
        <CancelOfferFees {...props} />
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
