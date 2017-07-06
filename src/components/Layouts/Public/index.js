import React from 'react'
import { Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'
import styled from 'styled-components'

import Alerts from 'components/shared/Alerts'
import { Grid } from 'components/generic/Grid'

const Wrapper = styled.div`
  background-color: #004A7C;
  height: 100%;
`
const Container = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;

  &:before, :after { display: none; }
`

const PublicLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <Wrapper>
        <Container>
          <Alerts />
          <Header />
          <Component {...matchProps} />
          <Footer />
        </Container>
      </Wrapper>
    )} />
  )
}

export default PublicLayout
