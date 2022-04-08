import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { colors, Icon, IconName } from '@blockchain-com/constellation'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { CombinedError } from 'urql'

import {
  Button,
  Link,
  SkeletonRectangle,
  SpinningLoader,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { CollectionFields, useCollectionsQuery } from 'generated/graphql'
import { media } from 'services/styles'

import { CollectionBanner, Grid, GridWrapper } from '../components'
import OpenSeaStatusComponent from '../components/openSeaStatus'
import NftFilter from '../NftFilter'
import Error from './error'
import ResultsPage from './results'
import Stats from './Stats'

const CollectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 24px;
  gap: 24px;
  ${media.tabletL`
    flex-direction: column;
  `}
`

const CollectionBannerWrapper = styled.div`
  position: relative;
  width: 100%;
`

const CollectionImage = styled.img`
  height: 100px;
  width: 100px;
  position: absolute;
  top: 140px;
  left: calc(50% - 50px);
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.grey100};
`

const LinksContainer = styled.div`
  background: ${colors.grey100};
  border-radius: 40px;
  display: inline-flex;
  gap: 8px;
  margin: 8px 0;
  padding: 6px 12px;
  a {
    line-height: 1;
  }
  a:hover {
    path {
      fill: ${colors.blue600};
      transition: fill 0.3s;
    }
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
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  justify-content: space-between;
  padding: 12px 16px;
`

const TraitGrid = styled.div<{ hasSomeFilters: boolean }>`
  display: ${(props) => (props.hasSomeFilters ? 'grid' : 'none')};
  position: sticky;
  gap: 6px;
  top: 0px;
  background: ${(props) => props.theme.white};
  margin-top: -8px;
  padding-top: ${(props) => (props.hasSomeFilters ? '8px' : '0px')};
  padding-bottom: ${(props) => (props.hasSomeFilters ? '16px' : '0px')};
  z-index: 10;
  grid-template-columns: repeat(2, 1fr);
  ${media.atLeastMobile`
    grid-template-columns: repeat(3, 1fr);
  `}
  ${media.atLeastTablet`
    grid-template-columns: repeat(4, 1fr);
  `}
  ${media.atLeastLaptop`
    grid-template-columns: repeat(6, 1fr);
  `}
`

const NftsCollection: React.FC<Props> = ({
  collection,
  collectionFilter,
  formActions,
  formValues,
  nftsActions,
  ...rest
}) => {
  const headerRef = useRef<HTMLDivElement | null>(null)
  const { slug } = rest.computedMatch.params

  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
  const [errorFetchingNextPage, setNextPageFetchError] = useState<CombinedError | undefined>(
    undefined
  )

  const [results] = useCollectionsQuery({
    variables: { filter: [{ field: CollectionFields.Slug, value: slug }] }
  })

  const formTraits = useMemo(() => (formValues ? Object.keys(formValues) : []), [formValues])
  const formTraitValues = useMemo(
    () => (formValues ? Object.keys(formValues).map((key) => formValues[key]) : []),
    [formValues]
  )

  useEffect(() => {
    setIsFetchingNextPage(true)
    setPageVariables([])
    setTimeout(() => {
      setPageVariables([{ page: 0 }])
    }, 1000)
  }, [slug, formTraits, formTraitValues])

  useEffect(() => {
    nftsActions.fetchNftCollection({ slug })
  }, [slug, nftsActions])

  const hasSomeFilters =
    formValues && Object.keys(formValues).some((key) => Object.keys(formValues[key]).some(Boolean))

  const collectionData = results.data?.collections ? results.data.collections[0] : undefined

  if (!collectionData) return null

  return (
    <div>
      <OpenSeaStatusComponent />
      <CollectionHeader ref={headerRef}>
        <CollectionBannerWrapper style={{ width: '100%' }}>
          <LinkContainer role='button' cursor='pointer' to='/nfts'>
            <Icon name={IconName.ARROW_LEFT} color='grey400' />
          </LinkContainer>
          <CollectionBanner
            large
            style={{ marginTop: '12px' }}
            background={`url(${collectionData.banner_image_url})`}
          />
          <CollectionImage src={collectionData.image_url || ''} />
          <Stats collection={collection} />
        </CollectionBannerWrapper>
        <div style={{ width: '100%' }}>
          <Text size='40px' color='grey900' weight={600}>
            {collectionData.name}
          </Text>
          <TextGroup inline style={{ marginTop: '16px' }}>
            <Text size='14px' color='grey300' weight={600}>
              <FormattedMessage id='copy.created_by' defaultMessage='Created by' />
            </Text>
            <Text size='14px' color='blue600' weight={600}>
              -
            </Text>
          </TextGroup>
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
          <Text
            lineHeight='1.4'
            style={{ marginTop: '16px' }}
            size='14px'
            color='grey600'
            weight={500}
          >
            {collectionData.description}
          </Text>
        </div>
      </CollectionHeader>
      <GridWrapper>
        <NftFilter formActions={formActions} collection={collection} />
        <div style={{ height: 'fit-content', width: '100%' }}>
          <TraitGrid hasSomeFilters={hasSomeFilters}>
            {formValues
              ? Object.keys(formValues)
                  .filter((val) => val === 'min' || val === 'max')
                  .map((key) => {
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
            {formValues
              ? Object.keys(formValues)
                  .filter((val) => val !== 'min' && val !== 'max')
                  .map((trait) => {
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
                    isBuyNow={collectionFilter.isBuyNow}
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
  collectionFilter: selectors.components.nfts.getNftCollectionFilter(state),
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  formValues: selectors.form.getFormValues('nftFilter')(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> & {
  computedMatch: { params: { slug: string } }
}

export default connector(NftsCollection)
