import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps, useDispatch } from 'react-redux'

import { Remote } from '@core'
import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import FlyoutHeader from 'components/Flyout/Header'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import { NftFlyoutRow, StickyCTA } from '../../components'
import NftAssetHeaderRow from '../../components/NftAssetHeader'
import NftFlyoutFailure from '../../components/NftFlyoutFailure'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import AcceptOfferFees from './fees'
import { getData } from './selectors'

const AcceptOffer: React.FC<Props> = (props) => {
  const { close, isInvited, nftActions, openSeaAssetR, orderFlow } = props
  const dispatch = useDispatch()
  const acceptOfferClicked = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_ACCEPT_OFFER_CLICKED,
        properties: {}
      })
    )
  }

  const openSeaAsset = useRemote(() => openSeaAssetR)

  const disabled = Remote.Loading.is(orderFlow.fees) || props.orderFlow.isSubmitting
  if (openSeaAsset.isLoading) return <NftFlyoutLoader close={props.close} />
  if (openSeaAsset.error)
    return <NftFlyoutFailure error={openSeaAsset.error || ''} close={props.close} />

  const asset = openSeaAsset.data

  if (!asset) return <NftFlyoutFailure error='Error fetching asset data.' close={props.close} />
  return (
    <>
      <FlyoutHeader sticky data-e2e='acceptOffer' mode='back' onClick={() => close()}>
        <FormattedMessage id='copy.accept_offer' defaultMessage='Accept Offer' />
      </FlyoutHeader>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div style={{ height: '100%' }}>
          <NftAssetHeaderRow asset={asset} />
          <NftFlyoutRow>
            <Flex alignItems='center' justifyContent='space-between'>
              <Text color='black' weight={600} size='20px'>
                <FormattedMessage id='copy.offer' defaultMessage='Offer' />
              </Text>
              <Flex flexDirection='column' alignItems='flex-end' gap={4}>
                <CoinDisplay
                  size='20px'
                  color='black'
                  weight={600}
                  coin={orderFlow.orderToMatch?.payment_token_contract?.symbol}
                >
                  {orderFlow.orderToMatch?.current_price}
                </CoinDisplay>
                <FiatDisplay
                  size='14px'
                  color='grey600'
                  weight={500}
                  coin={orderFlow.orderToMatch?.payment_token_contract?.symbol}
                >
                  {orderFlow.orderToMatch?.current_price}
                </FiatDisplay>
              </Flex>
            </Flex>
          </NftFlyoutRow>
        </div>
        <StickyCTA>
          <AcceptOfferFees {...props} asset={asset} />
          <br />
          {isInvited ? (
            props.data.cata({
              Failure: (e) => (
                <>
                  <Text
                    size='14px'
                    weight={600}
                    style={{ marginBottom: '8px', maxHeight: '200px' }}
                  >
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
                      gasData: val.fees,
                      ...val.matchingOrder
                    })
                  }}
                >
                  {props.orderFlow.isSubmitting ? (
                    <HeartbeatLoader color='blue100' height='20px' width='20px' />
                  ) : (
                    <FormattedMessage id='copy.accept_offer' defaultMessage='Accept Offer' />
                  )}
                </Button>
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
      </div>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const connector = connect(mapStateToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(AcceptOffer)
