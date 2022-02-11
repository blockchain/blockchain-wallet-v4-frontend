import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { SpinningLoader, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { Collection, CollectionBanner, CollectionImage, Grid } from '../components'

const Explore: React.FC<Props> = (props) => {
  useEffect(() => {
    props.nftsActions.fetchNftCollections({})
  }, [])

  return (
    <>
      {props.collections.cata({
        Failure: () => null,
        Loading: () => <SpinningLoader width='14px' height='14px' borderWidth='3px' />,
        NotAsked: () => null,
        Success: (val) => (
          <Grid>
            <div>
              {val.map((collection) => (
                <Collection key={collection.collection_data.image_url}>
                  <CollectionBanner
                    background={`url(${collection.collection_data.banner_image_url})`}
                  />
                  <CollectionImage src={collection.collection_data.image_url} />
                  <Text
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '38px',
                      textAlign: 'center'
                    }}
                    size='24px'
                    weight={600}
                    color='grey900'
                  >
                    {collection.name}
                  </Text>
                  {/* TODO */}
                </Collection>
              ))}
            </div>
          </Grid>
        )
      })}
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  collections: selectors.components.nfts.getNftCollections(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Explore)
