import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Navigation from './Navigation'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const Left = styled.div`
  flex: 0 0 270px;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: #F5F7F9;
  border-right: 1px solid #DDDDDD;
  z-index: 1000;
`
const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: calc(100% - 270px);
`

const WalletLayout = (props) => {
  const { location, children } = props

  return (
    <Wrapper>
      <Left>
        {/*<Navigation location={location} />*/}
      </Left>
      <Content>
        {children}
      </Content>
    </Wrapper>
  )
}

WalletLayout.propTypes = {
  location: PropTypes.object.isRequired
}

export default WalletLayout
