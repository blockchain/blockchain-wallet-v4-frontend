import React from 'react'
import { Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'
import styled from 'styled-components'

import Alerts from 'components/Shared/Alerts'
import { Container } from 'components/Shared/Grid'

const PublicLayoutWrapper = styled.div`
  background-color: #004A7C;
  height: 100%;
`
const HeaderContainer = styled(Container)`
  height: 60px;
`
const ContentContainer = styled(Container)`
  height: calc(100% - 120px);
`
const FooterContainer = styled(Container)`
  height: 60px;
`

const PublicLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <PublicLayoutWrapper>
        <HeaderContainer>
          <Alerts />
          <Header />
        </HeaderContainer>
        <ContentContainer>
          <Component {...matchProps} />
        </ContentContainer>
        <FooterContainer>
          <Footer />
        </FooterContainer>
      </PublicLayoutWrapper>
    )} />
  )
}

export default PublicLayout
