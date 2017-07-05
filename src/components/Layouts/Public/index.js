import React from 'react'
import { Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'
import styled from 'styled-components'

import Alerts from 'components/shared/Alerts'
import { Grid } from 'components/generic/Grid'

const PublicLayoutWrapper = styled.div`
  background-color: #004A7C;
  height: 100%;
`
const PublicLayoutContainer = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`

const PublicLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <PublicLayoutWrapper>
        <PublicLayoutContainer>
          <Alerts />
          <Header />
          <Component {...matchProps} />
          <Footer />
        </PublicLayoutContainer>
      </PublicLayoutWrapper>
    )} />
  )
}

export default PublicLayout
