import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Flex, PaletteColors } from '@blockchain-com/constellation'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Icon as BlockchainIcon, Image, Link, Text } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { RootState } from 'data/rootReducer'
import { Analytics } from 'data/types'
import {
  AssetFilterFields,
  CollectionSortFields,
  SortDirection,
  useAssetsQuery,
  useTrendingCollectionsQuery
} from 'generated/graphql.types'
import { media } from 'services/styles'

import { GridWrapper, NftPageV2, Stat, StatsWrapper } from '../components'
import NftGrid from '../components/NftGrid'
import NftViewResults from './View.results'

const Header = styled.div`
  height: 232px;
  width: 100%;
`

const Address = styled(Flex)`
  background-color: ${PaletteColors['gray-000']};
  border-radius: 100px;
  padding: 8px;
  width: fit-content;
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
  `}
`

const CustomText = styled(Text)`
  text-align: center;
  width: 418px;
  ${media.tablet`
  width: 100%;
  `}
`

const CoinIcon = styled(BlockchainIcon).attrs({ className: 'coin-icon' })`
  margin-right: 8px;
  > img {
    height: 24px;
    width: 24px;
  }
`

const Right = styled(Left)`
  ${media.tablet`
    padding-top: 4em;
  `}
`

const CustomStat = styled(Stat)`
  border-radius: 24px;
`

const View: React.FC<Props> = (props) => {
  const { analyticsActions, defaultEthAddr, nftOwnerAssets, nftsActions } = props
  useEffect(() => {
    nftsActions.fetchNftOwnerAssets({ defaultEthAddr })
  }, [])
  const AddNFTsClicked = () => {
    nftsActions.nftOrderFlowOpen({
      step: NftOrderStepEnum.IMPORT_NFTS
    })
    analyticsActions.trackEvent({
      key: Analytics.NFT_BUY_ON_OPENSEA_CLICKED,
      properties: {}
    })
  }
  const BuyOnOpenseaClicked = () => {
    analyticsActions.trackEvent({
      key: Analytics.NFT_BUY_ON_OPENSEA_CLICKED,
      properties: {}
    })
  }
  return (
    <>
      {nftOwnerAssets.cata({
        Failure: () => null,
        Loading: () => null,
        NotAsked: () => null,
        Success: ({ assets }) => {
          const totalEthSpent = assets
            .filter((asset) => {
              return asset.last_sale?.payment_token?.eth_price
            })
            .map((asset) => Number(asset.last_sale.payment_token.eth_price))
            .reduce((prev_asset, curr_asset) => prev_asset + curr_asset, 0)
          const averageEthSpent = totalEthSpent / assets.length
          return assets.length ? (
            <NftPageV2>
              <HeaderContent>
                <Text size='32px' weight={600} color='grey900'>
                  My NFTs
                </Text>
                <Address justifyContent='space-between' alignItems='center'>
                  <CoinIcon name='ETH' />
                  <Text color='grey900' size='16px' weight={600}>
                    <CryptoAddress canCopy>{defaultEthAddr}</CryptoAddress>
                  </Text>
                </Address>
                <Flex>
                  <StatsWrapper style={{ margin: '0' }}>
                    <CustomStat>
                      <Text size='16px' weight={500} color='grey600'>
                        <FormattedMessage id='copy.total_items' defaultMessage='Total Items' />
                      </Text>
                      <Text size='16px' color='black' weight={600}>
                        {assets.length}
                      </Text>
                    </CustomStat>
                    <CustomStat>
                      <Text size='16px' weight={500} color='grey600'>
                        <FormattedMessage id='copy.avg_eth' defaultMessage='Average ETH Spent' />
                      </Text>
                      <Text size='16px' color='black' weight={600}>
                        {averageEthSpent.toString().substring(0, 4)} ETH
                      </Text>
                    </CustomStat>
                    <CustomStat>
                      <Text size='16px' weight={500} color='grey600'>
                        <FormattedMessage
                          id='copy.total_eth_spent'
                          defaultMessage='Total ETH Spent'
                        />
                      </Text>
                      <Text size='16px' color='black' weight={600}>
                        {totalEthSpent.toString().substring(0, 4)} ETH
                      </Text>
                    </CustomStat>
                  </StatsWrapper>
                </Flex>
              </HeaderContent>
              <GridWrapper>
                <NftGrid fullscreen>
                  {assets?.map((asset) => {
                    return (
                      <div key={asset.token_id}>
                        <NftViewResults asset={asset} />
                      </div>
                    )
                  })}
                </NftGrid>
              </GridWrapper>
            </NftPageV2>
          ) : (
            <NftPageV2>
              <Header>
                <Flex flexDirection='column'>
                  <HeaderContent>
                    <Text size='32px' weight={600} color='grey900'>
                      My NFTs
                    </Text>
                    <Address justifyContent='space-between' alignItems='center'>
                      <CoinIcon name='ETH' />
                      <Text color='grey900' size='16px' weight={600}>
                        <CryptoAddress canCopy>{defaultEthAddr}</CryptoAddress>
                      </Text>
                    </Address>
                  </HeaderContent>
                  <Body>
                    <Left>
                      <Image name='nft-import' />
                      <Text color='grey900' size='20px' weight={600}>
                        Add your NFTs
                      </Text>
                      <CustomText color='grey700' size='16px' weight={500}>
                        <FormattedMessage
                          id='scenes.nfts.view.already_have_nfts_from_somewhere'
                          defaultMessage='Already have NFTs somewhere else? Import them by sending from external
                        wallet to the address below.'
                        />
                      </CustomText>
                      <Button
                        onClick={AddNFTsClicked}
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
                        Buy an NFT using your Blockchain.com app and Walletconnect on Opensea or
                        Rarible.
                      </CustomText>
                      <Flex flexDirection='column' alignItems='center' gap={16}>
                        <Link href='https://opensea.com/' target='_blank'>
                          <Button
                            onClick={BuyOnOpenseaClicked}
                            width='300px'
                            nature='empty-blue'
                            data-e2e='buy-on-opensea'
                          >
                            <Flex gap={8}>
                              <Image name='opensea' height='16px' />
                              <FormattedMessage
                                id='copy.buy_on_opensea'
                                defaultMessage='Buy On Opensea'
                              />
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
                </Flex>
              </Header>
            </NftPageV2>
          )
        }
      })}
    </>
  )
}
const mapStateToProps = (state: RootState) => ({
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  nftOwnerAssets: selectors.components.nfts.getNftOwnerAssets(state)
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(View)
