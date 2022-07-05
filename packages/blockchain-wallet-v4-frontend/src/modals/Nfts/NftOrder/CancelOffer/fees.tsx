import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import { getIsSharedStorefront } from 'blockchain-wallet-v4-frontend/src/scenes/Nfts/utils/NftUtils'

import { displayCoinToCoin } from '@core/exchange'
import { GasCalculationOperations, NftAsset } from '@core/network/api/nfts/types'
import { SpinningLoader, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'

import { RightAlign } from '../../components'
import NftDropdown from '../../components/NftDropdown'
import { Props as OwnProps } from '..'

const Fees: React.FC<Props> = (props) => {
  const { asset, nftActions, orderFlow } = props
  const { seaportOrder, wyvernOrder } = orderFlow
  const IS_SHARED_STOREFRONT = getIsSharedStorefront(asset)

  useEffect(() => {
    if (seaportOrder) {
      nftActions.fetchFees({
        offer: seaportOrder,
        operation: GasCalculationOperations.CancelOffer
      })
    } else if (IS_SHARED_STOREFRONT && wyvernOrder) {
      nftActions.fetchFees_LEGACY({
        operation: GasCalculationOperations.Cancel,
        order: wyvernOrder
      })
    }
  }, [seaportOrder, nftActions, wyvernOrder, IS_SHARED_STOREFRONT])

  return (
    <>
      {orderFlow.fees.cata({
        Failure: () => null,
        Loading: () => <SpinningLoader width='14px' height='14px' borderWidth='3px' />,
        NotAsked: () => <SpinningLoader width='14px' height='14px' borderWidth='3px' />,
        Success: (val) => {
          return (
            <>
              <NftDropdown
                title='Total Fees'
                hasPadding
                titleRight={displayCoinToCoin({
                  coin: 'ETH',
                  value: new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()
                })}
              >
                <Flex justifyContent='space-between' alignItems='center'>
                  <Text size='14px' weight={500}>
                    <FormattedMessage id='copy.network_fees' defaultMessage='Network Fees' />
                  </Text>
                  <RightAlign>
                    <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                      {new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()}
                    </CoinDisplay>
                    <FiatDisplay size='12px' color='grey600' weight={600} coin='ETH'>
                      {new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()}
                    </FiatDisplay>
                  </RightAlign>
                </Flex>
              </NftDropdown>
            </>
          )
        }
      })}
    </>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default Fees
