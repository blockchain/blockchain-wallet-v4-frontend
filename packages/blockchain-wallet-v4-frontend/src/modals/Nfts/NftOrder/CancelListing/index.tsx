import React from 'react'
import { FormattedMessage } from 'react-intl'
import { colors } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'
import { useRemote } from 'hooks'

import { Remote } from '@core'
import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { StickyHeaderWrapper } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { Row } from 'components/Flyout/model'
import { selectors } from 'data'

import { StickyCTA } from '../../components'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import CancelListingFees from './fees'

const CancelListing: React.FC<Props> = (props) => {
  const { close, nftActions, orderFlow } = props
  const { listingToCancel } = orderFlow
  const openSeaAsset = useRemote(selectors.components.nfts.getOpenSeaAsset)

  const sellOrders =
    openSeaAsset.data?.orders?.filter((x) => {
      return x.side === 1
    }) || []
  const lowest_order = sellOrders.sort((a, b) =>
    new BigNumber(a.base_price).isLessThan(b.base_price) ? -1 : 1
  )[0]
  const disabled = Remote.Loading.is(orderFlow.fees) || props.orderFlow.isSubmitting

  return (
    <>
      {orderFlow.asset.cata({
        Failure: (e) => <Text>{e}</Text>,
        Loading: () => <NftFlyoutLoader />,
        NotAsked: () => <NftFlyoutLoader />,
        Success: (val) => (
          <>
            <StickyHeaderWrapper>
              <FlyoutHeader data-e2e='wrapEthHeader' mode='back' onClick={() => close()}>
                <FormattedMessage
                     id='copy.cancel_listing'
                     defaultMessage='Cancel Listing'
                 />
              </FlyoutHeader>
            </StickyHeaderWrapper>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              <Row>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex' }}>
                    <img
                      style={{
                        borderRadius: '8px',
                        height: '64px',
                        marginRight: '12px',
                        width: 'auto'
                      }}
                      alt='nft-asset'
                      src={val.image_url.replace(/=s\d*/, '')}
                    />
                    <div>
                      <Text size='16px' color='grey900' weight={600}>
                        {val?.name}
                      </Text>
                      {val.collection.safelist_request_status === 'verified' ? (
                        <Text
                          size='14px'
                          weight={600}
                          color='green600'
                          style={{
                            background: colors.green100,
                            borderRadius: '8px',
                            padding: '5px 8px',
                            textAlign: 'center',
                            width: 'fit-content'
                          }}
                        >
                          Verified
                        </Text>
                      ) : (
                        <Text
                          size='14px'
                          weight={600}
                          color='orange600'
                          style={{
                            background: colors.orange100,
                            borderRadius: '8px',
                            padding: '5px 8px',
                            textAlign: 'center',
                            width: 'fit-content'
                          }}
                        >
                          Not Verified
                        </Text>
                      )}
                    </div>
                  </div>
                  {lowest_order?.base_price && (
                    <Text
                      style={{
                        justifyContent: 'right'
                      }}
                    >
                      <CoinDisplay
                        size='14px'
                        color='black'
                        weight={600}
                        coin='ETH'
                        style={{ justifyContent: 'right' }}
                      >
                        {lowest_order?.base_price}
                      </CoinDisplay>
                      <FiatDisplay
                        size='14px'
                        color={colors.grey600}
                        weight={600}
                        coin='ETH'
                        style={{ justifyContent: 'right' }}
                      >
                        {lowest_order?.base_price}
                      </FiatDisplay>
                    </Text>
                  )}
                </div>
              </Row>
              <Row>
                <CancelListingFees {...props} />
              </Row>
              <StickyCTA>
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
                        onClick={() =>
                          nftActions.cancelListing({ gasData: val, order: listingToCancel })
                        }
                      >
                        {props.orderFlow.isSubmitting ? (
                          <HeartbeatLoader color='blue100' height='20px' width='20px' />
                        ) : (
                          <FormattedMessage
                            id='copy.cancel_listing'
                            defaultMessage='Cancel Listing'
                          />
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
          </>
        )
      })}
    </>
  )
}

type Props = OwnProps

export default CancelListing
