import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { GasCalculationOperations, NftAsset } from '@core/network/api/nfts/types'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Row, Title, Value } from 'components/Flyout/model'

import { Props as OwnProps } from '../..'

const Fees: React.FC<Props> = (props) => {
  const { nftActions, orderFlow } = props

  useEffect(() => {
    if (props.asset.sell_orders[0]) {
      nftActions.fetchFees({
        operation: GasCalculationOperations.Cancel,
        order: props.asset.sell_orders[0]
      })
    }
  }, [])

  return (
    <>
      {orderFlow.fees.cata({
        Failure: (e) => null,
        Loading: () => null,
        NotAsked: () => null,
        Success: (val) => {
          return (
            <>
              <Row>
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
              </Row>
            </>
          )
        }
      })}
    </>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default Fees
