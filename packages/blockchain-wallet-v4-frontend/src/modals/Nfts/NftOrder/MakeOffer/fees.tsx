import React from 'react'
import BigNumber from 'bignumber.js'

import { NftAsset } from '@core/network/api/nfts/types'

import FeesDropdown from '../../components/FeesDropdown'
import { Props as OwnProps } from '..'
import MakeOfferFees from '../Approval/fees'
import WrapEthFees from '../WrapEth/fees'

const Fees: React.FC<Props> = (props) => {
  const getTotalFees = () => {
    const totalFees = new BigNumber(props?.orderFlow?.wrapEthFees?.data?.approvalFees)
      .multipliedBy(props?.orderFlow?.wrapEthFees?.data?.gasPrice)
      .plus(
        new BigNumber(props?.orderFlow?.wrapEthFees?.data?.totalFees).multipliedBy(
          props?.orderFlow?.wrapEthFees?.data?.gasPrice
        )
      )
    return !totalFees.isNaN() ? totalFees.toString() : '0'
  }

  return (
    <>
      <FeesDropdown totalFees={getTotalFees()} coin='ETH'>
        <MakeOfferFees {...props} />
        <WrapEthFees {...props} />
      </FeesDropdown>
    </>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default Fees
