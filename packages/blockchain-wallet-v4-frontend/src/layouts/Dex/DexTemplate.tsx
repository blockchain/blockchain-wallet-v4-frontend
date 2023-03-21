import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import Alerts from 'components/Alerts'
import Tooltips from 'components/Tooltips'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'

import Modals from '../../modals'
import { DexHeader } from './DexHeader'

const Wrapper = styled.div`
  height: 100%;
  min-height: 100%;
  width: 100%;
`

const Page = styled.div`
  box-sizing: border-box;
  background: ${(props) => props.theme.grey000};
  height: 100%;
  min-height: 100%;
  width: 100%;

  > div:first-child {
    z-index: 1;
    position: relative;
    top: 56px;
    padding: 0 24px;
    border-top: 0;
  }
`

const DexTemplate = (props) => {
  const history = useHistory()
  return (
    <ErrorBoundary history={history}>
      <Wrapper>
        <Alerts />
        <DexHeader selectedTab='dex' />
        <Tooltips />
        <Modals />
        <Page>{props.children}</Page>
      </Wrapper>
    </ErrorBoundary>
  )
}

export default DexTemplate
