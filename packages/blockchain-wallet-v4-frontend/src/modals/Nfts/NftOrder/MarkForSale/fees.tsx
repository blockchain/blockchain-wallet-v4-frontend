import React from 'react'

import { GasDataI, NftAsset } from '@core/network/api/nfts/types'
import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import NftDropdown from '../../components/NftDropdown'
import { Props as OwnProps } from '..'
import { getTotalFees } from '../NftOrderUtils'

const Fees: React.FC<Props> = (props: Props) => {
  const { asset } = props

  return (
    <>
      <NftDropdown
        title='Total Fees'
        hasPadding
        titleRight={getTotalFees(asset, { gasPrice: 0, totalFees: 0 } as GasDataI)}
      >
        {asset.asset_contract?.opensea_seller_fee_basis_points > 0 ? (
          <Flex justifyContent='space-between' alignItems='center'>
            <Text size='14px' weight={500}>
              OpenSea Service Fee
            </Text>
            <Text size='14px' color='black' weight={600}>
              {asset.asset_contract.opensea_seller_fee_basis_points / 100}%
            </Text>
          </Flex>
        ) : null}
        {Number(asset.collection?.dev_seller_fee_basis_points) > 0 ? (
          <Flex justifyContent='space-between' alignItems='center'>
            <Text size='14px' weight={500}>
              Creator Royalty
            </Text>
            <Text size='14px' color='black' weight={600}>
              {Number(asset.collection.dev_seller_fee_basis_points) / 100}%
            </Text>
          </Flex>
        ) : null}
      </NftDropdown>
    </>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default Fees
