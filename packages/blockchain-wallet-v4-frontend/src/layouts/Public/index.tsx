import React, { ComponentType } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Route } from 'react-router-dom'
import styled, { css } from 'styled-components'

import Alerts from 'components/Alerts'
import { selectors } from 'data'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import { media } from 'services/styles'

import Modals from '../../modals'
import Footer from './components/Footer'
// import AndroidAppBanner from './components/AndroidAppBanner'
import Header from './components/Header'

const FooterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin: 6rem 0 2rem;
  ${media.mobile`
    flex-direction: column;
    margin-top: 8px;
  `}
`

const Wrapper = styled.div<{ authProduct?: string }>`
  background-color: ${(props) =>
    props.authProduct === 'EXCHANGE' ? props.theme.exchangeLogin : props.theme.grey900};
  height: auto;
  min-height: 100%;
  width: 100%;
  overflow: auto;

  ${media.atLeastTablet`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  `}
`

const HeaderContainer = styled.div`
  position: relative;
  width: 100%;
`
const ContentContainer = styled.div<{ isLogin?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0 16px;

  ${(props) =>
    props.isLogin &&
    css`
      margin-top: 40px;
    `}
`

const PublicLayoutContainer = ({
  authProduct,
  component: Component,
  exact = false,
  path
}: Props) => {
  const isLogin = path === '/login'

  return (
    <Route
      path={path}
      exact={exact}
      render={(matchProps) => (
        <ErrorBoundary>
          <Wrapper authProduct={authProduct}>
            {/* TODO: STILL NEEDS DEV/QA */}
            {/* <AndroidAppBanner /> */}
            <Alerts />

            <HeaderContainer>
              <Header authProduct={authProduct} />
            </HeaderContainer>

            <Modals />
            <ContentContainer isLogin={isLogin}>
              <Component {...matchProps} />
            </ContentContainer>

            <FooterContainer>
              <Footer />
            </FooterContainer>
          </Wrapper>
        </ErrorBoundary>
      )}
    />
  )
}

const mapStateToProps = (state) => ({
  authProduct: selectors.auth.getProduct(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector> & {
  component: ComponentType<any>
  exact?: boolean
  path: string
}

export default connector(PublicLayoutContainer)
