import React from 'react'
import { replace } from 'ramda'
import styled from 'styled-components'

import Alerts from 'components/Alerts'
import Announcements from 'components/Announcements'
import Tooltips from 'components/Tooltips'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import { media } from 'services/styles'

import Modals from '../../modals'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'
import Page from './Page'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow-y: auto;
`
const Nav = styled.div`
  flex: 0 0 60px;
  background-color: ${(props) => props.theme.blue900};
`
const Content = styled.div`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: calc(100% - 250px);
  max-width: calc(100% - 250px);
  background-color: ${(props) => props.theme.white};
  padding: 32px 28px 16px 36px;
  ${media.tablet`
    padding: 8px 16px;
    width: 100%;
    max-width: 100%;
  `}
  ${media.mobile`
    padding: 8px 16px;
    width: 100%;
    max-width: 100%;
  `}
`

const WalletLayout = (props) => {
  const { children, location } = props

  return (
    <Wrapper>
      <ErrorBoundary>
        <Alerts />
        <Tooltips />
        <Modals />
        <Nav>
          <MenuTop />
          <Announcements type='service' alertArea='wallet' />
          <Announcements type='static' />
        </Nav>
        <Container>
          <MenuLeft />
          <Content data-e2e={`page${replace(/\//g, '-', location.pathname)}`}>
            <Page>{children}</Page>
          </Content>
        </Container>
      </ErrorBoundary>
    </Wrapper>
  )
}

export default WalletLayout
