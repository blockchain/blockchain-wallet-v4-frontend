import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { GasCalculationOperations, NftAsset } from '@core/network/api/nfts/types'
import { SpinningLoader } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Title, Value } from 'components/Flyout/model'

import { CTARow } from '../../../components'
import { Props as OwnProps } from '../..'

const Fees: React.FC<Props> = (props) => {
  const { nftActions, orderFlow } = props

  useEffect(() => {
    if (props.asset) {
      nftActions.fetchFees({
        asset: props.asset,
        operation: GasCalculationOperations.Transfer,
        to: '0x9e38F81217F693367F03e7bbd583fDEA1eE297E3'
      })
    }
  }, [])

  return (
    <>
      {orderFlow.fees.cata({
        Failure: () => null,
        Loading: () => (
          <CTARow>
            <div style={{ marginBottom: '22px' }}>
              <SpinningLoader width='14px' height='14px' borderWidth='3px' />
            </div>
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
            </>
          )
        }
      })}
    </>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default Fees
