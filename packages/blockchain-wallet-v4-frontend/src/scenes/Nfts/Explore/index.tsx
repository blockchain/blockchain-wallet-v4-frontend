import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Icon, SpinningLoader, Text } from 'blockchain-info-components'
import Spacer from 'components/Spacer'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { useMedia } from 'services/styles'

import { Collection, CollectionBanner, CollectionImage, Grid, NftPage } from '../components'

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

const Explore: React.FC<Props> = (props) => {
  const laptopL = useMedia('laptopL')
  useEffect(() => {
    props.nftsActions.fetchNftCollections({})
  }, [])

  return (
    <NftPage>
      <Grid>
        {props.collections.cata({
          Failure: () => null,
          Loading: () => <SpinningLoader width='14px' height='14px' borderWidth='3px' />,
          NotAsked: () => null,
          Success: (val) =>
            val.map((collection) => (
              <Collection
                onClick={() => props.routerActions.push(`/nfts/${collection.slug}`)}
                key={collection.collection_data.image_url}
              >
                <CollectionBanner
                  background={`url(${collection.collection_data.banner_image_url})`}
                />
                <CollectionImage src={collection.collection_data.image_url} />
                <Text
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: laptopL ? '24px' : '38px',
                    minHeight: '26px',
                    textAlign: 'center'
                  }}
                  size={
                    collection.name.length < 26
                      ? laptopL
                        ? '16px'
                        : '22px'
                      : laptopL
                      ? '12px'
                      : '16px'
                  }
                  weight={600}
                  color='grey900'
                >
                  {collection.name}
                </Text>
                <Stats>
                  <div>
                    <Text size='12px' weight={600} color='grey700'>
                      <FormattedMessage defaultMessage='Floor Price' id='copy.floor_price' />
                    </Text>
                    <Text
                      size='16px'
                      weight={600}
                      color='grey900'
                      style={{ alignItems: 'center', display: 'flex', marginTop: '4px' }}
                    >
                      {collection.collection_data.stats.floor_price}{' '}
                      <Icon name='ETH' style={{ marginLeft: '3px' }} />
                    </Text>
                  </div>
                  <Spacer />
                  <div>
                    <Text size='12px' weight={600} color='grey700'>
                      <FormattedMessage defaultMessage='One Day Volume' id='copy.one_day_vol' />
                    </Text>
                    <Text
                      size='16px'
                      weight={600}
                      color='grey900'
                      style={{ alignItems: 'center', display: 'flex', marginTop: '4px' }}
                    >
                      {Number(collection.collection_data.stats.one_day_volume).toFixed(2)}
                      <Icon name='ETH' style={{ marginLeft: '3px' }} />
                    </Text>
                  </div>
                  <Spacer />
                  <div>
                    <Text size='12px' weight={600} color='grey700'>
                      <FormattedMessage defaultMessage='7 Day Sales' id='copy.seven_day_sales' />
                    </Text>
                    <Text size='16px' weight={600} color='grey900' style={{ marginTop: '4px' }}>
                      {collection.collection_data.stats.seven_day_sales}
                    </Text>
                  </div>
                </Stats>
              </Collection>
            ))
        })}
      </Grid>
    </NftPage>
  )
}

const mapStateToProps = (state: RootState) => ({
  collections: selectors.components.nfts.getNftCollections(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Explore)
