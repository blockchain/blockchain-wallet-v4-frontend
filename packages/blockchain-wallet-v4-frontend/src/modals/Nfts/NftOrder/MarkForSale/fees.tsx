import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { GasCalculationOperations, NftAsset } from '@core/network/api/nfts/types'
import { SpinningLoader, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'

import { RightAlign } from '../../components'
import NftDropdown from '../../components/NftDropdown'
import { Props as OwnProps } from '..'
import { getTotalFees } from '../NftOrderUtils'

const Fees: React.FC<Props> = (props: Props) => {
  const { asset, nftActions, orderFlow } = props

  useEffect(() => {
    nftActions.fetchFees({
      asset: props.asset,
      operation: GasCalculationOperations.Sell
    })
  }, [])

  return (
    <>
      {orderFlow.fees.cata({
        Failure: () => null,
        Loading: () => <SpinningLoader width='14px' height='14px' borderWidth='3px' />,
        NotAsked: () => null,
        Success: (val) => {
          return (
            <NftDropdown title='Total Fees' hasPadding titleRight={getTotalFees(asset, val)}>
              {asset.asset_contract?.opensea_seller_fee_basis_points > 0 ? (
                <Flex justifyContent='space-between' alignItems='center'>
                  <Text size='14px' weight={500}>
                    <FormattedMessage
                      id='copy.opensea_service_fee'
                      defaultMessage='OpenSea Service Fee'
                    />
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
              <Flex justifyContent='space-between' alignItems='center'>
                <Flex>
                  <Text size='14px' weight={500}>
                    <FormattedMessage id='copy.approval_fees' defaultMessage='Approval Fees' />
                  </Text>
                  {val.gasFees > 0 ? (
                    <TooltipHost id='tooltip.opensea_listing_approval_fees'>
                      <TooltipIcon name='question-in-circle-filled' />
                    </TooltipHost>
                  ) : null}
                </Flex>
                <RightAlign>
                  <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                    {new BigNumber(val.gasFees).multipliedBy(val.gasPrice).toString()}
                  </CoinDisplay>
                  <FiatDisplay size='12px' color='grey600' weight={600} coin='ETH'>
                    {new BigNumber(val.gasFees).multipliedBy(val.gasPrice).toString()}
                  </FiatDisplay>
                </RightAlign>
              </Flex>
            </NftDropdown>
          )
        }
      })}
    </>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default Fees
