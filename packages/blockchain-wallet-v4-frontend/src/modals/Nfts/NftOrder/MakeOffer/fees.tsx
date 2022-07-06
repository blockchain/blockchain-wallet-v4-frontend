import React, { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getIsSharedStorefront } from 'blockchain-wallet-v4-frontend/src/scenes/Nfts/utils/NftUtils'

import { displayCoinToCoin } from '@core/exchange'
import { GasCalculationOperations, NftAsset } from '@core/network/api/nfts/types'
import { SpinningLoader } from 'blockchain-info-components'
import { useRemote } from 'hooks'

import NftDropdown from '../../components/NftDropdown'
import { Props as OwnProps } from '..'
import { NftMakeOfferFormValues } from '.'
import CollectionFees from './Collection.fees'
import ConduitFees from './Conduit.fees'
import WrapEthFees from './WrapEth.fees'

const Fees: React.FC<Props> = (props) => {
  const { asset, isAuthenticated, isInvited, needsWrap, nftActions, orderFlow } = props
  const fees = useRemote(() => orderFlow.fees)
  const IS_SHARED_STOREFRONT = getIsSharedStorefront(asset)

  useEffect(() => {
    if (IS_SHARED_STOREFRONT) {
      // Default to WETH
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const WETH = window.coins.WETH.coinfig.type.erc20Address!

      nftActions.fetchFees_LEGACY({
        asset,
        offer: '0.000001',
        operation: GasCalculationOperations.CreateOffer,
        paymentTokenAddress: WETH
      })
    } else {
      nftActions.fetchFees({
        amount: '0',
        asset,
        // TODO: SEAPORT
        coin: 'WETH',
        operation: GasCalculationOperations.CreateOffer
      })
    }
  }, [])

  const getTotalFees = () => {
    if (fees.isLoading) return <SpinningLoader height='12px' width='12px' borderWidth='3px' />
    if (!fees.data) return '⚠️'

    let totalFees = new BigNumber(fees.data?.totalFees).multipliedBy(fees.data?.gasPrice)
    if (needsWrap) {
      totalFees = totalFees.plus(
        new BigNumber(orderFlow?.wrapEthFees?.data?.totalFees).multipliedBy(
          orderFlow?.wrapEthFees?.data?.gasPrice
        )
      )
    }
    if (totalFees.isNaN()) return '⚠️'
    const totalString = totalFees.toString()
    const total = displayCoinToCoin({ coin: 'ETH', value: totalString })
    return total
  }

  if (!isAuthenticated) return null
  if (!isInvited) return null

  return (
    <>
      {/* TODO: SEAPORT */}
      {props.formValues?.coin === 'WETH' ? (
        <NftDropdown title='Total Fees' hasPadding titleRight={getTotalFees()}>
          <CollectionFees {...props} />
          {IS_SHARED_STOREFRONT ? null : <ConduitFees {...props} />}
          <WrapEthFees {...props} />
        </NftDropdown>
      ) : null}
    </>
  )
}

type Props = OwnProps & {
  asset: NftAsset
  formValues: NftMakeOfferFormValues
  needsWrap: boolean
}

export default Fees
