import React from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

import Header from './Header'
import Footer from './Footer'
import Alerts from 'components/Alerts'
import Container from 'components/Container'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'

const Wrapper = styled.div`
  background-color: ${props => props.theme['brand-primary']};
  height: auto;
  min-height: 100%;
  width: 100%;
  overflow: auto;

  @media(min-width: 768px) {
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

  @media(min-width: 768px) {
    position: fixed;
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
const FooterContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 20px 0;

  @media(min-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
  }
`

const PublicLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
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
            <Container>
              <Footer />
            </Container>
          </FooterContainer>
        </ErrorBoundary>
      </Wrapper>
    )} />
  )
}

export default PublicLayout
