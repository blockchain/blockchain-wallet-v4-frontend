import React from 'react'
import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import { media } from 'services/styles'

import Modals from '../../modals'
import Header from './Header'

const Wrapper = styled.div`
  background-color: ${colors.white1};
  height: auto;
  min-height: 100%;
  width: 100%;
  overflow: auto;
  ${media.tabletL`
  > div:not(:first-child) {
    padding-right: 20px !important;
    padding-left: 20px !important;
    box-sizing: border-box;
  `}
`

const ExploreTemplate: React.FC<Props> = ({ children }) => {
  return (
    <ErrorBoundary>
      <Wrapper>
        <Header />
        <Modals />
        {children}
      </Wrapper>
    </ErrorBoundary>
  )
}

type Props = {}

export default ExploreTemplate
