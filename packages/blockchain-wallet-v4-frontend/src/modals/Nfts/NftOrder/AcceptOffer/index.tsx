import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps, useDispatch } from 'react-redux'

import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import { StickyHeaderWrapper, Title } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { Row, Value } from 'components/Flyout/model'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics } from 'data/types'

import { CTARow, StickyCTA } from '../../components'
import NftAssetHeaderRow from '../../components/NftAssetHeader'
import NftFlyoutFailure from '../../components/NftFlyoutFailure'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import AcceptOfferFees from './fees'
import { getData } from './selectors'

const AcceptOffer: React.FC<Props> = (props) => {
  const { close, data, nftActions } = props
  const dispatch = useDispatch()
  const acceptOfferClicked = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_ACCEPT_OFFER_CLICKED,
        properties: {}
      })
    )
  }
  return (
    <>
      {data.cata({
        Failure: (e) => <NftFlyoutFailure error={e} close={close} />,
        Loading: () => <NftFlyoutLoader />,
        NotAsked: () => <NftFlyoutLoader />,
        Success: (val) => (
          <>
            <StickyHeaderWrapper>
              <FlyoutHeader data-e2e='acceptOffer' mode='back' onClick={() => close()}>
                <FormattedMessage id='copy.accept_offer' defaultMessage='Accept Offer' />
              </FlyoutHeader>
            </StickyHeaderWrapper>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              <div style={{ height: '100%' }}>
                <NftAssetHeaderRow asset={val.asset} />
                <Row>
                  <Flex alignItems='center' justifyContent='space-between'>
                    <Text color='black' weight={600} size='20px'>
                      <FormattedMessage id='copy.offer' defaultMessage='Offer' />
                    </Text>
                    <Flex flexDirection='column' alignItems='flex-end' gap={4}>
                      <CoinDisplay
                        size='20px'
                        color='black'
                        weight={600}
                        coin={val.matchingOrder.buy.paymentTokenContract?.symbol}
                      >
                        {val.matchingOrder.buy.basePrice}
                      </CoinDisplay>
                      <FiatDisplay
                        size='14px'
                        color='grey600'
                        weight={500}
                        coin={val.matchingOrder.buy.paymentTokenContract?.symbol}
                      >
                        {val.matchingOrder.buy.basePrice}
                      </FiatDisplay>
                    </Flex>
                  </Flex>
                </Row>
              </div>
              <StickyCTA>
                <AcceptOfferFees {...props} asset={val.asset} />
                <br />
                {props.orderFlow.fees.cata({
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
                  Success: (fees) => (
                    <Button
                      jumbo
                      nature='primary'
                      fullwidth
                      data-e2e='acceptNftOffer'
                      disabled={props.orderFlow.isSubmitting}
                      type='submit'
                      onClick={() => {
                        acceptOfferClicked()
                        nftActions.acceptOffer({
                          gasData: fees,
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
                })}
              </StickyCTA>
            </div>
          </>
        )
      })}
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const connector = connect(mapStateToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(AcceptOffer)
