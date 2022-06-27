import React from 'react'
import BigNumber from 'bignumber.js'

import { displayCoinToCoin } from '@core/exchange'
import { NftAsset } from '@core/network/api/nfts/types'
import { SpinningLoader } from 'blockchain-info-components'
import { useRemote } from 'hooks'

import NftDropdown from '../../components/NftDropdown'
import { Props as OwnProps } from '..'
import { NftMakeOfferFormValues } from '.'
import CreateOfferFees from './CreateOffer.fees'
import WrapEthFees from './WrapEth.fees'

const Fees: React.FC<Props> = (props) => {
  const { canWrap, isAuthenticated, isInvited, needsWrap, orderFlow } = props
  const fees = useRemote(() => orderFlow.fees)

  const getTotalFees = () => {
    if (fees.isLoading) return <SpinningLoader height='12px' width='12px' borderWidth='3px' />
    if (!fees.data) return '⚠️'

    let totalFees = new BigNumber(fees.data?.approvalFees).multipliedBy(fees.data?.gasPrice)
    if (canWrap && needsWrap) {
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
      {props.formValues?.coin === 'WETH' ? (
        <NftDropdown title='Total Fees' hasPadding titleRight={getTotalFees()}>
          <CreateOfferFees {...props} />
          {/* TODO: SEAPORT */}
          <WrapEthFees {...props} />
        </NftDropdown>
      ) : null}
    </>
  )
}

type Props = OwnProps & {
  asset: NftAsset
  canWrap: boolean
  formValues: NftMakeOfferFormValues
  needsWrap: boolean
}

export default Fees
