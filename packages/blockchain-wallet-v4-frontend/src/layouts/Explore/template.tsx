import React from 'react'
import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import ErrorBoundary from 'providers/ErrorBoundaryProvider'

import Modals from '../../modals'
import Header from './Header'

const Wrapper = styled.div`
  background-color: ${colors.white1};
  height: auto;
  min-height: 100%;
  width: 100%;
  overflow: auto;
`

const ExploreTemplate: React.FC<Props> = ({ children }) => {
  return (
    <ErrorBoundary>
      <Wrapper>
        <Modals />
        <Header />
        {children}
      </Wrapper>
    </ErrorBoundary>
  )
}

type Props = {}

export default ExploreTemplate
