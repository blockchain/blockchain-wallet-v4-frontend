import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import ReactMarkdown from 'react-markdown'
import { connect, ConnectedProps } from 'react-redux'
import { PaletteColors } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'
import NftDropdown from 'blockchain-wallet-v4-frontend/src/modals/Nfts/components/NftDropdown'
import {
  AvatarGradientColors,
  LinksContainer
} from 'blockchain-wallet-v4-frontend/src/scenes/Nfts/components'
import Avatar from 'boring-avatars'
import { formatDistanceToNow } from 'date-fns'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { NftAsset as NftAssetType, WyvernRawOrder } from '@core/network/api/nfts/types'
import { WalletOptionsType } from '@core/types'
import { Button, Icon as BlockchainIcon, Image, Link, Text } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import CoinDisplay from 'components/Display/CoinDisplay'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { RootState } from 'data/rootReducer'
import { Analytics } from 'data/types'
import { isMobile, media, useMedia } from 'services/styles'

import {
  AssetName,
  CollectionName,
  CustomLink,
  LeftColWrapper,
  RightColWrapper,
  Top,
  Trait,
  TraitsWrapper,
  Wrapper
} from '../Asset/components'
import NftCollectionImage from '../components/NftCollectionImage'

const AssetImageContainer = styled.div`
  position: relative;
  border-radius: 16px;
  ${media.tablet`
    padding: 0;
  `};
`

const AssetImg = styled.img`
  object-fit: cover;
  height: 115vh;
  ${media.tablet`
    height: 100%;
  `};
`

export const ResultImg = styled.img`
  border-radius: 18px;
  object-fit: cover;
  box-sizing: border-box;
  cursor: pointer;
  width: 175px;
  height: 175px;
  &:hover {
    box-shadow: 0px 0px 12px 0px ${(props) => props.theme.grey200};
  }
  ${media.laptop`
  width: 100%;
  height: 175px;
`};
`
export const EmptyState = styled.div`
  border-radius: 18px;
  width: 175px;
  height: 175px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  object-fit: cover;
  box-sizing: border-box;
  background: rgb(192, 217, 252);
  background: radial-gradient(
    circle,
    rgba(192, 217, 252, 1) 0%,
    rgba(255, 255, 255, 1) 100%,
    rgba(194, 218, 252, 1) 100%,
    rgba(12, 108, 242, 1) 100%
  );
  ${media.laptop`
  width: 100%;
  height: 175px;
`};
`

const Description = styled.div`
  margin: 1em 0em;
  padding: 1em;
  background: rgb(240, 242, 247, 0.3);
  border: 1px solid ${(props) => props.theme.greyFade000};
  border-radius: 16px;
`

const CreatorOwnerAddress = styled.div`
  font-size: 16px;
  color: ${PaletteColors['grey-700']};
  display: flex;
`

const CreatorOwnerAddressLinkText = styled(CreatorOwnerAddress)`
  color: ${PaletteColors['blue-600']};
  font-weight: 600;
`

const TokenDisplay = styled(Text)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 200px;
  text-align: right;
`
const DropdownPadding = styled.div`
  padding-bottom: 1em;
`

const Detail = styled(Text)`
  display: flex;
  justify-content: space-between;
  color: ${PaletteColors['grey-900']};
  padding: 1em 1.5em;
  border-bottom: 1px solid ${PaletteColors['grey-000']};
  font-size: 16px;
  font-weight: 500;
  &:last-child {
    border-bottom: none;
  }
`

const ShadowTag = styled.div`
  background: ${PaletteColors['white-900']};
  box-shadow: 0px 4px 16px rgba(5, 24, 61, 0.1);
  border-radius: 16px;
  padding: 6px 6px;
  width: fit-content;
`

const CollectionHeader = styled.div`
  ${media.atLeastTablet`
    justify-content: left;
    // gap: 24px;
  `};
  display: flex;
  margin-top: 2px;
  width: 100%;
  justify-content: space-between;
  ${media.mobile`
    padding-top: 32px;
  `};
`

const ItemDetails = styled.div`
  padding: 32px 0em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MarginButton = styled(Button)`
  margin: 1em 0;
`

const DetailsAndOffers = styled.div``

const NftAssetViewOnly: React.FC<Props> = ({
  analyticsActions,
  nftOwnerAssets,
  nftsActions,
  routerActions,
  ...rest
}) => {
  const goToView = () => {
    routerActions.push(`/nfts/view`)
  }
  const { contract, id } = rest.computedMatch.params
  const [moreAssetToggle, setMoreAssetToggle] = useState(true)
  const transferClicked = () => {
    nftsActions.nftOrderFlowOpen({
      asset_contract_address: contract,
      step: NftOrderStepEnum.TRANSFER,
      token_id: id
    })
    analyticsActions.trackEvent({
      key: Analytics.NFT_TRANSFER_CLICKED,
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
          const asset = assets.find((asset) => {
            return asset?.asset_contract.address === contract && asset?.token_id === id
          })
          return asset ? (
            <Wrapper>
              <div>
                <div style={{ display: 'block' }}>
                  <Top>
                    <LeftColWrapper>
                      {isMobile() && (
                        <ItemDetails>
                          <Text color='grey900' size='20px' weight={600}>
                            Item Details
                          </Text>
                          <BlockchainIcon
                            cursor
                            data-e2e='close'
                            name='close'
                            size='20px'
                            color='grey600'
                            role='button'
                            onClick={() => goToView()}
                          />
                        </ItemDetails>
                      )}
                      <AssetImageContainer>
                        {asset?.image_url ? (
                          <AssetImg alt='Asset Logo' width='100%' src={asset?.image_url || ''} />
                        ) : (
                          <Image width='100%' height='100%' name='nft-img-placeholder' />
                        )}
                      </AssetImageContainer>
                    </LeftColWrapper>
                    <RightColWrapper>
                      {!isMobile() && (
                        <ItemDetails>
                          <Text color='grey900' size='20px' weight={600}>
                            Item Details
                          </Text>
                          <BlockchainIcon
                            cursor
                            data-e2e='close'
                            name='close'
                            size='20px'
                            color='grey600'
                            role='button'
                            onClick={() => goToView()}
                          />
                        </ItemDetails>
                      )}
                      <CollectionHeader>
                        <div>
                          <Text
                            size='14px'
                            weight={600}
                            style={{
                              alignItems: 'center',
                              padding: '0em 0em 0.5em 0em'
                            }}
                          >
                            Collection
                          </Text>
                          <div style={{ padding: '6px 0px' }}>
                            <ShadowTag>
                              <CollectionName>
                                {asset?.image_url ? (
                                  <NftCollectionImage
                                    alt='Dapp Logo'
                                    src={asset?.image_url || ''}
                                    isVerified={false}
                                    // isVerified={asset?.safelist_request_status === 'verified'}
                                  />
                                ) : (
                                  <Flex alignItems='center' flexDirection='row'>
                                    <Avatar
                                      size={34}
                                      name={asset?.image_url || ''}
                                      variant='marble'
                                      colors={AvatarGradientColors}
                                    />
                                  </Flex>
                                )}
                                <Text
                                  size='16px'
                                  weight={600}
                                  style={{
                                    maxWidth: '250px',
                                    overflow: 'hidden',
                                    paddingLeft: '8px',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {asset?.asset_contract.name}
                                </Text>
                              </CollectionName>
                            </ShadowTag>
                          </div>
                        </div>
                      </CollectionHeader>
                      <AssetName>
                        {asset?.token_id && asset?.token_id.length > 12
                          ? `#${asset?.token_id.substring(0, 12)}...`
                          : `#${asset?.token_id}`}
                      </AssetName>
                      {asset?.description !== '' && asset?.description?.length ? (
                        <Description>
                          <Flex flexDirection='column'>
                            <Text size='16px' color='grey900' weight={600}>
                              <FormattedMessage
                                id='copy.description'
                                defaultMessage='Description'
                              />
                            </Text>
                            <Text
                              size='16px'
                              color='grey900'
                              weight={500}
                              style={{ wordBreak: 'break-word' }}
                            >
                              {moreAssetToggle && asset.description.length > 82 ? (
                                <ReactMarkdown linkTarget='_blank'>
                                  {`${asset?.description.substring(0, 82)}...`}
                                </ReactMarkdown>
                              ) : (
                                <ReactMarkdown linkTarget='_blank'>
                                  {asset.description}
                                </ReactMarkdown>
                              )}
                            </Text>
                            {asset?.description?.length > 82 && (
                              <Text
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  if (asset.description?.length > 82)
                                    setMoreAssetToggle(!moreAssetToggle)
                                }}
                                size='16px'
                                color='blue600'
                                weight={600}
                              >
                                {moreAssetToggle ? (
                                  <FormattedMessage id='copy.more' defaultMessage='See More' />
                                ) : (
                                  <FormattedMessage id='copy.less' defaultMessage='Less' />
                                )}
                              </Text>
                            )}
                          </Flex>
                        </Description>
                      ) : null}
                      <MarginButton
                        onClick={transferClicked}
                        fullwidth
                        data-e2e='transfer-nft'
                        nature='primary'
                      >
                        Transfer NFT
                      </MarginButton>
                      {asset && asset.traits && asset.traits.length ? (
                        <DropdownPadding>
                          <NftDropdown expanded title='Traits'>
                            <div style={{ padding: '1em' }}>
                              <Flex flexDirection='column'>
                                <TraitsWrapper>
                                  {asset.traits.map((trait) => {
                                    if (!trait) return null

                                    const assetTraits = asset.traits.find(
                                      (t) => t?.trait_type === trait.trait_type
                                    )
                                    const traitCount = assetTraits?.trait_count
                                    const rarity =
                                      traitCount && asset.asset_contract.total_supply
                                        ? `${parseFloat(
                                            (
                                              (traitCount / asset?.asset_contract.total_supply) *
                                              100
                                            ).toFixed(1)
                                          )}% Rarity`
                                        : 'New Trait'

                                    return (
                                      <Trait key={trait.value}>
                                        <Text color='grey700' capitalize size='12px' weight={400}>
                                          <b>{trait?.trait_type}</b>
                                        </Text>
                                        <Text capitalize color='grey900' size='14px' weight={600}>
                                          {trait?.value}
                                        </Text>
                                      </Trait>
                                    )
                                  })}
                                </TraitsWrapper>
                              </Flex>
                            </div>
                          </NftDropdown>
                        </DropdownPadding>
                      ) : null}
                      <DropdownPadding>
                        <NftDropdown expanded title='Details'>
                          <DetailsAndOffers>
                            <Detail>
                              <Text size='16px' weight={500} color='grey900'>
                                Blockchain
                              </Text>{' '}
                              <Text capitalize size='16px' weight={600} color='grey600'>
                                Ethereum
                              </Text>
                            </Detail>
                            <Detail>
                              <Text size='16px' weight={500} color='grey900'>
                                Contract Address
                              </Text>

                              {asset?.asset_contract?.address ? (
                                <Link
                                  href={`https://www.blockchain.com/eth/address/${asset?.asset_contract?.address}`}
                                  target='_blank'
                                >
                                  <CreatorOwnerAddressLinkText>
                                    <CryptoAddress>{asset?.asset_contract?.address}</CryptoAddress>
                                  </CreatorOwnerAddressLinkText>
                                </Link>
                              ) : (
                                <Text size='16px' weight={500}>
                                  Not Available
                                </Text>
                              )}
                            </Detail>
                            <Detail>
                              <Text size='16px' weight={500} color='grey900'>
                                Token ID
                              </Text>

                              <TokenDisplay size='16px' weight={600} color='grey600'>
                                {asset.token_id?.length > 20 ? (
                                  <CryptoAddress canCopy>{asset?.token_id}</CryptoAddress>
                                ) : (
                                  asset?.token_id
                                )}
                              </TokenDisplay>
                            </Detail>
                            <Detail>
                              <Text size='16px' weight={500} color='grey900'>
                                Token Standard
                              </Text>{' '}
                              <Text size='16px' weight={600} color='grey600'>
                                {asset?.asset_contract?.schema_name}
                              </Text>
                            </Detail>
                          </DetailsAndOffers>
                        </NftDropdown>
                      </DropdownPadding>
                    </RightColWrapper>
                  </Top>
                </div>
              </div>
            </Wrapper>
          ) : null
        }
      })}
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  nftOwnerAssets: selectors.components.nfts.getNftOwnerAssets(state)
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & {
  computedMatch: { params: { contract: string; id: string } }
  isTestnet: boolean
}

export default connector(NftAssetViewOnly)
