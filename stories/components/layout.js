import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DefaultColor } from '../../src/Colors'

const BasePage = styled.div`
  font-family: -apple-system, ".SFNSText-Regular", "San Francisco", Roboto, "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif;
  color: rgb(68, 68, 68);
  -webkit-font-smoothing: antialiased;
  font-weight: 300;
  line-height: 1.45;
  font-size: 15px;
  border: 1px solid ${DefaultColor.bordergrey};
  padding: 20px 40px 40px;
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 2px 3px;
  background-color: ${DefaultColor.white};
  margin-top: 20px;
  margin-bottom: -30px;
`
const TitleWrapper = styled.div`
  border-bottom: 1px solid ${DefaultColor.bordergrey};
  padding-top: 10px;
  margin-bottom: 30px;
`
const Title = styled.h1`
  margin: 0px;
  padding: 0px;
  font-size: 25px;
`
const Content = styled.div`
  position: relative;
  
  & > * {
    margin: 10px auto;
  }
`
const Layout = props => {
  return (
    <BasePage>
      <TitleWrapper>
        <Title>Visual</Title>
      </TitleWrapper>
      <Content>
        {props.children}
      </Content>
    </BasePage>
  )
}

export default Layout
