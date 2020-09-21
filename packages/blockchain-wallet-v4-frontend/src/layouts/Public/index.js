import { Route } from 'react-router-dom'
import Alerts from 'components/Alerts'
import DropdownLanguage from 'components/DropdownLanguage'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import Footer from './Footer'
import Header from './Header'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const FooterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 6rem 0 2rem;
  ${media.mobile`
    flex-direction: column;
    margin-top: 8px;
  `}
`

const FooterInner = styled.div`
  padding: 0 2rem;
`

const Wrapper = styled.div`
  background-color: ${props => props.theme.grey900};
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
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 32px;
  z-index: 1;
  width: 100%;
  ${media.mobile`
    padding: 0 15px;
  `}
`

const PublicLayoutContainer = ({ component: Component, ...rest }) => (
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
          <FooterWrapper>
            <FooterInner>
              <DropdownLanguage color='grey400' />
              <Footer />
            </FooterInner>
          </FooterWrapper>
        </ErrorBoundary>
      </Wrapper>
    )}
  />
)

export default PublicLayoutContainer
