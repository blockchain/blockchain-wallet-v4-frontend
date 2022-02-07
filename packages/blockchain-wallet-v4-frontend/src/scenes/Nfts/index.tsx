import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import NftHeader from './Header'
import Marketplace from './Marketplace'
import Offers from './Offers'
import YourCollection from './YourCollection'

const NftPage = styled.div`
  width: 100%;
`

const Nfts: React.FC<Props> = (props) => {
  useEffect(() => {
    props.nftsActions.fetchNftCollections({})
  }, [])

  const setActiveTab = (tab: 'explore' | 'my-collection' | 'offers') => {
    props.nftsActions.setActiveTab(tab)
  }

  return (
    <NftPage>
      <NftHeader {...props} setActiveTab={setActiveTab} />
      {props.activeTab === 'explore' ? <Marketplace {...props} /> : null}
      {props.activeTab === 'my-collection' ? (
        <YourCollection {...props} setActiveTab={setActiveTab} />
      ) : null}
      {props.activeTab === 'offers' ? <Offers {...props} /> : null}
    </NftPage>
  )
}

const mapStateToProps = (state: RootState) => ({
  activeTab: selectors.components.nfts.getNftActiveTab(state),
  assets: selectors.components.nfts.getNftAssets(state),
  collectionSearch: selectors.components.nfts.getCollectionSearch(state),
  collections: selectors.components.nfts.getNftCollections(state),
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  formValues: selectors.form.getFormValues('nftMarketplace')(state),
  marketplace: selectors.components.nfts.getMarketplace(state),
  offersMade: selectors.components.nfts.getOffersMade(state),
  openSeaStatus: selectors.components.nfts.getOpenSeaStatus(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Nfts)
