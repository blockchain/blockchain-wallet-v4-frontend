import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { GasCalculationOperations, NftAsset } from '@core/network/api/nfts/types'
import { SpinningLoader, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Title } from 'components/Flyout'
import { Value } from 'components/Flyout/model'

import { CTARow } from '../../components'
import { Props as OwnProps } from '..'

const Fees: React.FC<Props> = (props: any) => {
  const { nftActions, orderFlow } = props

  // Default to WETH
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const WETH = window.coins.WETH.coinfig.type.erc20Address!

  useEffect(() => {
    nftActions.fetchFees({
      asset: props[0],
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
              <CTARow style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title style={{ display: 'flex', lineHeight: '38px' }}>
                  <FormattedMessage id='copy.offer_fees' defaultMessage='Offer Fees' />
                  {val.approvalFees > 0 ? (
                    <TooltipHost id='tooltip.opensea_offer_approval_fees'>
                      <TooltipIcon name='question-in-circle-filled' />
                    </TooltipHost>
                  ) : null}
                </Title>
                <Value>
                  <div style={{ display: 'block' }}>
                    <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                      {new BigNumber(val.approvalFees).multipliedBy(val.gasPrice).toString()}
                    </CoinDisplay>
                    <FiatDisplay size='14px' color='grey600' weight={600} coin='ETH'>
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
