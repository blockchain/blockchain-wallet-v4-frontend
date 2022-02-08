import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Link, SpinningLoader, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'

import { Props as OwnProps } from '..'
import {
  Asset,
  AssetCollection,
  AssetDetails,
  CTAWrapper,
  ImageContainer,
  LazyLoadWrapper,
  NftPageWrapper,
  PriceInfo,
  StyledCoinDisplay
} from '../components'
import MarketForm from './MarketForm'
import MarketList from './MarketList'

const MarketplaceAsset = styled(Asset)``

const Marketplace: React.FC<Props> = (props: Props) => {
  const { marketplace, nftsActions } = props

  return (
    <NftPageWrapper>
      <MarketForm {...props} />
      <MarketList
        slug={props.marketplace.collection?.slug || 'doodles-official'}
        nftsActions={nftsActions}
      />
      {props.marketplace.atBound ? <div>No more NFTs for sale in this collection</div> : null}
    </NftPageWrapper>
  )
}

type Props = OwnProps

export default Marketplace
