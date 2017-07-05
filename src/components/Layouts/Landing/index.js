import React from 'react'
import styled from 'styled-components'
import { Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'

const LandingLayoutWrapper = styled.div`
  background-color: #004A7C;
`

const LandingLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <LandingLayoutWrapper>
        <Header />
        <Component {...matchProps} />
        <Footer />
      </LandingLayoutWrapper>
    )} />
  )
}

export default LandingLayout
