import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import styled, { injectGlobal } from 'styled-components'

import Header from './Header'
import Footer from './Footer'
import Alerts from 'components/Alerts'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import { selectors } from 'data'
import { isOnDotInfo } from 'services/MigrationService'
import Media from 'services/ResponsiveService'
injectGlobal`
  html, body, #app, #app > div {padding: 0; margin: 0; height: 100%;}
  html, body {overflow: hidden;}
`

const defaultDomains = {
  root: 'https://blockchain.info',
  comWalletApp: 'https://login.blockchain.com',
  comRoot: 'https://blockchain.com'
}

injectGlobal`
  html, body, #app, #app > div {padding: 0; margin: 0; height: 100%;}
  body {overflow: hidden;}
`

const Wrapper = styled.div`
  background-color: ${props => props.theme['brand-primary']};
  min-height: 100%;
  width: 100%;
  overflow: auto;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;

  ${Media.tablet`
    height: auto;
  `};
`
const HeaderContainer = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  ${Media.tablet`
    position: relative;
  `};
`
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  margin: 0 25px;
  height: 100%;

  @media (min-height: 1000px) {
    margin-top: 200px;
    justify-content: flex-start;
  }

  @media (min-height: 1400px) {
    margin-top: 500px;
    justify-content: flex-start;
  }
`
const FooterContainer = styled.div`
  width: 100%;
  padding: 20px;
  position: fixed;
  bottom: 0;
  left: 0;
  ${Media.tablet`
    position: relative;
  `};
`

class PublicLayoutContainer extends React.PureComponent {
  componentDidMount () {
    const { domainsR, migrationRedirectsR, pathname } = this.props
    const domains = domainsR.getOrElse(defaultDomains)
    const enableRedirects = migrationRedirectsR.getOrElse(false)

    if (enableRedirects && isOnDotInfo(domains)) {
      if (pathname === '/wallet') {
        window.location = `${domains.comRoot}/wallet`
      } else {
        window.location = `${domains.comWalletApp}/${pathname}`
      }
    }
  }

  render () {
    const { component: Component, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={matchProps => (
          <Wrapper>
            <ErrorBoundary>
              <Alerts />
              <HeaderContainer>
                <Header />
              </HeaderContainer>
              <ContentContainer>
                <Component {...matchProps} />
              </ContentContainer>
              <FooterContainer>
                <Footer />
              </FooterContainer>
            </ErrorBoundary>
          </Wrapper>
        )}
      />
    )
  }
}

const mapStateToProps = state => ({
  pathname: selectors.router.getPathname(state),
  domainsR: selectors.core.walletOptions.getDomains(state),
  migrationRedirectsR: selectors.core.walletOptions.getMigrationRedirects(state)
})

export default connect(mapStateToProps)(PublicLayoutContainer)
