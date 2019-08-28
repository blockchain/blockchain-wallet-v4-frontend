import React from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

import ExternalLinks from './ExternalLinks'
import Header from './Header'
import Footer from './Footer'
import Alerts from 'components/Alerts'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import media from 'services/ResponsiveService'

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
`
const Spacer = styled.div``
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow-y: auto;
  margin: 0 25px;
  z-index: 1;

  @media (min-width: 768px) {
    height: 100%;
  }
  ${media.mobile`
    margin: 0 10px;
  `}
`
const ComponentContainer = styled.div``

class PublicLayoutContainer extends React.PureComponent {
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
                  <Spacer />
                  <ComponentContainer>
                    <Component {...matchProps} />
                    <ExternalLinks />
                  </ComponentContainer>
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

export default PublicLayoutContainer
