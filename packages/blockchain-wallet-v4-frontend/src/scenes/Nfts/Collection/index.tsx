import React, { useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { colors, Icon, IconName } from '@blockchain-com/constellation'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { CombinedError } from 'urql'

import { Button, SpinningLoader, Text, TextGroup } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { useCollectionQuery } from 'generated/graphql'

import { CollectionBanner, Grid, NftPage } from '../components'
import Error from './error'
import ResultsPage from './results'

const CollectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 24px;
  gap: 24px;
`

const CollectionBannerWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100px;
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
  top: 50%;
  left: calc(50% - 60px);
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.grey100};
`

const CollectionImageSmall = styled.img`
  border-radius: 50%;
  height: 30px;
  width: 30px;
  margin-right: 8px;
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

const NftsCollection: React.FC<Props> = ({ defaultEthAddr, nftsActions, ...rest }) => {
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
    setPageVariables([])
    setTimeout(() => {
      setPageVariables([{ page: 0 }])
    }, 1000)
  }, [slug])

  useEffect(() => {
    if (wrapperRef.current) {
      const handleScroll = (e) => {
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

  return (
    <NftPage ref={wrapperRef}>
      {showFixedHeader ? (
        <CollectionHeaderFixed>
          <div style={{ alignItems: 'center', display: 'flex' }}>
            <LinkContainer cursor='pointer' to='/nfts'>
              <Icon name={IconName.ARROW_LEFT} color={colors.grey600} />
            </LinkContainer>
            <CollectionImageSmall src={results.data?.collection?.image_url || ''} />{' '}
            <Text size='14px' weight={500} color='grey900'>
              {results.data?.collection?.name}
            </Text>
          </div>
        </CollectionHeaderFixed>
      ) : null}
      <CollectionHeader ref={headerRef}>
        <CollectionBannerWrapper style={{ width: '100%' }}>
          <LinkContainer cursor='pointer' to='/nfts'>
            <Icon
              style={{ marginBottom: '8px' }}
              name={IconName.ARROW_LEFT}
              color={colors.grey600}
            />
          </LinkContainer>
          <CollectionBanner
            large
            background={`url(${results.data?.collection?.banner_image_url})`}
          />
          <CollectionImage src={results.data?.collection?.image_url || ''} />
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
      <Grid>
        {pageVariables.length
          ? pageVariables.map(({ page }) => (
              <ResultsPage
                page={page}
                key={page}
                slug={slug}
                defaultEthAddr={defaultEthAddr}
                setNextPageFetchError={setNextPageFetchError}
                nftsActions={nftsActions}
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
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse('')
})

const mapDispatchToProps = (dispatch) => ({
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> & {
  computedMatch: { params: { slug: string } }
}

export default connector(NftsCollection)
