import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { GasCalculationOperations } from '@core/network/api/nfts/types'
import { SpinningLoader, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Title, Value } from 'components/Flyout/model'
import { orderFromJSON } from 'data/components/nfts/utils'

import { CTARow } from '../../components'
import { Props as OwnProps } from '..'

const Fees: React.FC<Props> = (props) => {
  const { nftActions, orderFlow } = props
  const { orderToMatch } = orderFlow

  useEffect(() => {
    if (orderToMatch) {
      nftActions.fetchFees({
        operation: GasCalculationOperations.Buy,
        order: orderFromJSON(orderToMatch)
      })
    }
  }, [])

  if (!orderToMatch)
    return (
      <Text size='12px' weight={600}>
        No order found.
      </Text>
    )

  return (
    <>
      {orderFlow.fees.cata({
        Failure: () => null,
        Loading: () => (
          <CTARow>
            <SpinningLoader width='14px' height='14px' borderWidth='3px' />
          </CTARow>
        ),
        NotAsked: () => null,
        Success: (val) => {
          return (
            <>
              <CTARow>
                <Title>
                  <FormattedMessage id='copy.fees' defaultMessage='Fees' />
                </Title>
                <Value>
                  <div style={{ display: 'flex' }}>
                    <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                      {new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()}
                    </CoinDisplay>
                    &nbsp;-&nbsp;
                    <FiatDisplay size='12px' color='grey600' weight={600} coin='ETH'>
                      {new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()}
                    </FiatDisplay>
                  </div>
                </Value>
              </CTARow>
              <CTARow>
                <Title>
                  <FormattedMessage id='copy.total' defaultMessage='Total' />
                </Title>
                <Value>
                  <div style={{ display: 'flex' }}>
                    <CoinDisplay
                      size='14px'
                      color='black'
                      weight={600}
                      coin={orderToMatch.payment_token_contract?.symbol}
                    >
                      {new BigNumber(val.totalFees)
                        .multipliedBy(val.gasPrice)
                        .plus(orderToMatch.base_price)
                        .toString()}
                    </CoinDisplay>
                    &nbsp;-&nbsp;
                    <FiatDisplay
                      size='12px'
                      color='grey600'
                      weight={600}
                      coin={orderToMatch.payment_token_contract?.symbol}
                    >
                      {new BigNumber(val.totalFees)
                        .multipliedBy(val.gasPrice)
                        .plus(orderToMatch.base_price)
                        .toString()}
                    </FiatDisplay>
                  </div>
                </Value>
              </CTARow>
            </>
          )
        }
      })}
    </>
  )
}

type Props = OwnProps

export default Fees
