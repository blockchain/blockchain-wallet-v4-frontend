import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { IconCloseCircle, IconFilter, PaletteColors } from '@blockchain-com/constellation'
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
  getCollectionFilter,
  getEventFilter,
  getForSaleFilter,
  getMinMaxFilters,
  getTraitFilters,
  getVerifiedFilter
} from '../utils/NftUtils'
import { opensea_event_types } from '.'
import EventTypeName from './EventTypeName'
import NftRefreshIcon from './NftRefreshIcon'

const Wrapper = styled.div<{ hasBanner: boolean }>`
  top: ${(props) => (props.hasBanner ? `calc(${FIXED_HEADER_HEIGHT}px)` : `initial`)};
  position: sticky;
  background: ${(props) => props.theme.white};
  padding-top: 20px;
  padding-bottom: 20px;
  z-index: 5;
  ${media.tablet`
    padding: 12px;
  `}
`

const ActiveTraitFilter = styled.div`
  align-items: center;
  background: ${PaletteColors['grey-000']};
  border: 1px solid ${PaletteColors['grey-000']};
  border-radius: 6px;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  justify-content: space-between;
  padding: 10px;
`

const ClearAll = styled(ActiveTraitFilter)`
  cursor: pointer;
  padding: 10px 12px;
  background: ${PaletteColors['blue-000']};
  border: unset;
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

const ClosedBackground = styled.div`
  background: grey400;
  border-radius: 50%;
  line-height: 0;
  margin-left: 8px;
`

const TraitGridFilters: React.FC<Props> = ({
  activeTab,
  analyticsActions,
  collections,
  defaultSortBy,
  formActions,
  formValues,
  hasBanner = false,
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
  const eventFilter = getEventFilter(formValues)
  const collectionFilter = getCollectionFilter(formValues, collections)
  const forSaleFilter = getForSaleFilter(formValues)
  const verifiedFilter = getVerifiedFilter(formValues)
  const hasSomeFilters =
    (formValues &&
      Object.keys(formValues)
        .filter((val) => val !== 'sortBy')
        .some(
          (key) =>
            Object.keys(formValues[key]).some(Boolean) ||
            // @ts-ignore
            (typeof formValues[key] === 'boolean' && formValues[key] === true)
        )) ||
    false
  const clearAllFilters = () => {
    if (formValues && hasSomeFilters) {
      const url = new URL(window.location.href)
      const base = `${url.href.split('#')[0]}#`
      const [hash, query] = url.href.split('#')[1].split('?')
      const searchParams = new URLSearchParams(query)
      const tab = searchParams.get('tab') ? `?tab=${searchParams.get('tab')}` : ''
      window.location.replace(base + hash + tab)

      formActions.reset('nftFilter')
      formActions.change('nftFilter', 'sortBy', defaultSortBy)
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

  useEffect(() => {
    if (defaultSortBy) {
      formActions.change('nftFilter', 'sortBy', defaultSortBy)
    }
  }, [formActions, defaultSortBy])

  const getTab = (tab: 'ITEMS' | 'ACTIVITY' | 'EXPLORE') => {
    return tab === 'ITEMS' ? (
      <FormattedMessage id='copy.items' defaultMessage='Items' />
    ) : tab === 'ACTIVITY' ? (
      <FormattedMessage id='copy.activity' defaultMessage='Activity' />
    ) : (
      <FormattedMessage id='copy.explore' defaultMessage='Explore' />
    )
  }

  return (
    <Wrapper hasBanner={hasBanner}>
      <div style={{ width: '100%' }}>
        <Flex
          alignItems='center'
          justifyContent='space-between'
          flexDirection={isTablet ? 'column' : 'row'}
        >
          {tabs.length > 1 ? (
            <TabMenu
              style={{
                marginBottom: isTablet ? '16px' : '0px',
                width: isTablet ? '100%' : 'fit-content'
              }}
            >
              {tabs.map((tab) => (
                <TabMenuItem
                  width='100%'
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
                    <IconFilter label='filter' size='large' />
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
                    isTablet || !numOfResults
                      ? { borderRadius: '50%', height: '40px', minWidth: 'initial', width: '40px' }
                      : {}
                  }
                  data-e2e='nftRefresh'
                  nature='empty-blue'
                >
                  <Flex gap={12} alignItems='center'>
                    {isTablet || !numOfResults ? null : (
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
                    <NftRefreshIcon size='small' isActive={isRefreshRotating} color='blue-600' />
                  </Flex>
                </Button>
              </Flex>
              {showSortBy ? (
                <SortByWrapper>
                  <Field
                    name='sortBy'
                    component={SelectBox}
                    label={<FormattedMessage id='copy.sort_by' defaultMessage='Sort By' />}
                    // @ts-ignore
                    searchEnabled={false}
                    // @ts-ignore
                    elements={[
                      {
                        group: '',
                        items: [
                          {
                            text: 'Recently Listed',
                            value: `${AssetSortFields.DateIngested}-DESC`
                          },
                          { text: 'Price: Low to High', value: `${AssetSortFields.Price}-ASC` },
                          { text: 'Price: High to Low', value: `${AssetSortFields.Price}-DESC` }
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
        {collectionFilter ? (
          <div style={{ height: '100%' }}>
            <ActiveTraitFilter>
              <Text size='12px' lineHeight='18px' color='grey900' weight={600} capitalize>
                Collection: {collectionFilter}
              </Text>
              <ClosedBackground>
                <IconCloseCircle
                  label='close-circle'
                  role='button'
                  color={PaletteColors['grey-200']}
                  size='small'
                  onClick={() => {
                    formActions.change('nftFilter', 'collection', undefined)
                    analyticsActions.trackEvent({
                      key: Analytics.NFT_FILTER_REMOVED,
                      properties: {
                        filter_characteristic: 'collection'
                      }
                    })
                  }}
                />
              </ClosedBackground>
            </ActiveTraitFilter>
          </div>
        ) : null}
        {eventFilter ? (
          <div style={{ height: '100%' }}>
            <ActiveTraitFilter>
              <Text size='12px' lineHeight='18px' weight={600} color='grey900' capitalize>
                Event:{' '}
                <EventTypeName event_type={eventFilter as keyof typeof opensea_event_types} />
              </Text>
              <ClosedBackground>
                <IconCloseCircle
                  label='close'
                  color={PaletteColors['grey-200']}
                  size='small'
                  role='button'
                  style={{ cursor: 'pointer' }}
                  onClick={() => formActions.change('nftFilter', `event`, undefined)}
                />
              </ClosedBackground>
            </ActiveTraitFilter>
          </div>
        ) : null}
        {forSaleFilter ? (
          <div style={{ height: '100%' }}>
            <ActiveTraitFilter>
              <Text size='12px' lineHeight='18px' weight={600} color='grey900' capitalize>
                Buy Now
              </Text>
              <ClosedBackground>
                <IconCloseCircle
                  label='close'
                  color={PaletteColors['grey-200']}
                  size='small'
                  role='button'
                  style={{ cursor: 'pointer' }}
                  onClick={() => formActions.change('nftFilter', `forSale`, undefined)}
                />
              </ClosedBackground>
            </ActiveTraitFilter>
          </div>
        ) : null}
        {verifiedFilter ? (
          <div style={{ height: '100%' }}>
            <ActiveTraitFilter>
              <Text size='12px' lineHeight='18px' weight={600} color='grey900' capitalize>
                Verified Only
              </Text>
              <ClosedBackground>
                <IconCloseCircle
                  label='close'
                  color={PaletteColors['grey-200']}
                  size='small'
                  role='button'
                  style={{ cursor: 'pointer' }}
                  onClick={() => formActions.change('nftFilter', `verifiedOnly`, undefined)}
                />
              </ClosedBackground>
            </ActiveTraitFilter>
          </div>
        ) : null}
        {minMaxFilters && formValues
          ? minMaxFilters.map((key) => {
              return (
                <div key={key} style={{ height: '100%' }}>
                  <ActiveTraitFilter>
                    <Text size='12px' lineHeight='18px' color='grey900' weight={600} capitalize>
                      {key}: {formValues[key]} ETH
                    </Text>
                    <div
                      style={{
                        background: 'grey400',
                        borderRadius: '50%',
                        lineHeight: '0',
                        marginLeft: '8px'
                      }}
                    >
                      <IconCloseCircle
                        label='close'
                        color={PaletteColors['grey-200']}
                        size='small'
                        role='button'
                        style={{ cursor: 'pointer' }}
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
                        <Text size='12px' lineHeight='18px' weight={600} color='grey900' capitalize>
                          {trait}: {value}
                        </Text>
                        <div
                          style={{
                            background: 'grey400',
                            borderRadius: '50%',
                            lineHeight: '0',
                            marginLeft: '8px'
                          }}
                        >
                          <IconCloseCircle
                            label='close'
                            color={PaletteColors['grey-200']}
                            size='small'
                            role='button'
                            style={{ cursor: 'pointer' }}
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
                        </div>
                      </ActiveTraitFilter>
                    </div>
                  )
                })
            })
          : null}
        {hasSomeFilters && (
          <ClearAll onClick={clearAllFilters} data-e2e='clear-all'>
            <Text size='12px' lineHeight='20px' weight={600} color='blue600'>
              Clear All
            </Text>
          </ClearAll>
        )}
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
  activeTab?: 'ITEMS' | 'ACTIVITY' | 'EXPLORE'
  collections: OwnerQuery['assets'][0]['collection'][]
  defaultSortBy?: `${AssetSortFields}-${'ASC' | 'DESC'}`
  formActions: typeof actions.form
  formValues: NftFilterFormValuesType
  hasBanner?: boolean
  numOfResults?: number
  setActiveTab: React.Dispatch<React.SetStateAction<'ITEMS' | 'ACTIVITY'>>
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>
  showSortBy?: boolean
  tabs: Array<'ITEMS' | 'ACTIVITY' | 'EXPLORE'>
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(TraitGridFilters)
