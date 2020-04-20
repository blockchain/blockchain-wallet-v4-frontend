import { replace } from 'ramda'
import Alerts from 'components/Alerts'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import Header from './Header'
import media from 'services/ResponsiveService'
import MenuLeft from './MenuLeft'
import Modals from 'modals'
import Page from './Page'
import React from 'react'
import styled from 'styled-components'
import Tooltips from 'components/Tooltips'
import ZendeskWidget from 'components/ZendeskWidget'

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
  background-color: ${props => props.theme.blue900};
`
const Content = styled.div`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: calc(100% - 250px);
  background-color: ${props => props.theme.white};
  padding: 16px 30px;
  ${media.tablet`
    padding: 8px 16px;
    width: 100%;
  `}
`

const WalletLayout = props => {
  const { children, location } = props

  return (
    <Wrapper>
      <ErrorBoundary>
        <Alerts />
        <Tooltips />
        <Modals />
        <Nav>
          <Header />
        </Nav>
        <Container>
          <MenuLeft location={location} />
          <Content data-e2e={`page${replace(/\//g, '-', location.pathname)}`}>
            <Page>{children}</Page>
          </Content>
        </Container>
        <ZendeskWidget />
      </ErrorBoundary>
    </Wrapper>
  )
}

export default WalletLayout
