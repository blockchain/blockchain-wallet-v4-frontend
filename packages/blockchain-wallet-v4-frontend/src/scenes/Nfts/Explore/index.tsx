import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { SpinningLoader } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { TableWrapper } from '../../Prices/Table'
import { NftPageV2 } from '../components'
import TrendingCollectionsTable from './TrendingCollectionsTable'

const Explore: React.FC<Props> = (props) => {
  useEffect(() => {
    props.nftsActions.fetchNftCollections({})
  }, [])

  return (
    <NftPageV2>
      <h1>BANNER</h1>
      <h3>TRENDING COLLECTIONS</h3>
      {props.collections.cata({
        Failure: () => null,
        Loading: () => <SpinningLoader width='14px' height='14px' borderWidth='3px' />,
        NotAsked: () => null,
        Success: (val) => {
          return <TrendingCollectionsTable collections={val} />

          return val
            .slice(0, 9)
            .map((collection) => <div key={collection.name}>{collection.name}</div>)
        }
      })}
    </NftPageV2>
  )
}

const mapStateToProps = (state: RootState) => ({
  collections: selectors.components.nfts.getNftCollections(state)
})

const mapDispatchToProps = (dispatch) => ({
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Explore)
