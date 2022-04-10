import React from 'react'
import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import Tooltips from 'components/Tooltips'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import { media } from 'services/styles'

import Modals from '../../modals'
import { Props as OwnProps } from '.'
import Header, { FIXED_HEADER_HEIGHT } from './Header'

const Wrapper = styled.div`
  background-color: ${colors.white100};
  height: 100%;
  min-height: 100%;
  width: 100%;
`

const Page = styled.div`
  box-sizing: border-box;
  height: calc(100% - ${FIXED_HEADER_HEIGHT}px);
  background: ${(props) => props.theme.white};
  overflow: auto;
  > div:first-child {
    padding-top: 20px;
  }
  ${media.tabletL`
    padding-right: 20px !important;
    padding-left: 20px !important;
  `}
`

const ExploreTemplate: React.FC<Props> = (props) => {
  return (
    <ErrorBoundary>
      <Wrapper>
        <Header {...props} />
        <Tooltips />
        <Modals />
        <Page>{props.children}</Page>
      </Wrapper>
    </ErrorBoundary>
  )
}

type Props = OwnProps

export default ExploreTemplate
