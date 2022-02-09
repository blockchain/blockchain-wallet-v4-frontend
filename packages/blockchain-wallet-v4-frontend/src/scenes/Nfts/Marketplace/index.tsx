import React from 'react'

import { Props as OwnProps } from '..'
import { NftPageWrapper } from '../components'
import MarketForm from './MarketForm'
import MarketList from './MarketList'

const Marketplace: React.FC<Props> = (props: Props) => {
  const { nftsActions } = props

  return (
    <NftPageWrapper>
      <MarketForm {...props} />
      <MarketList
        slug={props.marketplace.collection?.slug || 'doodles-official'}
        nftsActions={nftsActions}
      />
    </NftPageWrapper>
  )
}

type Props = OwnProps

export default Marketplace
