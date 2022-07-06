import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import FlyoutHeader from 'components/Flyout/Header'
import { useRemote } from 'hooks'

import { NftFlyoutRow, StickyCTA } from '../../components'
import NftAssetHeaderRow from '../../components/NftAssetHeader'
import NftFlyoutFailure from '../../components/NftFlyoutFailure'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import CancelListingCTA from './cta'
import CancelListingFees from './fees'

const CancelListing: React.FC<Props> = (props) => {
  const { close, openSeaAssetR, orderFlow } = props
  const { seaportOrder } = orderFlow

  const openSeaAsset = useRemote(() => openSeaAssetR)

  if (openSeaAsset.isLoading) return <NftFlyoutLoader close={props.close} />
  if (openSeaAsset.error)
    return <NftFlyoutFailure error={openSeaAsset.error || ''} close={props.close} />

  const asset = openSeaAsset.data

  if (!asset) return <NftFlyoutFailure error='Error fetching asset data.' close={props.close} />

  return (
    <>
      <FlyoutHeader sticky data-e2e='cancelListing' mode='back' onClick={() => close()}>
        <FormattedMessage id='copy.cancel_listing' defaultMessage='Cancel Listing' />
      </FlyoutHeader>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <NftAssetHeaderRow asset={asset} />
        <NftFlyoutRow>
          <Flex alignItems='center' justifyContent='space-between'>
            <Text color='black' weight={600} size='20px'>
              <FormattedMessage id='copy.price' defaultMessage='Price' />
            </Text>
            <Flex flexDirection='column' alignItems='flex-end' gap={4}>
              <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                {seaportOrder?.current_price}
              </CoinDisplay>
              <FiatDisplay size='12px' color='grey600' weight={600} coin='ETH'>
                {seaportOrder?.current_price}
              </FiatDisplay>
            </Flex>
          </Flex>
        </NftFlyoutRow>
      </div>
      <StickyCTA>
        <CancelListingFees {...props} asset={asset} />
        <br />
        <CancelListingCTA {...props} asset={asset} />
      </StickyCTA>
    </>
  )
}

type Props = OwnProps

export default CancelListing
