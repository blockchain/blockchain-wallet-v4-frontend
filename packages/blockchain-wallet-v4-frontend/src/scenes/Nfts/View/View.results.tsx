import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { NftAsset } from '@core/network/api/nfts/types'
import { Image, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'
import { Analytics } from 'data/types'
import { media } from 'services/styles'

import { EmptyState, ResultImg } from '../AssetViewOnly/AssetViewOnly'

const NftViewResults: React.FC<Props> = (props) => {
  const { analyticsActions, asset, nftsActions } = props
  const clickAsset = () => {
    analyticsActions.trackEvent({
      key: Analytics.NFT_ASSET_CLICKED,
      properties: {
        collection_name: asset.collection.name,
        contract_address: asset.asset_contract.address,
        token_id: asset.token_id
      }
    })
    nftsActions.setViewOrder({ viewOrder: asset })
  }
  return (
    <>
      {asset.image_url ? (
        <LinkContainer to={`/nfts/assets/${asset.asset_contract?.address}/${asset.token_id}`}>
          <ResultImg onClick={clickAsset} alt='Asset Logo' src={asset.image_url} />
        </LinkContainer>
      ) : (
        <EmptyState>
          <Flex alignItems='center' justifyContent='center' flexDirection='column' gap={8}>
            <Image width='75px' height='auto' name='nft-purchase' />.
            <Text color='grey900' size='12px' weight={500}>
              Image Preview Unavailable
            </Text>
          </Flex>
        </EmptyState>
      )}
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> & {
  asset: NftAsset
}

export default connector(NftViewResults)
