import React, { useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { colors, Icon, IconName, Switch } from '@blockchain-com/constellation'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { CombinedError } from 'urql'

import { Button, Link, SpinningLoader, Text, TextGroup } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import { useCollectionQuery } from 'generated/graphql'

import { CollectionBanner, Grid, NftPage } from '../components'
import Error from './error'
import ResultsPage from './results'
import Stats from './Stats'

const CollectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 24px;
  gap: 24px;
`

const CollectionBannerWrapper = styled.div`
  position: relative;
  width: 100%;
`

const CollectionHeaderFixed = styled.div`
  position: sticky;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 12px 0px;
  background: ${(props) => props.theme.white};
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

const CollectionImageSmall = styled.img`
  border-radius: 50%;
  height: 30px;
  width: 30px;
  margin-right: 8px;
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

const NftsCollection: React.FC<Props> = ({
  coinsActions,
  collection,
  collectionFilter,
  modalActions,
  nftsActions,
  ...rest
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLDivElement | null>(null)
  const { slug } = rest.computedMatch.params

  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
  const [errorFetchingNextPage, setNextPageFetchError] = useState<CombinedError | undefined>(
    undefined
  )
  const [showFixedHeader, setShowFixedHeader] = useState<boolean>(false)

  const [results] = useCollectionQuery({ variables: { filter: { slug } } })

  useEffect(() => {
    setIsFetchingNextPage(true)
    setPageVariables([])
    setTimeout(() => {
      setPageVariables([{ page: 0 }])
    }, 1000)
  }, [slug, collectionFilter.isBuyNow])

  useEffect(() => {
    if (wrapperRef.current) {
      // eslint-disable-next-line
      const handleScroll = (e: any) => {
        // @ts-ignore
        if (headerRef.current?.getBoundingClientRect()?.bottom < 0) {
          setShowFixedHeader(true)
        } else {
          setShowFixedHeader(false)
        }
      }

      wrapperRef.current.addEventListener('mousewheel', handleScroll)
      wrapperRef.current.addEventListener('scroll', handleScroll)

      return () => {
        wrapperRef.current?.removeEventListener('mousewheel', handleScroll)
        wrapperRef.current?.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    nftsActions.fetchNftCollection({ slug })
  }, [slug, nftsActions])

  useEffect(() => {
    coinsActions.fetchCoinsRates()
  }, [coinsActions])

  const scrollUp = () => {
    wrapperRef.current?.parentElement?.scrollTo({ behavior: 'smooth', top: 0 })
    setShowFixedHeader(false)
  }

  return (
    <NftPage ref={wrapperRef}>
      {showFixedHeader ? (
        <CollectionHeaderFixed>
          <div style={{ alignItems: 'center', display: 'flex' }}>
            <LinkContainer role='button' cursor='pointer' to='/nfts'>
              <Icon name={IconName.ARROW_LEFT} color={colors.grey400} />
            </LinkContainer>
            <Icon
              cursor='pointer'
              onClick={scrollUp}
              name={IconName.ARROW_UP}
              color={colors.grey400}
              role='button'
            />
            <CollectionImageSmall src={results.data?.collection?.image_url || ''} />{' '}
            <Text size='14px' weight={500} color='grey900'>
              {results.data?.collection?.name}
            </Text>
          </div>
        </CollectionHeaderFixed>
      ) : null}
      <CollectionHeader ref={headerRef}>
        <CollectionBannerWrapper style={{ width: '100%' }}>
          <LinkContainer role='button' cursor='pointer' to='/nfts'>
            <Icon name={IconName.ARROW_LEFT} color={colors.grey400} />
          </LinkContainer>
          <CollectionBanner
            large
            style={{ marginTop: '12px' }}
            background={`url(${results.data?.collection?.banner_image_url})`}
          />
          <CollectionImage src={results.data?.collection?.image_url || ''} />
          <Stats collection={collection} />
        </CollectionBannerWrapper>
        <div style={{ width: '100%' }}>
          <Text size='40px' color='grey900' weight={600}>
            {results.data?.collection?.name}
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
            {results.data?.collection?.external_url ? (
              <Link target='_blank' href={results.data?.collection?.external_url}>
                <Icon name={IconName.GLOBE} color={colors.grey400} />
              </Link>
            ) : null}
            {results.data?.collection?.instagram_username ? (
              <Link
                target='_blank'
                href={`https://instagram.com/${results.data?.collection?.instagram_username}`}
              >
                <Icon name={IconName.CAMERA} color={colors.grey400} />
              </Link>
            ) : null}
            {results.data?.collection?.discord_url ? (
              <Link target='_blank' href={`${results.data?.collection?.discord_url}`}>
                <Icon name={IconName.COMPUTER} color={colors.grey400} />
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
            {results.data?.collection?.description}
          </Text>
        </div>
      </CollectionHeader>
      <div style={{ marginBottom: '12px' }}>
        <Icon
          onClick={() =>
            modalActions.showModal(ModalName.NFT_COLLECTION_FILTER, { origin: 'Unknown' })
          }
          cursor='pointer'
          role='button'
          name={IconName.FILTER}
          color={colors.grey400}
        />
      </div>
      <Grid>
        {pageVariables.length
          ? pageVariables.map(({ page }) => (
              <ResultsPage
                page={page}
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
    </NftPage>
  )
}

const mapStateToProps = (state: RootState) => ({
  collection: selectors.components.nfts.getNftCollection(state),
  collectionFilter: selectors.components.nfts.getNftCollectionFilter(state),
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse('')
})

const mapDispatchToProps = (dispatch) => ({
  coinsActions: bindActionCreators(actions.core.data.coins, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> & {
  computedMatch: { params: { slug: string } }
}

export default connector(NftsCollection)
