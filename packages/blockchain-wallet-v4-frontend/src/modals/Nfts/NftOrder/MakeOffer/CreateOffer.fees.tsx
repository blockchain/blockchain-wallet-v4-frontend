import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { GasCalculationOperations, NftAsset } from '@core/network/api/nfts/types'
import {
  OPENSEA_SHARED_MARKETPLACE,
  OPENSEA_SHARED_MARKETPLACE_RINKEBY
} from '@core/redux/payment/nfts/constants'
import { SpinningLoader, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'

import { RightAlign } from '../../components'
import { Props as OwnProps } from '..'
import { NftMakeOfferFormValues } from '.'

const Fees: React.FC<Props> = (props: Props) => {
  const { asset, formValues, nftActions, orderFlow } = props
  const { coin } = formValues
  const IS_SHARED_STOREFRONT =
    asset.asset_contract.address === OPENSEA_SHARED_MARKETPLACE_RINKEBY ||
    asset.asset_contract.address === OPENSEA_SHARED_MARKETPLACE

  useEffect(() => {
    if (IS_SHARED_STOREFRONT) {
      // Default to WETH
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const WETH = window.coins.WETH.coinfig.type.erc20Address!

      nftActions.fetchFees_LEGACY({
        asset: props.asset,
        offer: '0.000001',
        operation: GasCalculationOperations.CreateOffer,
        paymentTokenAddress: WETH
      })
    } else {
      nftActions.fetchFees({
        amount: '0.000001',
        asset,
        coin,
        operation: GasCalculationOperations.CreateOffer
      })
    }
  }, [])

  return (
    <>
      {orderFlow.fees.cata({
        Failure: (e) => (
          <Flex justifyContent='space-between' alignItems='center'>
            <Flex>
              <Text size='14px' weight={500}>
                <FormattedMessage id='copy.offer_fees' defaultMessage='Offer Fees' />
              </Text>
            </Flex>
            <RightAlign>
              <Text size='14px' weight={600} color='grey600'>
                N/A
              </Text>
            </RightAlign>
          </Flex>
        ),
        Loading: () => <SpinningLoader width='14px' height='14px' borderWidth='3px' />,
        NotAsked: () => null,
        Success: (val) => {
          return (
            <Flex justifyContent='space-between' alignItems='center'>
              <Flex>
                <Text size='14px' weight={500}>
                  <FormattedMessage id='copy.offer_fees' defaultMessage='Offer Fees' />
                </Text>
                {val.approvalFees > 0 ? (
                  <TooltipHost id='tooltip.opensea_offer_approval_fees'>
                    <TooltipIcon name='question-in-circle-filled' />
                  </TooltipHost>
                ) : null}
              </Flex>
              <RightAlign>
                <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                  {new BigNumber(val.approvalFees).multipliedBy(val.gasPrice).toString()}
                </CoinDisplay>
                <FiatDisplay size='14px' color='grey600' weight={600} coin='ETH'>
                  {new BigNumber(val.approvalFees).multipliedBy(val.gasPrice).toString()}
                </FiatDisplay>
              </RightAlign>
            </Flex>
          )
        }
      })}
    </>
  )
}

type Props = OwnProps & { asset: NftAsset; formValues: NftMakeOfferFormValues }

export default Fees
