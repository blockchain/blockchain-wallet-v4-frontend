import React from 'react'

import { NftAsset } from '@core/network/api/nfts/types'
import { Text } from 'blockchain-info-components'

import FeesDropdown from '../../components/FeesDropdown'
import { Props as OwnProps } from '..'

const Fees: React.FC<Props> = (props: Props) => {
  const { orderFlow } = props

  const getBasisPoints = () => {
    return `${String(
      Number(orderFlow?.asset?.data?.collection?.dev_seller_fee_basis_points) / 100 +
        Number(orderFlow?.asset?.data?.asset_contract?.opensea_seller_fee_basis_points) / 100
    )}%`
  }

  return (
    <>
      <FeesDropdown totalFees={getBasisPoints()}>
        {orderFlow?.asset?.data?.asset_contract?.opensea_seller_fee_basis_points > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '1em' }}>
            <Text size='14px' weight={500}>
              OpenSea Service Fee
            </Text>
            <Text size='14px' weight={500}>
              {orderFlow.asset.data.asset_contract.opensea_seller_fee_basis_points / 100}%
            </Text>
          </div>
        )}
        {Number(orderFlow?.asset?.data?.collection?.dev_seller_fee_basis_points) > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '1em' }}>
            <Text size='14px' weight={500}>
              Creator Royalty
            </Text>
            <Text size='14px' weight={500}>
              {Number(orderFlow.asset.data.collection.dev_seller_fee_basis_points) / 100}%
            </Text>
          </div>
        )}
      </FeesDropdown>
    </>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default Fees
