import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import Marketplace from './Marketplace'
import YourCollection from './YourCollection'

const DEFAULT_NFTS = [
  {
    display_name: 'Doodles',
    image_url:
      'https://lh3.googleusercontent.com/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ=s120',
    opensea_slug: 'doodles-official'
  }
]

const Nfts: React.FC<Props> = (props) => {
  const { nftsActions } = props

  useEffect(() => {
    nftsActions.fetchNftAssets()
  }, [])

  return (
    <div>
      <YourCollection {...props} />
      <Marketplace {...props} />
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  assetsR: selectors.components.nfts.getNftAssets(state),
  collections: selectors.core.walletOptions.getNfts(state).getOrElse(DEFAULT_NFTS),
  marketplace: selectors.components.nfts.getMarketplace(state),
  orders: selectors.components.nfts.getNftOrders(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Nfts)
