import React from 'react'
import { replace } from 'ramda'
import styled, { css } from 'styled-components'

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
  background-color: ${(props) => props.theme.white};
`
const Content = styled.div<{ coinViewV2?: true }>`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: calc(100% - 250px);
  max-width: calc(100% - 250px);
  ${({ coinViewV2 }) =>
    coinViewV2 &&
    css`
      width: 100%;
      max-width: 100%;
    `}
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
  const { children, coinViewV2, location } = props

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
          {!coinViewV2 && <MenuLeft />}
          <Content coinViewV2 data-e2e={`page${replace(/\//g, '-', location.pathname)}`}>
            <Page>{children}</Page>
          </Content>
        </Container>
      </ErrorBoundary>
    </Wrapper>
  )
}

export default WalletLayout
