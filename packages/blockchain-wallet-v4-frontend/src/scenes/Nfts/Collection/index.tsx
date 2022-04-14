import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { colors, Icon, IconName } from '@blockchain-com/constellation'
import { useWhyDidYouUpdate } from 'blockchain-wallet-v4-frontend/src/hooks/debug'
import { bindActionCreators, compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'
import { CombinedError } from 'urql'

import {
  Button,
  Link,
  SpinningLoader,
  TabMenu,
  TabMenuItem,
  Text
} from 'blockchain-info-components'
import { SelectBox } from 'components/Form'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AssetSortFields, CollectionFields, useCollectionsQuery } from 'generated/graphql'
import { media } from 'services/styles'

import { Centered, Grid, GridWrapper, NftBannerWrapper } from '../components'
import GraphqlError from '../components/GraphqlError'
import OpenSeaStatusComponent from '../components/openSeaStatus'
import NftFilter, { NftFilterFormValuesType } from '../NftFilter'
import ResultsPage from './results'
import Stats from './Stats'

const CollectionHeader = styled.div<{ bgUrl: string }>`
  height: 300px;
  display: flex;
  justify-content: space-between;
  background-size: cover;
  background-image: url(${(props) => props.bgUrl});
  position: relative;
  ${media.tabletL`
    flex-direction: column;
  `}
`

const CollectionInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CollectionImage = styled.img`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.grey100};
`

const LinksContainer = styled.div`
  display: flex;
  > div {
    padding: 10px;
    border: 1px solid ${(props) => props.theme.white};
  }
  > &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  > &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`

const ActiveTraitFilter = styled.div`
  align-items: center;
  background: ${colors.blue0};
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

const nonTraitFilters = ['min', 'max', 'sortBy', 'forSale']

export const getTraitFilters = (formValues: NftFilterFormValuesType) =>
  formValues ? Object.keys(formValues).filter((val) => nonTraitFilters.indexOf(val) === -1) : null

export const getMinMaxFilters = (formValues: NftFilterFormValuesType) =>
  formValues ? Object.keys(formValues).filter((val) => val === 'min' || val === 'max') : null

export const getSortBy = (formValues: NftFilterFormValuesType) => formValues?.sortBy

const NftsCollection: React.FC<Props> = ({ formActions, formValues, ...rest }) => {
  const { slug } = rest.computedMatch.params

  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
  const [errorFetchingNextPage, setNextPageFetchError] = useState<CombinedError | undefined>(
    undefined
  )

  const [results] = useCollectionsQuery({
    variables: { filter: [{ field: CollectionFields.Slug, value: slug }] }
  })

  useEffect(() => {
    setIsFetchingNextPage(true)
    setPageVariables([])
    setTimeout(() => {
      setPageVariables([{ page: 0 }])
    }, 100)
  }, [slug, formValues])

  const maxMinFilters = getMinMaxFilters(formValues)
  const traitFilters = getTraitFilters(formValues)

  const hasSomeFilters =
    formValues && Object.keys(formValues).some((key) => Object.keys(formValues[key]).some(Boolean))

  const collection = results.data?.collections ? results.data.collections[0] : undefined

  if (!collection) return null

  return (
    <div style={{ paddingTop: '0px', position: 'relative' }}>
      <OpenSeaStatusComponent />
      <CollectionHeader bgUrl={collection.banner_image_url || ''}>
        <NftBannerWrapper>
          <CollectionInfo>
            <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
              <CollectionImage src={collection.image_url || ''} />
              <Text color='white' size='32px' weight={600}>
                {collection.name}
              </Text>
            </div>
            <LinksContainer>
              {collection.external_url ? (
                <Link target='_blank' href={collection.external_url}>
                  <Icon name={IconName.GLOBE} color='grey400' />
                </Link>
              ) : null}
              {collection.instagram_username ? (
                <Link
                  target='_blank'
                  href={`https://instagram.com/${collection.instagram_username}`}
                >
                  <Icon name={IconName.CAMERA} color='grey400' />
                </Link>
              ) : null}
              {collection.discord_url ? (
                <Link target='_blank' href={`${collection.discord_url}`}>
                  <Icon name={IconName.COMPUTER} color='grey400' />
                </Link>
              ) : null}
            </LinksContainer>
          </CollectionInfo>
          <Stats stats={collection.stats} />
        </NftBannerWrapper>
      </CollectionHeader>
      <GridWrapper>
        <NftFilter
          collections={[]}
          formActions={formActions}
          formValues={formValues}
          stats={collection.stats}
          traits={collection.traits}
        />
        <div style={{ width: '100%' }}>
          <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
            <TabMenu style={{ marginBottom: '12px', width: 'fit-content' }}>
              <TabMenuItem selected>Items</TabMenuItem>
            </TabMenu>
            <div style={{ height: '56px', width: '300px', zIndex: 20 }}>
              <Field
                name='sortBy'
                component={SelectBox}
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
          </div>
          <TraitGrid hasSomeFilters={hasSomeFilters}>
            {maxMinFilters
              ? maxMinFilters.map((key) => {
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
                          <Icon
                            role='button'
                            cursor='pointer'
                            onClick={() => formActions.change('nftFilter', key, undefined)}
                            color={colors.blue600}
                            name={IconName.CLOSE_CIRCLE}
                          />
                        </div>
                      </ActiveTraitFilter>
                    </div>
                  )
                })
              : null}
            {traitFilters
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
                              <Icon
                                role='button'
                                cursor='pointer'
                                onClick={() =>
                                  formActions.change('nftFilter', `${trait}.${value}`, undefined)
                                }
                                color={colors.blue600}
                                name={IconName.CLOSE_CIRCLE}
                              />
                            </div>
                          </ActiveTraitFilter>
                        </div>
                      )
                    })
                })
              : null}
          </TraitGrid>
          <Grid>
            {pageVariables.length
              ? pageVariables.map(({ page }) => (
                  <ResultsPage
                    page={page}
                    // @ts-ignore
                    formValues={formValues}
                    key={page}
                    slug={slug}
                    setNextPageFetchError={setNextPageFetchError}
                    setIsFetchingNextPage={setIsFetchingNextPage}
                  />
                ))
              : null}
          </Grid>
          <Centered>
            <GraphqlError error={errorFetchingNextPage} />
            {isFetchingNextPage || results.fetching ? (
              <SpinningLoader width='14px' height='14px' borderWidth='3px' />
            ) : (
              <Button
                onClick={() => setPageVariables((pages) => [...pages, { page: pages.length + 1 }])}
                nature='primary'
                data-e2e='loadMoreNfts'
              >
                {errorFetchingNextPage ? (
                  <FormattedMessage id='copy.retry' defaultMessage='Retry' />
                ) : (
                  <FormattedMessage id='copy.load_more' defaultMessage='Load More' />
                )}
              </Button>
            )}
          </Centered>
        </div>
      </GridWrapper>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  formValues: selectors.form.getFormValues('nftFilter')(state) as NftFilterFormValuesType
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{}, Props>({ destroyOnUnmount: false, form: 'nftFilter' }),
  connector
)

export type Props = ConnectedProps<typeof connector> & {
  computedMatch: { params: { slug: string } }
}

export default enhance(NftsCollection) as React.FC<{ computedMatch: { params: { slug: string } } }>