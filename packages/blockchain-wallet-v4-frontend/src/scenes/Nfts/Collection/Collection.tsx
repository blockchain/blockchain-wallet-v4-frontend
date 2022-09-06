import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import {
  IconComputer,
  IconInstagram,
  IconLink,
  IconTwitter,
  PaletteColors
} from '@blockchain-com/constellation'
import {
  AvatarGradientColors,
  CollectionHeader,
  CollectionInfoWrapper,
  GridWrapper,
  LinksContainer,
  NftBannerWrapper,
  NftPageFullWidth,
  opensea_event_types
} from 'blockchain-wallet-v4-frontend/src/scenes/Nfts/components'
import Avatar from 'boring-avatars'
import { bindActionCreators, compose } from 'redux'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  CollectionFilterFields,
  EventFilterFields,
  useCollectionsQuery
} from 'generated/graphql.types'
import { media, useMedia } from 'services/styles'

import { FIXED_HEADER_HEIGHT } from '../../../layouts/Nfts/NftsHeader'
import NftCollectionImage from '../components/NftCollectionImage'
import NftError from '../components/NftError'
import OpenSeaStatusComponent from '../components/openSeaStatus'
import TraitGridFilters from '../components/TraitGridFilters'
import Events from '../Events'
import NftFilter, { NftFilterFormValuesType } from '../NftFilter'
import CollectionItems from './CollectionItems'
import NftCollectionLoading from './NftCollection.template.loading'
import Stats from './Stats'

const CollectionInfo = styled.div`
  background: ${PaletteColors['white-900']};
  box-shadow: 0px 4px 16px rgba(5, 24, 61, 0.1);
  border-radius: 16px;
  padding: 6px 12px;
  width: fit-content;
  display: flex;
  justify-content: left;
  gap: 8px;
  align-items: center;
`

const OuterCollectionInfo = styled.div`
  position: sticky;
  top: calc(${FIXED_HEADER_HEIGHT}px);
  display: flex;
  z-index: 21;
  background: ${(props) => props.theme.white};
  border-bottom: 1px solid ${PaletteColors['grey-000']};
  ${media.tabletL`
    padding: 12px;
    display: block;
  `}
`

const OverflowText = styled(Text)`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const NftsCollection: React.FC<Props> = ({ formActions, formValues, routerActions, ...rest }) => {
  const isTablet = useMedia('tablet')
  const { slug } = rest.computedMatch.params
  const params = new URLSearchParams(window.location.hash.split('?')[1])
  const tab = params.get('tab') === 'ACTIVITY' ? 'ACTIVITY' : 'ITEMS'

  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'ACTIVITY'>(tab)
  const [numOfResults, setNumOfResults] = useState<number | undefined>(undefined)
  const [isFilterOpen, setIsFilterOpen] = useState(!isTablet)

  const [collectionsQuery] = useCollectionsQuery({
    requestPolicy: 'network-only',
    variables: { filter: [{ field: CollectionFilterFields.Slug, value: slug }] }
  })

  const collection = collectionsQuery.data?.collections
    ? collectionsQuery.data.collections[0]
    : undefined

  useEffect(() => {
    setActiveTab(tab)
    setNumOfResults(undefined)
  }, [tab])

  if (collectionsQuery.error)
    return (
      <div style={{ marginTop: '40px' }}>
        <NftError error={collectionsQuery.error} />
      </div>
    )
  if (collectionsQuery.fetching) return <NftCollectionLoading />

  if (!collection) return null

  return (
    <NftPageFullWidth>
      <OpenSeaStatusComponent />
      {collection.banner_image_url && (
        <>
          <CollectionHeader bgUrl={collection.banner_image_url}>
            <NftBannerWrapper />
          </CollectionHeader>
          <OuterCollectionInfo>
            <CollectionInfoWrapper>
              <CollectionInfo>
                <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
                  {collection.image_url ? (
                    <NftCollectionImage
                      alt=''
                      isVerified={collection.safelist_request_status === 'verified'}
                      src={collection.image_url || ''}
                    />
                  ) : (
                    <Avatar
                      size={30}
                      name={collection.slug || ''}
                      variant='marble'
                      colors={AvatarGradientColors}
                    />
                  )}
                  <OverflowText color='black' size='14px' weight={600}>
                    {collection.name}
                  </OverflowText>
                </div>
                <LinksContainer>
                  {collection.external_url ? (
                    <Link target='_blank' href={collection.external_url}>
                      <IconLink size='small' label='globe' color={PaletteColors['blue-600']} />
                    </Link>
                  ) : null}
                  {collection.twitter_username ? (
                    <Link
                      target='_blank'
                      href={`https://twitter.com/${collection.twitter_username}`}
                    >
                      <IconTwitter size='small' label='twitter' color={PaletteColors['blue-600']} />
                    </Link>
                  ) : null}
                  {collection.instagram_username ? (
                    <Link
                      target='_blank'
                      href={`https://instagram.com/${collection.instagram_username}`}
                    >
                      <IconInstagram
                        size='small'
                        label='camera'
                        color={PaletteColors['blue-600']}
                      />
                    </Link>
                  ) : null}
                  {collection.discord_url ? (
                    <Link target='_blank' href={`${collection.discord_url}`}>
                      <IconComputer
                        size='small'
                        label='computer'
                        color={PaletteColors['blue-600']}
                      />
                    </Link>
                  ) : null}
                </LinksContainer>
              </CollectionInfo>
            </CollectionInfoWrapper>
            <Stats
              slug={collection.slug}
              routerActions={routerActions}
              formActions={formActions}
              num_owners={collection.num_owners}
              total_supply={collection.total_supply}
              stats={collection.stats}
            />
          </OuterCollectionInfo>
        </>
      )}
      <GridWrapper>
        <NftFilter
          collections={[]}
          formActions={formActions}
          formValues={formValues}
          isFilterOpen={isFilterOpen}
          total_supply={collection.total_supply}
          traits={activeTab === 'ITEMS' ? collection.traits : []}
          opensea_event_types={activeTab === 'ITEMS' ? [] : opensea_event_types}
          minMaxPriceFilter={activeTab === 'ITEMS'}
          forSaleFilter={activeTab === 'ITEMS'}
          setIsFilterOpen={setIsFilterOpen}
          hasBanner={!!collection.banner_image_url}
        />
        <div style={{ width: '100%' }}>
          <TraitGridFilters
            tabs={['ITEMS', 'ACTIVITY']}
            formValues={formValues}
            numOfResults={numOfResults}
            showSortBy={activeTab === 'ITEMS'}
            setIsFilterOpen={setIsFilterOpen}
            formActions={formActions}
            setRefreshTrigger={setRefreshTrigger}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collections={collectionsQuery.data?.collections || []}
            hasBanner={!collection.banner_image_url}
          />
          {activeTab === 'ITEMS' ? (
            <CollectionItems
              collectionsQuery={collectionsQuery}
              formValues={formValues}
              refreshTrigger={refreshTrigger}
              isFilterOpen={isFilterOpen}
              setNumOfResults={setNumOfResults}
              slug={slug}
            />
          ) : (
            <Events
              isFetchingParent={collectionsQuery.fetching}
              filters={[
                { field: EventFilterFields.CollectionSlug, value: slug },
                ...(formValues?.event
                  ? [{ field: EventFilterFields.EventType, value: formValues.event }]
                  : [])
              ]}
            />
          )}
        </div>
      </GridWrapper>
    </NftPageFullWidth>
  )
}

const mapStateToProps = (state: RootState) => ({
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  formValues: selectors.form.getFormValues('nftFilter')(state) as NftFilterFormValuesType
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{}, Props>({
    destroyOnUnmount: false,
    form: 'nftFilter'
  }),
  connector
)

export type Props = ConnectedProps<typeof connector> & {
  computedMatch: { params: { slug: string } }
}

export default enhance(NftsCollection) as React.FC<{ computedMatch: { params: { slug: string } } }>
