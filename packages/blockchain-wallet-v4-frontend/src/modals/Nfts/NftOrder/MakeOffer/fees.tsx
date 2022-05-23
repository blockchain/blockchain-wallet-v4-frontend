import React from 'react'
import BigNumber from 'bignumber.js'

import { displayCoinToCoin } from '@core/exchange'
import { NftAsset } from '@core/network/api/nfts/types'

import FeesDropdown from '../../components/FeesDropdown'
import { Props as OwnProps } from '..'
import { NftMakeOfferFormValues } from '.'
import CreateOfferFees from './CreateOffer.fees'
import WrapEthFees from './WrapEth.fees'

const Fees: React.FC<Props> = (props) => {
  const getTotalFees = () => {
    const totalFees = new BigNumber(props?.orderFlow?.wrapEthFees?.data?.approvalFees)
      .multipliedBy(props?.orderFlow?.wrapEthFees?.data?.gasPrice)
      .plus(
        new BigNumber(props?.orderFlow?.wrapEthFees?.data?.totalFees).multipliedBy(
          props?.orderFlow?.wrapEthFees?.data?.gasPrice
        )
      )
    const totalString = !totalFees.isNaN() ? totalFees.toString() : '0'
    const total = displayCoinToCoin({ coin: 'ETH', value: totalString })
    return total
  }

  return (
    <>
      <FeesDropdown totalFees={getTotalFees()}>
        <CreateOfferFees {...props} />
        {props.formValues.coin === 'WETH' ? <WrapEthFees {...props} /> : null}
      </FeesDropdown>
    </>
  )
}

type Props = OwnProps & { asset: NftAsset; formValues: NftMakeOfferFormValues }

export default Fees
