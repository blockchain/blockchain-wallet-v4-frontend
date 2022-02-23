import React from 'react'
import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import { media } from 'services/styles'

import Modals from '../../modals'
import Header, { FIXED_HEADER_HEIGHT } from './Header'

const Wrapper = styled.div`
  background-color: ${colors.white1};
  height: 100%;
  min-height: 100%;
  width: 100%;
`

const Page = styled.div`
  box-sizing: border-box;
  height: calc(100% - ${FIXED_HEADER_HEIGHT}px);
  overflow: auto;
  > div:first-child {
    padding-top: 20px;
  }
  ${media.tabletL`
    padding-right: 20px !important;
    padding-left: 20px !important;
  `}
`

const ExploreTemplate: React.FC<Props> = ({ children }) => {
  return (
    <ErrorBoundary>
      <Wrapper>
        <Header />
        <Modals />
        <Page>{children}</Page>
      </Wrapper>
    </ErrorBoundary>
  )
}

type Props = {}

export default ExploreTemplate
