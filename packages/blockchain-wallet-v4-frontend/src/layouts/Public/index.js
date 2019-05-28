import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

import Header from './Header'
import Footer from './Footer'
import Alerts from 'components/Alerts'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import { selectors } from 'data'
import { isOnDotInfo } from 'services/MigrationService'

const defaultDomains = {
  root: 'https://blockchain.info',
  comWalletApp: 'https://login.blockchain.com',
  comRoot: 'https://blockchain.com'
}

const Wrapper = styled.div`
  background-color: ${props => props.theme['brand-primary']};
  height: auto;
  min-height: 100%;
  width: 100%;
  overflow: auto;

  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }
`
const HeaderContainer = styled.div`
  position: relative;
  width: 100%;

  @media (min-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
  }
`
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow-y: auto;
  margin: 0 25px;

  > div,
  > footer {
    height: 100%;
  }

  @media (min-width: 768px) {
    height: 100%;
  }

  @media (min-height: 1000px) {
    height: 100%;
    margin-top: 200px;
    justify-content: flex-start;
  }

  @media (min-height: 1400px) {
    height: 100%;
    margin-top: 500px;
    justify-content: flex-start;
  }
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
      <React.Fragment>
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
                  {/* Empty div for space-between */}
                  <div />
                  <Component {...matchProps} />
                  <Footer />
                </ContentContainer>
              </ErrorBoundary>
            </Wrapper>
          )}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  pathname: selectors.router.getPathname(state),
  domainsR: selectors.core.walletOptions.getDomains(state),
  migrationRedirectsR: selectors.core.walletOptions.getMigrationRedirects(state)
})

export default connect(mapStateToProps)(PublicLayoutContainer)
