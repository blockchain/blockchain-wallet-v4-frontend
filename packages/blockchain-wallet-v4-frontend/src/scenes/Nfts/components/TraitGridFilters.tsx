import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { colors, Icon } from '@blockchain-com/constellation'
import { IconCloseCircle, IconFilter } from '@blockchain-com/icons'
import { bindActionCreators } from '@reduxjs/toolkit'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Button, TabMenu, TabMenuItem, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import SelectBox from 'components/Form/SelectBox'
import { actions } from 'data'
import { Analytics } from 'data/types'
import { AssetSortFields, OwnerQuery } from 'generated/graphql.types'
import { FIXED_HEADER_HEIGHT } from 'layouts/Nfts/NftsHeader'
import { media, useMedia } from 'services/styles'

import { NftFilterFormValuesType } from '../NftFilter'
import {
  getCollectionsFilter,
  getEventsFilter,
  getMinMaxFilters,
  getTraitFilters
} from '../utils/NftUtils'
import { opensea_event_types } from '.'
import EventTypeName from './EventTypeName'
import NftRefreshIcon from './NftRefreshIcon'

const Wrapper = styled.div`
  position: sticky;
  top: ${FIXED_HEADER_HEIGHT}px;
  background: ${(props) => props.theme.white};
  padding-top: 8px;
  padding-bottom: 8px;
  z-index: 5;
  ${media.tablet`
    padding: 12px;
  `}
`

const ActiveTraitFilter = styled.div`
  align-items: center;
  background: ${colors.blue000};
  border: 1px solid ${colors.blue200};
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  justify-content: space-between;
  padding: 12px 16px;
`

const ClearAll = styled(ActiveTraitFilter)`
  cursor: pointer;
  padding: 16px 32px;
`

const TraitGrid = styled.div<{ hasSomeFilters: boolean }>`
  display: ${(props) => (props.hasSomeFilters ? 'flex' : 'none')};
  margin-top: ${(props) => (props.hasSomeFilters ? '8px' : '0')};
  flex-wrap: wrap;
  gap: 6px;
  z-index: 10;
`

const SortByWrapper = styled.div`
  width: 300px;
  z-index: 20;
  ${media.tablet`
  width: 200px;
`}
`

const TraitGridFilters: React.FC<Props> = ({
  activeTab,
  analyticsActions,
  collections,
  formActions,
  formValues,
  numOfResults,
  routerActions,
  setIsFilterOpen,
  setRefreshTrigger,
  showSortBy,
  tabs
}) => {
  const [isRefreshRotating, setIsRefreshRotating] = useState<boolean>(false)
  const isTablet = useMedia('tablet')
  const route = window.location.hash.split('?')[0].substr(1)
  const minMaxFilters = getMinMaxFilters(formValues)
  const traitFilters = getTraitFilters(formValues)
  const eventsFilter = getEventsFilter(formValues)
  const collectionsFilter = getCollectionsFilter(formValues, collections)

  const hasSomeFilters =
    (formValues &&
      Object.keys(formValues).some((key) => Object.keys(formValues[key]).some(Boolean))) ||
    false

  const clearAllFilters = () => {
    if (formValues && hasSomeFilters) {
      formActions.reset('nftFilter')
      analyticsActions.trackEvent({
        key: Analytics.NFT_FILTER_CLEAR_ALL_CLICKED,
        properties: {}
      })
    }
  }

  useEffect(() => {
    if (isRefreshRotating) {
      setTimeout(() => {
        setIsRefreshRotating(false)
      }, 500)
    }
  }, [isRefreshRotating])

  const getTab = (tab: 'ITEMS' | 'EVENTS' | 'EXPLORE') => {
    return tab === 'ITEMS' ? (
      <FormattedMessage id='copy.items' defaultMessage='Items' />
    ) : tab === 'EVENTS' ? (
      <FormattedMessage id='copy.events' defaultMessage='Events' />
    ) : (
      <FormattedMessage id='copy.explore' defaultMessage='Explore' />
    )
  }

  return (
    <Wrapper>
      <div style={{ width: '100%' }}>
        <Flex
          alignItems={isTablet ? 'flex-start' : 'center'}
          justifyContent='space-between'
          flexDirection={isTablet ? 'column' : 'row'}
        >
          {tabs.length > 1 ? (
            <TabMenu style={{ marginBottom: isTablet ? '16px' : '0px', width: 'fit-content' }}>
              {tabs.map((tab) => (
                <TabMenuItem
                  key={tab}
                  selected={activeTab === tab}
                  onClick={() => routerActions.push(`${route}?tab=${tab}`)}
                >
                  {getTab(tab)}
                </TabMenuItem>
              ))}
            </TabMenu>
          ) : tabs[0] ? (
            <Text capitalize color='black' size='24px' weight={600}>
              {getTab(tabs[0])}
            </Text>
          ) : null}

          <div style={{ width: isTablet ? '100%' : 'auto' }}>
            <Flex
              justifyContent={isTablet ? 'space-between' : 'flex-start'}
              alignItems='center'
              gap={16}
            >
              <Flex gap={8} alignItems='center'>
                {isTablet ? (
                  <Button
                    onClick={() => setIsFilterOpen(true)}
                    data-e2e='triggerFilter'
                    nature='empty-blue'
                    style={{
                      borderRadius: '50%',
                      height: '40px',
                      minWidth: 'initial',
                      padding: '12px',
                      width: '40px'
                    }}
                  >
                    <Icon label='filter' size='lg'>
                      <IconFilter />
                    </Icon>
                  </Button>
                ) : null}
                <Button
                  id='nft-refresh'
                  height='100%'
                  onClick={() => {
                    if (!isRefreshRotating) setRefreshTrigger((r) => r + 1)
                    setIsRefreshRotating(true)

                    if (route.includes('collection')) {
                      window.scrollTo(0, 300)
                    }
                  }}
                  style={
                    isTablet
                      ? { borderRadius: '50%', height: '40px', minWidth: 'initial', width: '40px' }
                      : {}
                  }
                  data-e2e='nftRefresh'
                  nature='empty-blue'
                >
                  <Flex gap={12} alignItems='center'>
                    {isTablet ? null : (
                      <Flex flexDirection='column' alignItems='start' gap={4}>
                        <Text size='12px' weight={600}>
                          {numOfResults || '---'}{' '}
                          <FormattedMessage id='copy.items' defaultMessage='Items' />
                        </Text>
                        <Text size='10px' color='grey400' weight={500}>
                          <FormattedMessage id='copy.refresh' defaultMessage='Refresh' />
                        </Text>
                      </Flex>
                    )}
                    <NftRefreshIcon size='sm' isActive={isRefreshRotating} />
                  </Flex>
                </Button>
              </Flex>
              {showSortBy ? (
                <SortByWrapper>
                  <Field
                    name='sortBy'
                    component={SelectBox}
                    onChange={(e) => {
                      if (e.includes('price')) {
                        formActions.change('nftFilter', 'forSale', true)
                        analyticsActions.trackEvent({
                          key: Analytics.NFT_RECENTLY_LISTED_CLICKED,
                          properties: {}
                        })
                      }
                    }}
                    // @ts-ignore
                    elements={[
                      {
                        group: '',
                        items: [
                          { text: 'Price: Low to High', value: `${AssetSortFields.Price}-ASC` },
                          { text: 'Price: High to Low', value: `${AssetSortFields.Price}-DESC` },
                          { text: 'Recently Listed', value: `${AssetSortFields.ListingDate}-DESC` }
                        ]
                      }
                    ]}
                  />
                </SortByWrapper>
              ) : null}
            </Flex>
          </div>
        </Flex>
      </div>
      <TraitGrid hasSomeFilters={hasSomeFilters}>
        {collectionsFilter
          ? collectionsFilter.map((collection) => {
              return (
                <div key={collection} style={{ height: '100%' }}>
                  <ActiveTraitFilter>
                    <Text size='14px' color='black' weight={500} capitalize>
                      Collection: {collection}
                    </Text>
                    <div
                      style={{
                        background: 'white',
                        borderRadius: '50%',
                        lineHeight: '0',
                        marginLeft: '8px'
                      }}
                    >
                      <Icon label='close-circle' color='blue600'>
                        <IconCloseCircle
                          role='button'
                          cursor='pointer'
                          onClick={() => {
                            const slug = collections.find(({ name }) => name === collection)?.slug
                            formActions.change('nftFilter', `collections.${slug}`, undefined)
                            analyticsActions.trackEvent({
                              key: Analytics.NFT_FILTER_REMOVED,
                              properties: {
                                filter_characteristic: 'collection'
                              }
                            })
                          }}
                        />
                      </Icon>
                    </div>
                  </ActiveTraitFilter>
                </div>
              )
            })
          : null}
        {eventsFilter
          ? eventsFilter.map((event) => {
              return (
                <div key={event} style={{ height: '100%' }}>
                  <ActiveTraitFilter>
                    <Text size='14px' color='black' weight={500} capitalize>
                      Event:{' '}
                      <EventTypeName event_type={event as keyof typeof opensea_event_types} />
                    </Text>
                    <div
                      style={{
                        background: 'white',
                        borderRadius: '50%',
                        lineHeight: '0',
                        marginLeft: '8px'
                      }}
                    >
                      <Icon label='close' color='blue600'>
                        <IconCloseCircle
                          role='button'
                          cursor='pointer'
                          onClick={() =>
                            formActions.change('nftFilter', `events.${event}`, undefined)
                          }
                        />
                      </Icon>
                    </div>
                  </ActiveTraitFilter>
                </div>
              )
            })
          : null}
        {minMaxFilters && formValues
          ? minMaxFilters.map((key) => {
              return (
                <div key={key} style={{ height: '100%' }}>
                  <ActiveTraitFilter>
                    <Text size='14px' color='black' weight={500} capitalize>
                      {key}: {formValues[key]} ETH
                    </Text>
                    <div
                      style={{
                        background: 'white',
                        borderRadius: '50%',
                        lineHeight: '0',
                        marginLeft: '8px'
                      }}
                    >
                      <Icon label='close' color='blue600'>
                        <IconCloseCircle
                          role='button'
                          cursor='pointer'
                          onClick={() => {
                            formActions.change('nftFilter', key, undefined)
                            analyticsActions.trackEvent({
                              key: Analytics.NFT_FILTER_REMOVED,
                              properties: {
                                filter_characteristic: key
                              }
                            })
                          }}
                        />
                      </Icon>
                    </div>
                  </ActiveTraitFilter>
                </div>
              )
            })
          : null}
        {traitFilters && formValues
          ? traitFilters.map((trait) => {
              return Object.keys(formValues[trait])
                .filter((val) => !!formValues[trait][val])
                .map((value) => {
                  return (
                    <div key={value} style={{ height: '100%' }}>
                      <ActiveTraitFilter>
                        <Text size='14px' color='black' weight={500} capitalize>
                          {trait}: {value}
                        </Text>
                        <div
                          style={{
                            background: 'white',
                            borderRadius: '50%',
                            lineHeight: '0',
                            marginLeft: '8px'
                          }}
                        >
                          <Icon label='close' color='blue600'>
                            <IconCloseCircle
                              role='button'
                              cursor='pointer'
                              onClick={() => {
                                formActions.change('nftFilter', `${trait}.${value}`, undefined)
                                analyticsActions.trackEvent({
                                  key: Analytics.NFT_FILTER_REMOVED,
                                  properties: {
                                    filter_characteristic: `${trait}.${value}`
                                  }
                                })
                              }}
                            />
                          </Icon>
                        </div>
                      </ActiveTraitFilter>
                    </div>
                  )
                })
            })
          : null}
        <ClearAll onClick={clearAllFilters} data-e2e='clear-all'>
          <Text size='14px' weight={500} color={colors.blue600}>
            Clear All
          </Text>
        </ClearAll>
        {/* analyticsActions.trackEvent({
                  key: Analytics.NFT_FILTER_CLEAR_ALL_CLICKED,
                  properties: {}
                  }) */}
      </TraitGrid>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})
const connector = connect(null, mapDispatchToProps)

type OwnProps = {
  activeTab?: 'ITEMS' | 'EVENTS' | 'EXPLORE'
  collections: OwnerQuery['assets'][0]['collection'][]
  formActions: typeof actions.form
  formValues: NftFilterFormValuesType
  numOfResults?: number
  setActiveTab: React.Dispatch<React.SetStateAction<'ITEMS' | 'EVENTS'>>
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>
  showSortBy?: boolean
  tabs: Array<'ITEMS' | 'EVENTS' | 'EXPLORE'>
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(TraitGridFilters)
