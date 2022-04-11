import React, { useEffect, useMemo, useState } from 'react'
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
import { AssetFields, CollectionFields, useCollectionsQuery } from 'generated/graphql'
import { media } from 'services/styles'

import { Grid, GridWrapper } from '../components'
import OpenSeaStatusComponent from '../components/openSeaStatus'
import NftFilter from '../NftFilter'
import Error from './error'
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

const CollectionBannerWrapper = styled.div`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 24px 40px;
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

const Centered = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  gap: 8px;
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

const NftsCollection: React.FC<Props> = ({
  collection,
  formActions,
  formValues,
  nftsActions,
  ...rest
}) => {
  const { slug } = rest.computedMatch.params

  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
  const [errorFetchingNextPage, setNextPageFetchError] = useState<CombinedError | undefined>(
    undefined
  )

  useWhyDidYouUpdate('NftsCollection', {
    collection,
    formActions,
    formValues,
    nftsActions,
    ...rest
  })

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

  useEffect(() => {
    nftsActions.fetchNftCollection({ slug })
  }, [formActions, nftsActions, slug])

  const maxMinFilters = getMinMaxFilters(formValues)
  const traitFilters = getTraitFilters(formValues)

  const hasSomeFilters =
    formValues && Object.keys(formValues).some((key) => Object.keys(formValues[key]).some(Boolean))

  const collectionData = results.data?.collections ? results.data.collections[0] : undefined

  if (!collectionData) return null

  return (
    <div style={{ paddingTop: '0px', position: 'relative' }}>
      <OpenSeaStatusComponent />
      <CollectionHeader bgUrl={collectionData.banner_image_url || ''}>
        <CollectionBannerWrapper style={{ width: '100%' }}>
          <CollectionInfo>
            <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
              <CollectionImage src={collectionData.image_url || ''} />
              <Text color='white' size='32px' weight={600}>
                {collectionData.name}
              </Text>
            </div>
            <LinksContainer>
              {collectionData.external_url ? (
                <Link target='_blank' href={collectionData.external_url}>
                  <Icon name={IconName.GLOBE} color='grey400' />
                </Link>
              ) : null}
              {collectionData.instagram_username ? (
                <Link
                  target='_blank'
                  href={`https://instagram.com/${collectionData.instagram_username}`}
                >
                  <Icon name={IconName.CAMERA} color='grey400' />
                </Link>
              ) : null}
              {collectionData.discord_url ? (
                <Link target='_blank' href={`${collectionData.discord_url}`}>
                  <Icon name={IconName.COMPUTER} color='grey400' />
                </Link>
              ) : null}
            </LinksContainer>
          </CollectionInfo>
          <Stats collection={collection} />
        </CollectionBannerWrapper>
      </CollectionHeader>
      <GridWrapper>
        <NftFilter formActions={formActions} formValues={formValues} collection={collection} />
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
                      { text: 'Price: Low to High', value: `${AssetFields.Price}-ASC` },
                      { text: 'Price: High to Low', value: `${AssetFields.Price}-DESC` },
                      { text: 'Recently Listed', value: `${AssetFields.ListingDate}-DESC` }
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
            <Error error={errorFetchingNextPage} />
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
  collection: selectors.components.nfts.getNftCollection(state),
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  formValues: selectors.form.getFormValues('nftFilter')(state) as NftFilterFormValuesType
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{}, Props>({ destroyOnUnmount: false, form: 'nftFilter' }),
  connector
)

export type Props = ConnectedProps<typeof connector> & {
  computedMatch: { params: { slug: string } }
}

export type NftFilterFormValuesType = {
  forSale: boolean
  max: string
  min: string
  sortBy: string
} & {
  [key: string]: {
    [key: string]: boolean
  }
}

export default enhance(NftsCollection) as React.FC<{ computedMatch: { params: { slug: string } } }>
