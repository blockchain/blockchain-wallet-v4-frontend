import { Route } from 'react-router-dom'
import Alerts from 'components/Alerts'
import DropdownLanguage from 'components/DropdownLanguage'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import Footer from './Footer'
import Header from './Header'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const DropdownWrapper = styled.div`
  margin: 2rem 3rem 2.5rem 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  ${media.mobile`
    flex-direction: column;
    margin-top: 8px;
  `}

  ${media.tablet`
    > div  {
      position: relative;
      left: -3rem;
    }

    > div:last-child  {
      left: -2rem;
    }
  `}

  > div > ul {
    left: -7rem;
  }
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
  justify-content: center;
  align-items: center;
  margin: 0 25px;
  z-index: 1;

  ${media.mobile`
    margin: 0 10px;
  `}
`

const PublicLayoutContainer = ({ component: Component, path, ...rest }) => (
  <Route
    {...rest}
    render={matchProps => (
      <Wrapper>
        <ErrorBoundary>
          <Alerts />
          <HeaderContainer>
            <Header path={path} />
          </HeaderContainer>
          <ContentContainer>
            <Component {...matchProps} />
          </ContentContainer>
          <DropdownWrapper>
            <Footer />
            <DropdownLanguage color='white' />
          </DropdownWrapper>
        </ErrorBoundary>
      </Wrapper>
    )}
  />
)

export default PublicLayoutContainer
