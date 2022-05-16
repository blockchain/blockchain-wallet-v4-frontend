import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { colors, Icon } from '@blockchain-com/constellation'
import { IconSettings } from '@blockchain-com/icons'
import { Dispatch } from '@reduxjs/toolkit'
import { bindActionCreators, compose } from 'redux'
import { reduxForm } from 'redux-form'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { EventFilterFields, OwnerQuery } from 'generated/graphql.types'
import { Props as OwnProps } from 'layouts/Nfts/Nfts'

import { GridWrapper, NftBannerWrapper, opensea_event_types } from '../components'
import TraitGridFilters from '../components/TraitGridFilters'
import Events from '../Events'
import NftFilter, { NftFilterFormValuesType } from '../NftFilter'
import { getEventFilter } from '../utils/NftUtils'
import AddressItems from './AddressItems'

const NftAddress: React.FC<Props> = ({
  ethAddress,
  formActions,
  formValues,
  isAuthenticated,
  pathname
}) => {
  const address = pathname.split('/nfts/address/')[1]
  const params = new URLSearchParams(window.location.hash.split('?')[1])
  const tab = params.get('tab') === 'EVENTS' ? 'EVENTS' : 'ITEMS'

  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'EVENTS'>(tab)
  const [collections, setCollections] = useState([] as OwnerQuery['assets'][0]['collection'][])
  const [isFilterTriggered, setIsFilterTriggered] = useState<boolean>(false)

  const eventFilter = getEventFilter(formValues)

  useEffect(() => {
    setActiveTab(tab)
  }, [tab])

  if (!address) return null

  const filters = [{ field: EventFilterFields.FromAccountAddress, value: address.toLowerCase() }]

  if (eventFilter) {
    filters.push({ field: EventFilterFields.EventType, value: eventFilter })
  }

  if (!address) return null

  return (
    <div style={{ paddingTop: '0px', position: 'relative' }}>
      <div
        style={{
          background: `linear-gradient(45deg, #${address.slice(2, 8)}, #FFF)`,
          height: '300px',
          position: 'relative'
        }}
      >
        <NftBannerWrapper>
          <Flex justifyContent='space-between' alignItems='center'>
            <Text color='white' size='24px' weight={600}>
              {address}
            </Text>
            {ethAddress.toLowerCase() === address.toLowerCase() && isAuthenticated ? (
              <LinkContainer to={`/nfts/address/settings/${ethAddress}`}>
                <a>
                  <Icon label='settings' color='white900'>
                    <IconSettings color={colors.white900} />
                  </Icon>
                </a>
              </LinkContainer>
            ) : null}
          </Flex>
          {/* <div style={{ marginTop: '24px' }}>
            <StatsWrapper>
              <Stat>
                <Text size='16px' weight={500} color='grey600'>
                  <FormattedMessage id='copy.total_vol' defaultMessage='Total Vol.' />
                </Text>
                <Text size='16px' color='white' weight={600}>
                  {}
                </Text>
              </Stat>
            </StatsWrapper>
          </div> */}
        </NftBannerWrapper>
      </div>
      <GridWrapper>
        <NftFilter
          collections={activeTab === 'ITEMS' ? collections : []}
          formActions={formActions}
          formValues={formValues}
          isTriggered={isFilterTriggered}
          minMaxPriceFilter={activeTab === 'ITEMS'}
          forSaleFilter={activeTab === 'ITEMS'}
          traits={[]}
          opensea_event_types={activeTab === 'ITEMS' ? [] : opensea_event_types}
          setIsFilterTriggered={setIsFilterTriggered}
        />
        <div style={{ width: '100%' }}>
          <TraitGridFilters
            tabs={['ITEMS', 'EVENTS']}
            activeTab={activeTab}
            formActions={formActions}
            formValues={formValues}
            collections={collections}
            setRefreshTrigger={setRefreshTrigger}
            setIsFilterTriggered={setIsFilterTriggered}
            setActiveTab={setActiveTab}
          />
          {activeTab === 'ITEMS' ? (
            <AddressItems
              collections={collections}
              refreshTrigger={refreshTrigger}
              setCollections={setCollections}
              formValues={formValues}
              address={address}
            />
          ) : (
            <Events isFetchingParent={false} filters={filters} />
          )}
        </div>
      </GridWrapper>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues('nftFilter')(state) as NftFilterFormValuesType,
  pathname: selectors.router.getPathname(state) as string
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose(
  reduxForm<{}, Props>({ destroyOnUnmount: false, form: 'nftFilter' }),
  connector
)

export default enhance(NftAddress) as React.FC<{ computedMatch: { params: { address: string } } }>
