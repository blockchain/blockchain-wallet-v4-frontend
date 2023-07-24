import React from 'react'
import styled from 'styled-components'

import Alerts from 'components/Alerts'
import Tooltips from 'components/Tooltips'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'

import Modals from '../../modals'
import MenuTop from '../Wallet/MenuTop'
import { Nav } from '../Wallet/WalletLayout/WalletLayout.styles'

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
  overflow: scroll;

  > div:first-child {
    z-index: 1;
    position: relative;
    top: 56px;
    padding: 0 24px;
    border-top: 0;
  }
`

const DexTemplate = (props) => (
  <ErrorBoundary>
    <Wrapper>
      <Alerts />
      <Nav>
        <MenuTop />
      </Nav>
      <Tooltips />
      <Modals />
      <Page>{props.children}</Page>
    </Wrapper>
  </ErrorBoundary>
)

export default DexTemplate
