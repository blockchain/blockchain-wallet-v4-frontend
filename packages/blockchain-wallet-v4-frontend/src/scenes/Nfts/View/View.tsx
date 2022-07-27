import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { colors, Icon } from '@blockchain-com/constellation'
import { IconBlockchain, IconSettings, IconVerified } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { WalletOptionsType } from '@core/types'
import {
  Button,
  Image,
  Link,
  SkeletonCircle,
  SkeletonRectangle,
  Text
} from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
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

const Address = styled(Flex)`
  background-color: ${colors.grey000};
  border-radius: 100px;
  padding: 8px;
  width: fit-content;
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
  ${media.tablet`
    display: block;
  `}
`

const Left = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  ${media.tablet`
    width: 100%;
    padding-top: 2em;
  `}
`

const CustomText = styled(Text)`
  text-align: center;
  width: 418px;
  ${media.tablet`
  width: 100%;
  `}
`

const Right = styled(Left)``

const CustomStat = styled(Stat)`
  border-radius: 24px;
`

const View: React.FC<Props> = (props) => {
  const { nftsActions } = props
  const address = '0x0000000000000000000000000000000000000000'
  return (
    <NftPageV2>
      <Header>
        <FlexLeft>
          <HeaderContent>
            <Text size='32px' weight={600} color='grey900'>
              My NFTs
            </Text>
            <Address justifyContent='space-between' alignItems='center'>
              <Text color='grey900' size='16px' weight={600}>
                <CryptoAddress canCopy>{address}</CryptoAddress>
              </Text>
            </Address>
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
              <Image name='nft-import' />
              <Text color='grey900' size='20px' weight={600}>
                Import your NFTs
              </Text>
              <CustomText color='grey700' size='16px' weight={500}>
                Already have NFTs somewhere else? Import them by sending from external wallet to the
                address below.
              </CustomText>
              <Button
                onClick={() =>
                  nftsActions.nftOrderFlowOpen({
                    step: NftOrderStepEnum.IMPORT_NFTS
                  })
                }
                width='300px'
                nature='primary'
                data-e2e='get-started'
              >
                Get Started
              </Button>
            </Left>
            <Right>
              <Image name='nft-purchase' />
              <Text color='grey900' size='20px' weight={600}>
                Purchase NFTs
              </Text>
              <CustomText color='grey700' size='16px' weight={500}>
                Buy an NFT using your Blockchain.com app and Walletconnect on Opensea or Rarible.
              </CustomText>
              <Flex flexDirection='column' alignItems='center' gap={16}>
                <Link href='https://opensea.com/' target='_blank'>
                  <Button width='300px' nature='empty-blue' data-e2e='buy-on-opensea'>
                    <Flex gap={8}>
                      <Image name='opensea' height='16px' />
                      <FormattedMessage id='copy.buy_on_opensea' defaultMessage='Buy On Opensea' />
                    </Flex>
                  </Button>
                </Link>
                <Text
                  color='blue600'
                  size='16px'
                  weight={500}
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    nftsActions.nftOrderFlowOpen({
                      step: NftOrderStepEnum.PURCHASE_NFTS
                    })
                  }
                >
                  <FormattedMessage
                    id='copy.how_does_this_work'
                    defaultMessage='How does this work?'
                  />
                </Text>
              </Flex>
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
