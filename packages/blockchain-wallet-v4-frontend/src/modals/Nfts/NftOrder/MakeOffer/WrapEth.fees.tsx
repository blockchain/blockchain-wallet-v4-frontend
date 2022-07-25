import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { GasCalculationOperations } from '@core/network/api/nfts/types'
import { SpinningLoader, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'

import { RightAlign } from '../../components'
import { Props as OwnProps } from '..'

const Fees: React.FC<Props> = (props) => {
  const { needsWrap, nftActions, orderFlow } = props

  useEffect(() => {
    nftActions.fetchFeesWrapEth({
      operation: GasCalculationOperations.WrapEth
    })
  }, [nftActions])

  if (!needsWrap) {
    return (
      <Flex justifyContent='space-between' alignItems='center'>
        <Text size='14px' weight={500}>
          <FormattedMessage id='copy.wrap_eth_fees' defaultMessage='Wrap Eth Fees' />
        </Text>
        <div>
          <RightAlign>
            <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
              0
            </CoinDisplay>
            <FiatDisplay size='14px' color='grey600' weight={600} coin='ETH'>
              0
            </FiatDisplay>
          </RightAlign>
        </div>
      </Flex>
    )
  }

  return (
    <>
      {orderFlow.wrapEthFees.cata({
        Failure: (val) => (
          <Flex justifyContent='space-between' alignItems='center'>
            <Text size='14px' weight={500}>
              <FormattedMessage id='copy.wrap_eth_fees' defaultMessage='Wrap Eth Fees' />
            </Text>
            <RightAlign>
              {val === 'INSUFFICIENT_FUNDS' ? (
                <Text size='14px' weight={600} color='red600'>
                  <FormattedMessage
                    id='copy.insufficient_funds'
                    defaultMessage='Insufficient Funds'
                  />
                </Text>
              ) : (
                'Error'
              )}
            </RightAlign>
          </Flex>
        ),
        Loading: () => <SpinningLoader width='14px' height='14px' borderWidth='3px' />,
        NotAsked: () => null,
        Success: (val) => {
          return (
            <Flex justifyContent='space-between' alignItems='center'>
              <Text size='14px' weight={500}>
                <FormattedMessage id='copy.wrap_eth_fees' defaultMessage='Wrap Eth Fees' />
              </Text>
              <div>
                <RightAlign>
                  <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                    {needsWrap
                      ? new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()
                      : new BigNumber(0).toString()}
                  </CoinDisplay>
                  <FiatDisplay size='14px' color='grey600' weight={600} coin='ETH'>
                    {needsWrap
                      ? new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()
                      : new BigNumber(0).toString()}
                  </FiatDisplay>
                </RightAlign>
              </div>
            </Flex>
          )
        }
      })}
    </>
  )
}

type Props = OwnProps & {
  needsWrap: boolean
}

export default Fees
