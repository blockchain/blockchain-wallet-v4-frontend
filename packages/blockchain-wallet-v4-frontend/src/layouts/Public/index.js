import { Route } from 'react-router-dom'
import Alerts from 'components/Alerts'
import DropdownLanguage from 'components/DropdownLanguage'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import Header from './Header'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const DropdownWrapper = styled.div`
  margin: 1rem 0 2.5rem 0;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  ${media.mobile`
    flex-direction: column;
    margin-top: 8px;
  `}
`

const Wrapper = styled.div`
  background-color: ${props => props.theme.blue900};
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

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 0 25px;
  z-index: 1;

  @media (min-width: 768px) {
    height: 100%;
  }
  ${media.mobile`
    margin: 0 10px;
  `}
`

const Spacer = styled.div``

const PublicLayoutContainer = ({ component: Component, path, ...rest }) => (
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
            <Component {...matchProps} />
            <DropdownWrapper>
              <DropdownLanguage color='white' />
            </DropdownWrapper>
          </ContentContainer>
        </ErrorBoundary>
      </Wrapper>
    )}
  />
)

export default PublicLayoutContainer
