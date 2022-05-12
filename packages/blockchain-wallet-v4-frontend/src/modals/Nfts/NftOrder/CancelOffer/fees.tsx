import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { displayCoinToCoin } from '@core/exchange'
import { GasCalculationOperations, RawOrder } from '@core/network/api/nfts/types'
import { SpinningLoader, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'

import { RightAlign } from '../../components'
import FeesDropdown from '../../components/FeesDropdown'
import { Props as OwnProps } from '..'

const Fees: React.FC<Props> = (props) => {
  const { nftActions, orderFlow } = props
  const { offerToCancel } = orderFlow

  useEffect(() => {
    nftActions.fetchFees({
      operation: GasCalculationOperations.Cancel,
      order: offerToCancel as unknown as RawOrder
    })
  }, [])

  if (!offerToCancel) return null

  return (
    <>
      {orderFlow.fees.cata({
        Failure: () => null,
        Loading: () => <SpinningLoader width='14px' height='14px' borderWidth='3px' />,
        NotAsked: () => <SpinningLoader width='14px' height='14px' borderWidth='3px' />,
        Success: (val) => {
          return (
            <>
              <FeesDropdown
                totalFees={displayCoinToCoin({
                  coin: 'ETH',
                  value: new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()
                })}
              >
                <Flex justifyContent='space-between' alignItems='center'>
                  <Text size='14px' weight={500}>
                    <FormattedMessage id='copy.network_fees' defaultMessage='Network Fees' />
                  </Text>
                  <RightAlign>
                    <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                      {new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()}
                    </CoinDisplay>
                    <FiatDisplay size='12px' color='grey600' weight={600} coin='ETH'>
                      {new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()}
                    </FiatDisplay>
                  </RightAlign>
                </Flex>
              </FeesDropdown>
            </>
          )
        }
      })}
    </>
  )
}

type Props = OwnProps

export default Fees
