import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { PaletteColors } from '@blockchain-com/constellation'
import {
  Asset,
  AssetCollection,
  AssetDetails,
  AssetImageContainer,
  AvatarGradientColors,
  PriceCTA
} from 'blockchain-wallet-v4-frontend/src/scenes/Nfts/components'
import Avatar from 'boring-avatars'
import styled from 'styled-components'

import { Button, Link, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import { Flex } from 'components/Flex'
import { actions } from 'data'
import { Analytics } from 'data/types'
import { AssetsQuery } from 'generated/graphql.types'
import { useMedia } from 'services/styles'

import NftCollectionImageSmall from './NftCollectionImageSmall'

const XSmallButton = styled(Button)`
  padding: 6px 8px;
  height: auto;
`

const HoverBackground = styled.div<{ background: string }>`
  background: ${(props) => props.background};
  background-size: 100%;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  font-size: 20px;
  justify-content: flex-end;
  text-align: left;
  width: 100%;
  &:hover {
    transform: scale(1.02);
    transition: 0.3s ease-out;
  }
`

const NotForSale = styled.div`
  background-color: ${PaletteColors['smoke-800']};
  border: 1px solid ${PaletteColors['smoke-600']};
  border-radius: 8px;
  padding: 0.5em;
  width: fit-content;
`

const OverflowText = styled(Text)`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
`

const NftAssetItem: React.FC<Props> = ({ asset, isAddressPage = false }) => {
  const [hover, setHover] = useState(false)
  const dispatch = useDispatch()
  const isMobile = useMedia('mobile')
  const isTablet = useMedia('tablet')

  const setHoverTrue = () => {
    if (!isMobile && !isTablet) {
      setHover(true)
    }
  }
  const logoClickTracking = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_NFT_CLICKED,
        properties: {
          collection_name: asset.collection.name,
          image_logo: true,
          name_click: false
        }
      })
    )
  }
  const nameClickTracking = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_NFT_CLICKED,
        properties: {
          collection_name: asset.collection.name,
          image_logo: false,
          name_click: true
        }
      })
    )
  }
  const viewDetailsTracking = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_VIEW_BUTTON_VIEWED,
        properties: {}
      })
    )
  }

  const lowestListing = asset.listings
    ? asset.listings.sort((a, b) => Number(a?.starting_price) - Number(b?.starting_price))[0]
    : null

  const image = asset.image_url

  return !hover ? (
    <Asset key={asset?.token_id} className='asset' onMouseEnter={() => setHoverTrue()}>
      <LinkContainer
        style={{ display: 'flex', height: 'fit-content', position: 'relative' }}
        to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}
      >
        <Link>
          {image ? (
            <AssetImageContainer
              className='asset-image-container'
              background={`url(${image.replace(/=s\d*/, '')})`}
            />
          ) : (
            <AssetImageContainer
              className='asset-image-container'
              background='linear-gradient(127.95deg, #DADADA 0%, #F4F7FB 0.01%, #2F7CF6 100%)'
            />
          )}
        </Link>
      </LinkContainer>
      <AssetDetails>
        <Flex flexDirection='column' gap={8}>
          <OverflowText
            size='18px'
            style={{
              marginTop: '4px'
            }}
            color='white'
            weight={600}
          >
            #{asset?.token_id}
          </OverflowText>
          <LinkContainer
            onClick={logoClickTracking}
            to={`/nfts/collection/${asset.collection.slug}`}
          >
            <Link>
              <Flex alignItems='center' gap={8}>
                {asset.collection.image_url ? (
                  <NftCollectionImageSmall
                    isVerified={asset.collection.safelist_request_status === 'verified'}
                    alt='Dapp Logo'
                    src={asset.collection.image_url}
                    height='24px'
                    width='24px'
                  />
                ) : (
                  <Avatar
                    size={24}
                    name={asset.collection.slug || ''}
                    variant='marble'
                    colors={AvatarGradientColors}
                  />
                )}
                <AssetCollection onClick={nameClickTracking}>
                  <Text
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    size='14px'
                    color='white'
                    weight={600}
                  >
                    {asset?.collection?.name}
                  </Text>
                </AssetCollection>
              </Flex>
            </Link>
          </LinkContainer>
        </Flex>

        <PriceCTA>
          <LinkContainer to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}>
            {lowestListing && lowestListing.starting_price ? (
              <Flex flexDirection='column' gap={4} alignItems='flex-start'>
                <Text size='14px' weight={500} color='grey400'>
                  <FormattedMessage id='copy.buy_now' defaultMessage='Buy Now' />
                </Text>
                <LinkContainer to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}>
                  <Link>
                    <CoinDisplay
                      coin={lowestListing.payment_token_symbol || 'ETH'}
                      size='16px'
                      weight={500}
                      lineHeight='21px'
                      style={{
                        background: 'linear-gradient(92.99deg, #9080FF 0.55%, #65A5FF 98.76%)',
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        webkitBackgroundClip: 'text',
                        webkitTextFillColor: 'transparent'
                      }}
                    >
                      {lowestListing.starting_price}
                    </CoinDisplay>
                  </Link>
                </LinkContainer>
              </Flex>
            ) : (
              <NotForSale style={{ marginBottom: '1em' }}>
                {isAddressPage ? (
                  <Text weight={500} color='white'>
                    <FormattedMessage id='copy.see_details' defaultMessage='See Details' />
                  </Text>
                ) : (
                  <Text weight={500} color='white'>
                    <FormattedMessage id='copy.not_for_sale' defaultMessage='Not For Sale' />
                  </Text>
                )}
              </NotForSale>
            )}
          </LinkContainer>
        </PriceCTA>
      </AssetDetails>
    </Asset>
  ) : (
    <Asset onMouseLeave={() => setHover(false)}>
      <LinkContainer
        style={
          image
            ? {
                background: 'black',
                display: 'flex',
                height: '100%',
                position: 'relative',
                zIndex: '2'
              }
            : { display: 'flex', height: '100%', position: 'relative' }
        }
        to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}
      >
        <Link>
          <HoverBackground
            background={
              image
                ? `linear-gradient(180deg, rgba(0, 0, 0, .8) 0%, #0E121B 100%), url(${image.replace(
                    /=s\d*/,
                    ''
                  )})`
                : `linear-gradient(180deg, rgba(0, 0, 0, .8) 0%, #0E121B 100%)`
            }
          >
            {' '}
            <div style={{ padding: '1em' }}>
              {image ? (
                <img
                  alt='asset'
                  width='80px'
                  height='auto'
                  style={{ borderRadius: '8px' }}
                  src={image.replace(/=s\d*/, '')}
                />
              ) : null}
              <OverflowText size='18px' weight={600} lineHeight='150%' color='white'>
                #{asset?.token_id}
              </OverflowText>
              <Flex alignItems='center' gap={8}>
                {asset.collection.image_url ? (
                  <NftCollectionImageSmall
                    isVerified={asset.collection.safelist_request_status === 'verified'}
                    alt='Dapp Logo'
                    src={asset.collection.image_url}
                    height='24px'
                    width='24px'
                  />
                ) : (
                  <Avatar
                    size={24}
                    name={asset.collection.slug || ''}
                    variant='marble'
                    colors={AvatarGradientColors}
                  />
                )}
                <Text weight={600} lineHeight='150%' color='white'>
                  {asset?.collection?.name}
                </Text>
              </Flex>
              <PriceCTA style={{ margin: '12px 0' }}>
                <LinkContainer to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}>
                  {lowestListing && lowestListing.starting_price ? (
                    <Flex flexDirection='column' gap={4} alignItems='flex-start'>
                      <Text size='14px' weight={500} color='grey400'>
                        <FormattedMessage id='copy.buy_now' defaultMessage='Buy Now' />
                      </Text>
                      <LinkContainer
                        to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}
                      >
                        <Link>
                          <CoinDisplay
                            coin={lowestListing.payment_token_symbol || 'ETH'}
                            size='16px'
                            weight={500}
                            lineHeight='21px'
                            style={{
                              background:
                                'linear-gradient(92.99deg, #9080FF 0.55%, #65A5FF 98.76%)',
                              backgroundClip: 'text',
                              textFillColor: 'transparent',
                              webkitBackgroundClip: 'text',
                              webkitTextFillColor: 'transparent'
                            }}
                          >
                            {lowestListing.starting_price}
                          </CoinDisplay>
                        </Link>
                      </LinkContainer>
                    </Flex>
                  ) : isAddressPage ? (
                    <NotForSale>
                      <Text style={{ paddingBottom: '0.4em' }} weight={500} color='white'>
                        <FormattedMessage id='copy.see_details' defaultMessage='See Details' />
                      </Text>
                      <Text size='12px' weight={500} color='white'>
                        <FormattedMessage
                          id='copy.click_to_view_more'
                          defaultMessage='Click to view more information about this NFT.'
                        />
                      </Text>
                    </NotForSale>
                  ) : (
                    <NotForSale>
                      <Text style={{ paddingBottom: '0.4em' }} weight={500} color='white'>
                        <FormattedMessage id='copy.not_for_sale' defaultMessage='Not For Sale' />
                      </Text>
                      <Text size='12px' weight={500} color='white'>
                        <FormattedMessage
                          id='copy.item_not_for_sale'
                          defaultMessage='You can still make offers with ERC-20 assets like WETH'
                        />
                      </Text>
                    </NotForSale>
                  )}
                </LinkContainer>
              </PriceCTA>
              <Button style={{ bottom: '0px' }} nature='dark-grey' data-e2e='details' fullwidth>
                See Details
              </Button>
            </div>
          </HoverBackground>
        </Link>
      </LinkContainer>
    </Asset>
  )
}

type Props = {
  asset: AssetsQuery['assets'][0]
  isAddressPage?: boolean
}

export default NftAssetItem
