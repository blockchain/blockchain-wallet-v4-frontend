import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { GasCalculationOperations, NftAsset } from '@core/network/api/nfts/types'
import { SpinningLoader, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Title, Value } from 'components/Flyout/model'

import { CTARow } from '../../components'
import { Props as OwnProps } from '..'

const Fees: React.FC<Props> = (props) => {
  const { nftActions, orderFlow } = props

  // Default to WETH
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const WETH = window.coins.WETH.coinfig.type.erc20Address!

  useEffect(() => {
    nftActions.fetchFees({
      asset: props.asset,
      offer: '0.0001',
      operation: GasCalculationOperations.CreateOffer,
      paymentTokenAddress: WETH
    })
  }, [])

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
                <Title style={{ display: 'flex' }}>
                  <FormattedMessage id='copy.fees' defaultMessage='Fees' />
                  {val.approvalFees > 0 ? (
                    <TooltipHost id='tooltip.opensea_offer_approval_fees'>
                      <TooltipIcon name='question-in-circle-filled' />
                    </TooltipHost>
                  ) : null}
                </Title>
                <Value>
                  <div style={{ display: 'flex' }}>
                    <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                      {new BigNumber(val.approvalFees).multipliedBy(val.gasPrice).toString()}
                    </CoinDisplay>
                    &nbsp;-&nbsp;
                    <FiatDisplay size='12px' color='grey600' weight={600} coin='ETH'>
                      {new BigNumber(val.approvalFees).multipliedBy(val.gasPrice).toString()}
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
