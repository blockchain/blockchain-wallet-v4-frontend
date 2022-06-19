import React, { ComponentType } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

import Alerts from 'components/Alerts'
import { selectors } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { useDefer3rdPartyScript } from 'hooks'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import { media } from 'services/styles'

import Modals from '../../modals'
import Footer from './components/Footer'
import Header from './components/Header'

const qsParams = new URLSearchParams(window.location.hash)
const isLatam = qsParams.has('latam')

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
    props.authProduct === 'EXCHANGE'
      ? props.theme.exchangeLogin
      : isLatam
      ? '#04001F'
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
`

const AuthLayoutContainer = ({
  authProduct,
  component: Component,
  exact = false,
  formValues,
  pageTitle,
  path,
  platform,
  unified
}: Props) => {
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
            <FooterContainer>
              <Footer
                authProduct={authProduct}
                formValues={formValues}
                platform={platform}
                path={path}
                unified={unified}
              />
            </FooterContainer>
          </Wrapper>
        </ErrorBoundary>
      )}
    />
  )
}

const mapStateToProps = (state) => ({
  authProduct: selectors.auth.getProduct(state),
  formValues: selectors.form.getFormValues(LOGIN_FORM)(state),
  platform: selectors.auth.getMagicLinkData(state)?.platform_type,
  unified: selectors.cache.getUnifiedAccountStatus(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector> & {
  component: ComponentType<any>
  exact?: boolean
  pageTitle?: string
  path: string
}

export default connector(AuthLayoutContainer)
