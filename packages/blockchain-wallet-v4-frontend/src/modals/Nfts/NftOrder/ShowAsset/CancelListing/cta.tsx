import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Remote } from '@core'
import { displayCoinToCoin } from '@core/exchange'
import { NftAsset } from '@core/network/api/nfts/types'
import { Button, SpinningLoader, Text } from 'blockchain-info-components'
import { Title } from 'components/Flyout/model'

import { Props as OwnProps } from '../..'

const CTA: React.FC<Props> = (props) => {
  const { cancelListing, nftActions, orderFlow } = props

  return (
    <>
      <Title>
        {Remote.Loading.is(cancelListing) ? (
          <SpinningLoader width='11px' height='11px' borderWidth='3px' />
        ) : (
          <FormattedMessage id='copy.active_listings:' defaultMessage='Active Listings:' />
        )}
      </Title>
      <br />
      {orderFlow.fees.cata({
        Failure: () => (
          <Text size='14px' weight={600}>
            <FormattedMessage
              id='copy.no_active_sell_listings'
              defaultMessage='Error. You may not have any active listings on this asset.'
            />
          </Text>
        ),
        Loading: () => null,
        NotAsked: () => null,
        Success: (val) => {
          return (
            <>
              {props.asset.sell_orders?.length ? (
                props.asset.sell_orders?.map((sell_order) => {
                  return (
                    <Button
                      style={{ marginBottom: '8px' }}
                      key={sell_order.order_hash}
                      disabled={Remote.Loading.is(cancelListing)}
                      onClick={() => nftActions.cancelListing({ gasData: val, sell_order })}
                      nature='primary'
                      data-e2e='cancelListingNft'
                    >
                      <FormattedMessage
                        id='copy.cancel_listings'
                        values={{
                          val: displayCoinToCoin({
                            coin: sell_order.payment_token_contract?.symbol || 'ETH',
                            value: sell_order.current_price
                          })
                        }}
                        defaultMessage='Cancel Listing for {val}'
                      />
                    </Button>
                  )
                })
              ) : (
                <Text size='14px' weight={600}>
                  <FormattedMessage
                    id='copy.no_active_sell_listings'
                    defaultMessage='There are no active listings to cancel.'
                  />
                </Text>
              )}
            </>
          )
        }
      })}
    </>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default CTA
