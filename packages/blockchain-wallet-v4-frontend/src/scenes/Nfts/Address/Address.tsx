import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { IconSettings, PaletteColors } from '@blockchain-com/constellation'
import { Dispatch } from '@reduxjs/toolkit'
import { bindActionCreators, compose } from 'redux'
import { reduxForm } from 'redux-form'

import { Text } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  AssetSortFields,
  ChainOperators,
  EventFilterFields,
  OwnerQuery
} from 'generated/graphql.types'
import { Props as OwnProps } from 'layouts/Nfts/Nfts'
import { useMedia } from 'services/styles'

import { GridWrapper, NftBannerWrapper, NftPageFullWidth, opensea_event_types } from '../components'
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
  nftsActions,
  pathname
}) => {
  const isTablet = useMedia('tablet')
  const address = pathname.split('/nfts/address/')[1]
  const params = new URLSearchParams(window.location.hash.split('?')[1])
  const tab = params.get('tab') === 'ACTIVITY' ? 'ACTIVITY' : 'ITEMS'
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'ACTIVITY'>(tab)
  const [collections, setCollections] = useState([] as OwnerQuery['assets'][0]['collection'][])
  const [isFilterOpen, setIsFilterOpen] = useState(!isTablet)

  const isOwner = ethAddress?.toLowerCase() === address?.toLowerCase() && isAuthenticated

  const eventFilter = getEventFilter(formValues)

  useEffect(() => {
    setActiveTab(tab)
  }, [tab])

  useEffect(() => {
    if (isOwner) {
      nftsActions.fetchNftUserPreferences()
    }
  }, [isOwner, nftsActions])

  if (!address) return null

  const filters = [{ field: EventFilterFields.FromAccountAddress, value: address.toLowerCase() }]

  if (eventFilter) {
    filters.push({ field: EventFilterFields.EventType, value: eventFilter })
  }

  if (!address) return null

  return (
    <NftPageFullWidth>
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
              <CryptoAddress canCopy>{address}</CryptoAddress>
            </Text>
            {isOwner ? (
              <LinkContainer to={`/nfts/address/settings/${ethAddress}`}>
                <a>
                  <IconSettings color={PaletteColors['white-900']} label='settings' />
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
          collections={activeTab === 'ITEMS' && collections.length >= 2 ? collections : []}
          formActions={formActions}
          formValues={formValues}
          isFilterOpen={isFilterOpen}
          minMaxPriceFilter={activeTab === 'ITEMS'}
          forSaleFilter={activeTab === 'ITEMS'}
          traits={[]}
          opensea_event_types={activeTab === 'ITEMS' ? [] : opensea_event_types}
          setIsFilterOpen={setIsFilterOpen}
        />
        <div style={{ width: '100%' }}>
          <TraitGridFilters
            tabs={['ITEMS', 'ACTIVITY']}
            activeTab={activeTab}
            formActions={formActions}
            formValues={formValues}
            collections={collections}
            setRefreshTrigger={setRefreshTrigger}
            setIsFilterOpen={setIsFilterOpen}
            setActiveTab={setActiveTab}
          />
          {activeTab === 'ITEMS' ? (
            <AddressItems
              collections={collections}
              refreshTrigger={refreshTrigger}
              isFilterOpen={isFilterOpen}
              setCollections={setCollections}
              formValues={formValues}
              address={address}
            />
          ) : (
            <Events isFetchingParent={false} filters={filters} />
          )}
        </div>
      </GridWrapper>
    </NftPageFullWidth>
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
