import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'

import { Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import FlyoutHeader from 'components/Flyout/Header'
import { RootState } from 'data/rootReducer'
import { useRemote } from 'hooks'

import { NftFlyoutRow, StickyCTA } from '../../components'
import NftAssetHeaderRow from '../../components/NftAssetHeader'
import NftFlyoutFailure from '../../components/NftFlyoutFailure'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import AcceptOfferCTA from './cta'
import AcceptOfferFees from './fees'
import { getData_LEGACY } from './selectors'

const AcceptOffer: React.FC<Props> = (props) => {
  const { close, openSeaAssetR, orderFlow } = props

  const openSeaAsset = useRemote(() => openSeaAssetR)

  if (openSeaAsset.isLoading) return <NftFlyoutLoader close={props.close} />
  if (openSeaAsset.error)
    return <NftFlyoutFailure error={openSeaAsset.error || ''} close={props.close} />

  const asset = openSeaAsset.data

  if (!asset) return <NftFlyoutFailure error='Error fetching asset data.' close={props.close} />
  return (
    <>
      <FlyoutHeader sticky data-e2e='acceptOffer' mode='back' onClick={() => close()}>
        <FormattedMessage id='copy.accept_offer' defaultMessage='Accept Offer' />
      </FlyoutHeader>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div style={{ height: '100%' }}>
          <NftAssetHeaderRow asset={asset} />
          <NftFlyoutRow>
            <Flex alignItems='center' justifyContent='space-between'>
              <Text color='black' weight={600} size='20px'>
                <FormattedMessage id='copy.offer' defaultMessage='Offer' />
              </Text>
              <Flex flexDirection='column' alignItems='flex-end' gap={4}>
                {/* TODO: SEAPORT */}
                <CoinDisplay size='20px' color='black' weight={600} coin='WETH'>
                  {orderFlow.seaportOrder?.current_price}
                </CoinDisplay>
                {/* TODO: SEAPORT */}
                <FiatDisplay size='14px' color='grey600' weight={500} coin='WETH'>
                  {orderFlow.seaportOrder?.current_price}
                </FiatDisplay>
              </Flex>
            </Flex>
          </NftFlyoutRow>
        </div>
        <StickyCTA>
          <AcceptOfferFees {...props} asset={asset} />
          <br />
          <AcceptOfferCTA {...props} asset={asset} />
        </StickyCTA>
      </div>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  data_LEGACY: getData_LEGACY(state)
})

const connector = connect(mapStateToProps)

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(AcceptOffer)
