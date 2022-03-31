import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { GasCalculationOperations } from '@core/network/api/nfts/types'
import { SpinningLoader } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Title } from 'components/Flyout'
import { Value } from 'components/Flyout/model'

import { CTARow } from '../../components'
import { Props as OwnProps } from '..'

const Fees: React.FC<Props> = (props) => {
  const { nftActions, orderFlow } = props

  useEffect(() => {
    nftActions.fetchFeesWrapEth({
      operation: GasCalculationOperations.WrapEth
    })
  }, [nftActions])

  return (
    <>
      {orderFlow.wrapEthFees.cata({
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
              <CTARow style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title style={{ display: 'flex' }}>
                  <FormattedMessage id='copy.wrap_eth_fees' defaultMessage='Wrapped Eth Fees' />
                </Title>
                <Value>
                  <div style={{ display: 'block' }}>
                    <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                      {new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()}
                    </CoinDisplay>
                    <FiatDisplay
                      style={{ padding: '0em 0em 0em 5em' }}
                      size='14px'
                      color='grey600'
                      weight={600}
                      coin='ETH'
                    >
                      {new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()}
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
