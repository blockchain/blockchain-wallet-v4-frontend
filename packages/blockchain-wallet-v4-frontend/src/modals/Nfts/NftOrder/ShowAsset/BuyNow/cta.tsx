import React from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { Remote } from '@core'
import { displayCoinToCoin } from '@core/exchange'
import { Button, Link, Text } from 'blockchain-info-components'
import { NftOrderStepEnum } from 'data/components/nfts/types'

import { Props as OwnProps } from '../..'

const CTA: React.FC<Props> = (props) => {
  const { nftActions, orderFlow } = props
  const { activeOrder } = orderFlow

  if (!activeOrder) return null

  return (
    <>
      {props.orderFlow.fees.cata({
        Failure: (e) => (
          <div>
            <Button jumbo nature='sent' fullwidth disabled data-e2e='buyNft'>
              <FormattedMessage
                id='copy.buy_now_for'
                values={{
                  for: displayCoinToCoin({
                    coin: activeOrder.paymentTokenContract?.symbol || 'ETH',
                    value: activeOrder.basePrice.toString()
                  })
                }}
                defaultMessage='Buy Now for {for}'
              />
            </Button>
            <Text weight={600} color='grey800' style={{ marginTop: '8px', textAlign: 'center' }}>
              <span role='img' aria-label='cry'>
                😭
              </span>{' '}
              {e === 'INSUFFICIENT_FUNDS' ? (
                <FormattedMessage
                  id='copy.not_enough_funds'
                  defaultMessage="Unfortunately you don't have enough ETH to buy this NFT."
                />
              ) : e === 'Sell order is invalid' ? (
                <FormattedMessage
                  id='copy.may_already_have_completed'
                  defaultMessage='Invalid sell order. You may have already completed this transaction.'
                />
              ) : (
                e
              )}
            </Text>
          </div>
        ),
        Loading: () => (
          <Button jumbo nature='primary' fullwidth disabled data-e2e='buyNft'>
            <FormattedMessage id='copy.loading' defaultMessage='Loading...' />
          </Button>
        ),
        NotAsked: () => (
          <Button jumbo nature='primary' fullwidth disabled data-e2e='buyNft'>
            <FormattedMessage id='copy.loading' defaultMessage='Loading...' />
          </Button>
        ),
        Success: (val) => (
          <div>
            <Button
              onClick={() => nftActions.createOrder({ gasData: val, order: activeOrder })}
              jumbo
              nature='primary'
              fullwidth
              disabled={Remote.Loading.is(orderFlow.order)}
              data-e2e='buyNft'
            >
              <FormattedMessage
                id='copy.buy_now_for'
                values={{
                  for: displayCoinToCoin({
                    coin: activeOrder.paymentTokenContract?.symbol || 'ETH',
                    value: new BigNumber(val.totalFees)
                      .multipliedBy(val.gasPrice)
                      .plus(activeOrder.basePrice)
                      .toString()
                  })
                }}
                defaultMessage='Buy Now for {for}'
              />
            </Button>
            {/* TODO: MAKE AN OFFER */}
            {/* <Text size='12px' weight={500} style={{ margin: '8px 0', textAlign: 'center' }}>
              Or
            </Text>
            <Link
              weight={600}
              size='14px'
              onClick={() => nftActions.setOrderFlowStep({ step: NftOrderStepEnum.MAKE_OFFER })}
              style={{ display: 'block', textAlign: 'center', width: '100%' }}
            >
              Make an Offer
            </Link> */}
          </div>
        )
      })}
    </>
  )
}

type Props = OwnProps

export default CTA
