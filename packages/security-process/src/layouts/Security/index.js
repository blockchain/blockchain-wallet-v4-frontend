import { replace } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import styled from 'styled-components'

import Alerts from 'components/Alerts'
import Header from './Header'
import AnalyticsTracker from 'providers/AnalyticsTracker'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import Modals from 'modals'
import { selectors } from 'data'

const Wrapper = styled.div`
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
    top: 0;
    left: 0;
  }
`
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  margin: 0 25px;

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

class SecurityLayoutContainer extends React.PureComponent {
  render () {
    const {
      component: Component,
      isAuthenticated,
      location,
      ...rest
    } = this.props

    return isAuthenticated ? (
      <React.Fragment>
        <Route
          {...rest}
          render={matchProps => (
            <Wrapper>
              <AnalyticsTracker />
              <ErrorBoundary>
                <Alerts />
                <Modals />
                <HeaderContainer>
                  <Header />
                </HeaderContainer>
                <ContentContainer
                  data-e2e={`page${replace(/\//g, '-', location.pathname)}`}
                >
                  <Component {...matchProps} />
                </ContentContainer>
              </ErrorBoundary>
            </Wrapper>
          )}
        />
      </React.Fragment>
    ) : (
      <Redirect to={{ pathname: '/login', state: { from: '' } }} />
    )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

export default connect(mapStateToProps)(SecurityLayoutContainer)
