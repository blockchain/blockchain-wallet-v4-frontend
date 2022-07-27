import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { colors, Icon } from '@blockchain-com/constellation'
import { IconBlockchain, IconSettings, IconVerified } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { WalletOptionsType } from '@core/types'
import { Button, SkeletonCircle, SkeletonRectangle, Text } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import {
  AssetFilterFields,
  CollectionSortFields,
  SortDirection,
  useAssetsQuery,
  useTrendingCollectionsQuery
} from 'generated/graphql.types'
import { media, useMedia } from 'services/styles'

import { NftPageV2, Stat, StatsWrapper } from '../components'

const Header = styled.div`
  height: 232px;
  width: 100%;
`

const FlexLeft = styled.div`
  display: flex;
  justify-content: left;
  flex-direction: column;
`

const HeaderContent = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Body = styled.div`
  height: 100%;
  padding: 40px;
  display: flex;
  justify-content: space-between;
`

const Left = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`
const Right = styled(Left)``

const CustomStat = styled(Stat)`
  border-radius: 24px;
`

const View: React.FC<Props> = (props) => {
  const address = '0x0000000000000000000000000000000000000000'
  return (
    <NftPageV2>
      <Header>
        <FlexLeft>
          <HeaderContent>
            <Text size='32px' weight={600} color={colors.grey900}>
              My NFTs
            </Text>
            <Flex justifyContent='space-between' alignItems='center'>
              <Text color='black' size='24px' weight={600}>
                <CryptoAddress canCopy>{address}</CryptoAddress>
              </Text>
            </Flex>
            <Flex>
              <StatsWrapper style={{ margin: '0' }}>
                <CustomStat>
                  <Text size='16px' weight={500} color='grey600'>
                    <FormattedMessage id='copy.total_vol' defaultMessage='Total Items' />
                  </Text>
                  <Text size='16px' color='black' weight={600}>
                    0
                  </Text>
                </CustomStat>
                <CustomStat>
                  <Text size='16px' weight={500} color='grey600'>
                    <FormattedMessage id='copy.total_vol' defaultMessage='Average Floor Price' />
                  </Text>
                  <Text size='16px' color='black' weight={600}>
                    0.00 ETH
                  </Text>
                </CustomStat>
              </StatsWrapper>
            </Flex>
          </HeaderContent>
          <Body>
            <Left>
              <Text color={colors.grey900} size='20px' weight={600}>
                Import your NFTs
              </Text>
              <Text color={colors.grey200} size='16px' weight={500} style={{ maxWidth: '500px' }}>
                Already have NFTs somewhere else? Import them by sending from external wallet to the
                address below.
              </Text>
              <Button width='300px' nature='primary' data-e2e='get-started'>
                Get Started
              </Button>
            </Left>
            <Right>
              <Text color={colors.grey900} size='20px' weight={600}>
                Purchase NFTs
              </Text>
              <Text color={colors.grey200} size='16px' weight={500} style={{ maxWidth: '500px' }}>
                Buy an NFT using your Blockchain.com app and Walletconnect on Opensea or Rarible.
              </Text>
              <Button width='300px' nature='empty-blue' data-e2e='buy-on-opensea'>
                Buy On Opensea
              </Button>
            </Right>
          </Body>
        </FlexLeft>
      </Header>
    </NftPageV2>
  )
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(View)
