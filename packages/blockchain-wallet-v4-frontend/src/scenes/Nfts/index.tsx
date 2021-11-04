import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import Marketplace from './Marketplace'
import YourCollection from './YourCollection'

const DEFAULT_NFTS = [
  {
    asset_contract_address: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e',
    display_name: 'Doodles',
    image_url:
      'https://lh3.googleusercontent.com/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ=s120',
    opensea_slug: 'doodles-official',
    total_supply: 10000
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
  listOfRemoteOrders: selectors.components.nfts.getNftOrders(state),
  marketplace: selectors.components.nfts.getMarketplace(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Nfts)
