import React, { useEffect } from 'react'
import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import Alerts from 'components/Alerts'
import Tooltips from 'components/Tooltips'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import { media } from 'services/styles'

import Modals from '../../modals'
import { Props as OwnProps } from './Nfts'
import Header, { FIXED_HEADER_HEIGHT } from './NftsHeader'

const Wrapper = styled.div`
  background-color: ${colors.white100};
  height: 100%;
  min-height: 100%;
  width: 100%;
`

const Page = styled.div`
  box-sizing: border-box;
  background: ${(props) => props.theme.white};
  > div:first-child {
    z-index: 1;
    position: relative;
    top: ${FIXED_HEADER_HEIGHT}px;
    padding-top: 8px;
  }
`

const NftsTemplate: React.FC<Props> = (props) => {
  useEffect(() => {
    props.nftsActions.handleRouterChange({ location: { pathname: window.location.hash } })
  }, [window.location.hash, props.nftsActions])

  return (
    <ErrorBoundary>
      <Wrapper>
        <Alerts />
        <Header {...props} />
        <Tooltips />
        <Modals />
        <Page>{props.children}</Page>
      </Wrapper>
    </ErrorBoundary>
  )
}

type Props = OwnProps

export default NftsTemplate
