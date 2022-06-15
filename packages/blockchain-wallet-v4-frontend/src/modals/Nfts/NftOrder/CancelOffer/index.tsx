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
import CancelOfferCTA from './cta'
import CancelOfferFees from './fees'

const CancelOffer: React.FC<Props> = (props) => {
  const { close, openSeaAssetR, orderFlow } = props
  const { offerToCancel } = orderFlow

  const openSeaAsset = useRemote(() => openSeaAssetR)
  if (openSeaAsset.isLoading) return <NftFlyoutLoader close={props.close} />
  if (openSeaAsset.error)
    return <NftFlyoutFailure error={openSeaAsset.error || ''} close={props.close} />

  const asset = openSeaAsset.data

  if (!asset) return <NftFlyoutFailure error='Error fetching asset data.' close={props.close} />

  return (
    <>
      <FlyoutHeader sticky data-e2e='cancelOffer' mode='back' onClick={() => close()}>
        <FormattedMessage id='copy.cancel_offer' defaultMessage='Cancel Offer' />
      </FlyoutHeader>
      <div style={{ height: '100%' }}>
        <NftAssetHeaderRow asset={asset} />
        <NftFlyoutRow>
          <Flex alignItems='center' justifyContent='space-between'>
            <Text color='black' weight={600} size='20px'>
              <FormattedMessage id='copy.offer' defaultMessage='Offer' />
            </Text>
            <Flex flexDirection='column' alignItems='flex-end' gap={4}>
              <CoinDisplay
                size='14px'
                color='black'
                weight={600}
                coin={offerToCancel?.payment_token_contract?.symbol}
              >
                {offerToCancel?.current_price}
              </CoinDisplay>
              <FiatDisplay
                size='12px'
                color='grey600'
                weight={600}
                coin={offerToCancel?.payment_token_contract?.symbol}
              >
                {offerToCancel?.current_price}
              </FiatDisplay>
            </Flex>
          </Flex>
        </NftFlyoutRow>
      </div>
      <StickyCTA>
        <CancelOfferFees {...props} />
        <br />
        <CancelOfferCTA {...props} asset={asset} />
      </StickyCTA>
    </>
  )
}

type Props = OwnProps

export default CancelOffer
