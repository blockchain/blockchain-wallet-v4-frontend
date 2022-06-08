import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconLink } from '@blockchain-com/icons'
import { bindActionCreators, compose } from 'redux'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  AssetSortFields,
  CollectionFilterFields,
  EventFilterFields,
  useCollectionsQuery
} from 'generated/graphql.types'
import { useMedia } from 'services/styles'

import {
  CollectionHeader,
  GridWrapper,
  NftBannerWrapper,
  NftPageFullWidth,
  opensea_event_types
} from '../components'
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
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const LinksContainer = styled.div`
  display: flex;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  > a {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    padding-right: 0px;
    svg {
      fill: ${(props) => props.theme.grey200};
      transition: fill 0.2s ease-in-out;
    }
    &:hover {
      svg {
        fill: ${(props) => props.theme.white};
      }
    }
    &:after {
      content: '';
      display: block;
      height: 90%;
      width: 1px;
      margin-left: 16px;
      background-color: ${(props) => props.theme.grey000};
    }
    &:last-child {
      padding-right: 16px;
    }
    &:last-child:after {
      display: none;
    }
  }
`

const NftsCollection: React.FC<Props> = ({ formActions, formValues, routerActions, ...rest }) => {
  const { slug } = rest.computedMatch.params
  const params = new URLSearchParams(window.location.hash.split('?')[1])
  const tab = params.get('tab') === 'ACTIVITY' ? 'ACTIVITY' : 'ITEMS'

  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'ACTIVITY'>(tab)
  const [numOfResults, setNumOfResults] = useState<number | undefined>(undefined)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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
      <CollectionHeader bgUrl={collection.banner_image_url || ''}>
        <NftBannerWrapper>
          <CollectionInfo>
            <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
              <NftCollectionImage
                alt='Collection'
                isVerified={collection.safelist_request_status === 'verified'}
                src={collection.image_url || ''}
              />
              <Text color='white' size='32px' weight={600}>
                {collection.name}
              </Text>
            </div>
            <LinksContainer>
              {collection.external_url ? (
                <Link target='_blank' href={collection.external_url}>
                  <Icon size='sm' label='globe' color='white900'>
                    <IconLink />
                  </Icon>
                </Link>
              ) : null}
              {/* {collection.instagram_username ? (
                <Link
                  target='_blank'
                  href={`https://instagram.com/${collection.instagram_username}`}
                >
                  <Icon size='md' label='camera' color='white900'>
                    <IconCamera />
                  </Icon>
                </Link>
              ) : null}
              {collection.discord_url ? (
                <Link target='_blank' href={`${collection.discord_url}`}>
                  <Icon size='md' label='computer' color='white900'>
                    <IconComputer />
                  </Icon>
                </Link>
              ) : null}
              {collection.twitter_username ? (
                <Link target='_blank' href={`https://twitter.com/${collection.twitter_username}`}>
                  <Icon size='md' label='twitter' color='white900'>
                    <IconTwitter />
                  </Icon>
                </Link>
              ) : null} */}
            </LinksContainer>
          </CollectionInfo>
          <Stats
            slug={collection.slug}
            routerActions={routerActions}
            formActions={formActions}
            total_supply={collection.total_supply}
            stats={collection.stats}
          />
        </NftBannerWrapper>
      </CollectionHeader>
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
            collections={[]}
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
