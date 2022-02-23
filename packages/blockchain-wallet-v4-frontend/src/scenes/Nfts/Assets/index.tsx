import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { NftAsset } from '@core/network/api/nfts/types'
import { Button, Link, SpinningLoader, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import {
  Asset,
  AssetCollection,
  AssetDetails,
  AssetImageContainer,
  CTAWrapper,
  LazyLoadWrapper,
  PriceCTA,
  StyledCoinDisplay
} from '../components'

const Assets: React.FC<Props> = (props) => {
  useEffect(() => {
    props.nftsActions.fetchNftAssets()
  }, [])

  const openAsset = (asset: NftAsset) => {
    props.nftsActions.nftOrderFlowOpen({
      asset_contract_address: asset.asset_contract.address!,
      token_id: asset.token_id!,
      walletUserIsAssetOwnerHack: true
    })
  }

  return (
    <>
      <LazyLoadWrapper onLazyLoad={() => props.nftsActions.fetchNftAssets()}>
        {props.assets.list.map((asset) => {
          if (!asset) return null
          return (
            <Asset key={asset.token_id}>
              <AssetImageContainer
                onClick={() => openAsset(asset)}
                backgroundColor={`#${asset.background_color}` || '#fff'}
                background={`url(${asset.image_url})`}
              />
              <AssetDetails>
                <div>
                  <AssetCollection>
                    <Text style={{ whiteSpace: 'nowrap' }} size='14px' color='grey800' weight={600}>
                      {asset.collection.name}
                    </Text>
                  </AssetCollection>
                  <Text style={{ marginTop: '4px' }} size='16px' color='black' weight={600}>
                    {asset.name}
                  </Text>
                </div>
                <PriceCTA>
                  <div>
                    <Text size='12px' color='black' weight={600}>
                      <FormattedMessage id='copy.last_sale' defaultMessage='Last Sale' />
                    </Text>
                    {asset.last_sale ? (
                      <Text color='black' style={{ display: 'flex', marginTop: '4px' }}>
                        <StyledCoinDisplay
                          size='14px'
                          color='black'
                          weight={600}
                          coin={asset.last_sale.payment_token.symbol}
                        >
                          {asset.last_sale.total_price}
                        </StyledCoinDisplay>
                        &nbsp;-&nbsp;
                        <FiatDisplay
                          size='12px'
                          color='grey600'
                          weight={600}
                          coin={asset.last_sale.payment_token.symbol}
                        >
                          {asset.last_sale.total_price}
                        </FiatDisplay>
                      </Text>
                    ) : (
                      <Text color='grey600' size='12px' weight={600}>
                        N/A
                      </Text>
                    )}
                  </div>
                  <Button
                    fullwidth
                    data-e2e='sellNft'
                    nature='primary'
                    onClick={() => openAsset(asset)}
                  >
                    <FormattedMessage id='copy.view_details' defaultMessage='View Details' />
                  </Button>
                </PriceCTA>
              </AssetDetails>
              <CTAWrapper>
                <Link
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    marginTop: '14px',
                    textAlign: 'center',
                    width: '100%'
                  }}
                  size='11px'
                  href={asset.permalink}
                  target='_blank'
                >
                  View on OpenSea
                </Link>
              </CTAWrapper>
            </Asset>
          )
        })}
        {props.assets.isLoading ? (
          <SpinningLoader width='14px' height='14px' borderWidth='3px' />
        ) : null}
        {props.assets.atBound && props.assets.collection === 'all' ? (
          props.assets.list.length === 0 ? (
            <Text weight={600}>
              <span aria-label='flag' role='img'>
                🏴‍☠️
              </span>{' '}
              Your collection is looking a bit empty there. How about{' '}
              <Link onClick={() => props.routerActions.push('/nfts')} weight={600}>
                exploring the market?
              </Link>
            </Text>
          ) : (
            <Text weight={600}>
              <span aria-label='cry' role='img'>
                😭
              </span>{' '}
              No more NFTs to view!
            </Text>
          )
        ) : null}
      </LazyLoadWrapper>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  assets: selectors.components.nfts.getNftAssets(state)
})

const mapDispatchToProps = (dispatch) => ({
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(Assets)
