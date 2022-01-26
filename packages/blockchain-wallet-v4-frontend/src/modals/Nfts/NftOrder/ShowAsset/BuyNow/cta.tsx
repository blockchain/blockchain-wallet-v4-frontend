import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'

import { displayCoinToCoin } from '@core/exchange'
import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { RootState } from 'data/rootReducer'

import { Props as OwnProps } from '../..'
import { getData } from './selectors'

const CTA: React.FC<Props> = (props) => {
  const { nftActions, orderFlow } = props
  const { activeOrder } = orderFlow

  if (!activeOrder) return null

  const disabled = props.orderFlow.isSubmitting

  return (
    <>
      {props.data.cata({
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
                <>
                  <FormattedMessage
                    id='copy.not_enough_funds'
                    defaultMessage="Unfortunately you don't have enough ETH to buy this NFT."
                  />
                  <Link
                    weight={600}
                    size='14px'
                    onClick={() =>
                      nftActions.setOrderFlowStep({ step: NftOrderStepEnum.MAKE_OFFER })
                    }
                    style={{
                      display: 'block',
                      marginTop: '8px',
                      textAlign: 'center',
                      width: '100%'
                    }}
                  >
                    Make an Offer
                  </Link>
                </>
              ) : e === 'Sell order is invalid' ? (
                <FormattedMessage
                  id='copy.may_already_have_completed'
                  defaultMessage='Invalid order. This asset has already been purchased.'
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
              onClick={() => nftActions.createOrder({ gasData: val.fees, ...val.matchingOrder })}
              jumbo
              nature='primary'
              fullwidth
              disabled={disabled}
              data-e2e='buyNft'
            >
              {props.orderFlow.isSubmitting ? (
                <HeartbeatLoader color='blue100' height='20px' width='20px' />
              ) : (
                <FormattedMessage
                  id='copy.buy_now_for'
                  values={{
                    for: displayCoinToCoin({
                      coin: activeOrder.paymentTokenContract?.symbol || 'ETH',
                      value: new BigNumber(val.fees.totalFees)
                        .multipliedBy(val.fees.gasPrice)
                        .plus(activeOrder.basePrice)
                        .toString()
                    })
                  }}
                  defaultMessage='Buy Now for {for}'
                />
              )}
            </Button>
            <Text size='12px' weight={500} style={{ margin: '8px 0', textAlign: 'center' }}>
              Or
            </Text>
            <Link
              weight={600}
              size='14px'
              onClick={() => nftActions.setOrderFlowStep({ step: NftOrderStepEnum.MAKE_OFFER })}
              style={{ display: 'block', textAlign: 'center', width: '100%' }}
            >
              Make an Offer
            </Link>
          </div>
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

export default connector(CTA)
