import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const Nfts: React.FC<Props> = ({ assetsR, nftsActions }) => {
  useEffect(() => {
    nftsActions.fetchNftAssets()
  }, [])

  return (
    <div>
      {assetsR.cata({
        Failure: (e) => e,
        Loading: () => 'Loading...',
        NotAsked: () => 'Loading...',
        Success: (assets) =>
          assets.map((asset) => {
            return <div key={asset.token_id}>{asset.name}</div>
          })
      })}
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  assetsR: selectors.components.nfts.getNftAssets(state)
})

const mapDispatchToProps = (dispatch) => ({
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(Nfts)
