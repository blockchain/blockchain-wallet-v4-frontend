import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import Marketplace from './Marketplace'
import YourCollection from './YourCollection'

const Nfts: React.FC<Props> = ({ assetsR, nftsActions, ordersR }) => {
  useEffect(() => {
    nftsActions.fetchNftAssets()
    nftsActions.fetchNftOrders()
  }, [])

  return (
    <div>
      <Marketplace ordersR={ordersR} />
      <YourCollection assetsR={assetsR} />
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  assetsR: selectors.components.nfts.getNftAssets(state),
  ordersR: selectors.components.nfts.getNftOrders(state)
})

const mapDispatchToProps = (dispatch) => ({
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(Nfts)
