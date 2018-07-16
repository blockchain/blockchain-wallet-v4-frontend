import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Footer from './Footer'
import Navigation from './Navigation'

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  left: ${props => props.toggled ? '0' : '-270px'};
  width: 270px;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: ${props => props.theme['white-blue']};
  border-right: 1px solid ${props => props.theme['gray-1']};
  z-index: 8;
  transition: left .3s ease-in-out;

  @media(min-width: 768px) {
    display: flex;
    flex: 0 0 270px;
    position: relative;
    top: initial;
    left: initial;
  }
`

const MenuLeft = props => (
  <Wrapper toggled={props.toggled}>
    <Navigation />
    <Footer />
  </Wrapper>
)

MenuLeft.propTypes = {
  toggled: PropTypes.bool.isRequired
}

MenuLeft.defaultProps = {
  toggled: false
}

export default MenuLeft
