import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { colors, Icon } from '@blockchain-com/constellation'
import { IconCloseCircle } from '@blockchain-com/icons'
import { bindActionCreators } from '@reduxjs/toolkit'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { TabMenu, TabMenuItem, Text } from 'blockchain-info-components'
import SelectBox from 'components/Form/SelectBox'
import { actions } from 'data'
import { Analytics } from 'data/types'
import { AssetSortFields, OwnerQuery } from 'generated/graphql.types'

import { NftFilterFormValuesType } from '../NftFilter'
import {
  getCollectionFilter,
  getEventFilter,
  getMinMaxFilters,
  getTraitFilters
} from '../utils/NftUtils'
import { opensea_event_types } from '.'
import EventTypeName from './EventTypeName'

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

const TraitGrid = styled.div<{ hasSomeFilters: boolean }>`
  display: ${(props) => (props.hasSomeFilters ? 'flex' : 'none')};
  flex-wrap: wrap;
  position: sticky;
  gap: 6px;
  top: 0px;
  background: ${(props) => props.theme.white};
  margin-top: -8px;
  padding-top: ${(props) => (props.hasSomeFilters ? '8px' : '0px')};
  padding-bottom: ${(props) => (props.hasSomeFilters ? '16px' : '0px')};
  z-index: 10;
`

const TraitGridFilters: React.FC<Props> = ({
  activeTab,
  analyticsActions,
  collections,
  formActions,
  formValues,
  routerActions,
  showSortBy,
  tabs
}) => {
  const route = window.location.hash.split('?')[0].substr(1)
  const minMaxFilters = getMinMaxFilters(formValues)
  const traitFilters = getTraitFilters(formValues)
  const eventFilter = getEventFilter(formValues)
  const collectionFilter = getCollectionFilter(formValues, collections)

  const hasSomeFilters =
    (formValues &&
      Object.keys(formValues).some((key) => Object.keys(formValues[key]).some(Boolean))) ||
    false

  return (
    <>
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        {tabs.length ? (
          <TabMenu style={{ marginBottom: '12px', width: 'fit-content' }}>
            {tabs.map((tab) => (
              <TabMenuItem
                key={tab}
                selected={activeTab === tab}
                onClick={() => routerActions.push(`${route}?tab=${tab}`)}
              >
                {tab === 'ITEMS' ? (
                  <FormattedMessage id='copy.items' defaultMessage='Items' />
                ) : tab === 'EVENTS' ? (
                  <FormattedMessage id='copy.events' defaultMessage='Events' />
                ) : (
                  <FormattedMessage id='copy.explore' defaultMessage='Explore' />
                )}
              </TabMenuItem>
            ))}
          </TabMenu>
        ) : null}

        {showSortBy ? (
          <div style={{ height: '56px', width: '300px', zIndex: 20 }}>
            <Field
              name='sortBy'
              component={SelectBox}
              onChange={(e) => {
                if (e.includes('price')) {
                  formActions.change('nftFilter', 'forSale', true)
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
          </div>
        ) : null}
      </div>
      <TraitGrid hasSomeFilters={hasSomeFilters}>
        {collectionFilter ? (
          <div style={{ height: '100%' }}>
            <ActiveTraitFilter>
              <Text size='14px' color='black' weight={500} capitalize>
                Collection: {collectionFilter}
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
                      formActions.change('nftFilter', 'collection', undefined)
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
        ) : null}
        {eventFilter ? (
          <div style={{ height: '100%' }}>
            <ActiveTraitFilter>
              <Text size='14px' color='black' weight={500} capitalize>
                Event:{' '}
                <EventTypeName event_type={eventFilter as keyof typeof opensea_event_types} />
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
                    onClick={() => formActions.change('nftFilter', `event`, undefined)}
                  />
                </Icon>
              </div>
            </ActiveTraitFilter>
          </div>
        ) : null}
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
        {/* analyticsActions.trackEvent({
                  key: Analytics.NFT_FILTER_CLEAR_ALL_CLICKED,
                  properties: {}
                  }) */}
      </TraitGrid>
    </>
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
  setActiveTab: React.Dispatch<React.SetStateAction<'ITEMS' | 'EVENTS'>>
  showSortBy?: boolean
  tabs: Array<'ITEMS' | 'EVENTS' | 'EXPLORE'>
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(TraitGridFilters)
