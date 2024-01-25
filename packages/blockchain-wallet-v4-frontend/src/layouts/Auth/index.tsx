import React, { ComponentType } from 'react'
import { useSelector } from 'react-redux'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

import Alerts from 'components/Alerts'
import { getProduct } from 'data/auth/selectors'
import { useDefer3rdPartyScript } from 'hooks'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import { isMobile, media } from 'services/styles'

import Modals from '../../modals'
import Footer from './components/Footer'
import Header from './components/Header'

const qsParams = new URLSearchParams(window.location.hash)
const isLatam = qsParams.has('latam')
const isSofi = window.location.hash.includes('sofi')
const isSofiOnMobile = isSofi && isMobile()

const Wrapper = styled.div<{ authProduct?: string }>`
  background-color: ${(props) =>
    props.authProduct === 'EXCHANGE'
      ? props.theme.exchangeLogin
      : isLatam
      ? '#04001F'
      : isSofiOnMobile
      ? 'white'
      : props.theme.grey900};
  height: auto;
  min-height: 100%;
  width: 100%;
  overflow: auto;

  ${media.atLeastTablet`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    > div:last-child {
      margin-top: auto;
    }
  `}
`

const HeaderContainer = styled.div`
  position: relative;
  width: 100%;
`
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0 16px;
  ${media.mobile`
  margin: 0;
`}
`

const AuthLayoutContainer = ({ component: Component, exact = false, pageTitle, path }: Props) => {
  const authProduct = useSelector(getProduct)
  // lazy load google captcha
  useDefer3rdPartyScript(
    `https://www.google.com/recaptcha/enterprise.js?render=${window.CAPTCHA_KEY}`,
    {
      attributes: {
        nonce: window.nonce
      }
    }
  )

  // update page title from route
  if (pageTitle) document.title = pageTitle
  return (
    <Route
      path={path}
      exact={exact}
      render={(matchProps) => (
        <ErrorBoundary>
          <Wrapper authProduct={authProduct}>
            <Alerts />
            <HeaderContainer>
              <Header authProduct={authProduct} />
            </HeaderContainer>
            <Modals />
            <ContentContainer>
              <Component {...matchProps} />
            </ContentContainer>
            {!isSofiOnMobile && <Footer path={path} />}
          </Wrapper>
        </ErrorBoundary>
      )}
    />
  )
}

type Props = {
  component: ComponentType<any>
  exact?: boolean
  pageTitle?: string
  path: string
}

export default AuthLayoutContainer
