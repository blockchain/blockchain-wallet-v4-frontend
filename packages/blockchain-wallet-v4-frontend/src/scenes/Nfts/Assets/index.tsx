import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Dispatch } from '@reduxjs/toolkit'
import { bindActionCreators } from 'redux'

import { Button, Link, SpinningLoader, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { RootState } from 'data/rootReducer'

import {
  Asset,
  AssetCollection,
  AssetDetails,
  AssetImageContainer,
  CTAWrapper,
  LazyLoadWrapper,
  StyledCoinDisplay
} from '../components'
import AssetsForm from './AssetsForm'

const YourCollection: React.FC<Props> = (props) => {
  useEffect(() => {
    props.nftsActions.fetchNftAssets()
  }, [])

  const assets =
    props.assets.collection === 'all'
      ? props.assets.list
      : props.assets.list.filter((asset) => asset.collection.slug === props.assets.collection)

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <AssetsForm {...props} />
      <LazyLoadWrapper onLazyLoad={() => props.nftsActions.fetchNftAssets()}>
        {assets.map((asset) => {
          if (!asset) return null
          return (
            <Asset key={asset.token_id}>
              <AssetImageContainer
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
              </AssetDetails>
              <CTAWrapper>
                <Button
                  fullwidth
                  data-e2e='sellNft'
                  nature='primary'
                  onClick={() =>
                    props.nftsActions.nftOrderFlowOpen({
                      asset_contract_address: asset.asset_contract.address,
                      step: NftOrderStepEnum.MARK_FOR_SALE,
                      token_id: asset.token_id,
                      walletUserIsAssetOwnerHack: true
                    })
                  }
                >
                  <FormattedMessage id='copy.view_details' defaultMessage='View Details' />
                </Button>
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
              Your collection is looking a bit empty there.
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
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  assets: selectors.components.nfts.getNftAssets(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(YourCollection)
