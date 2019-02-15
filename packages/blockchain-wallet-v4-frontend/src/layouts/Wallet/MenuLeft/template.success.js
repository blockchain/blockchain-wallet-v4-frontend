import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Footer from './Footer'
import Navigation from './Navigation'

export const Container = styled.div`
  display: flex;
  position: absolute;
  flex-direction: column;
  justify-content: space-between;
  left: ${props => (props.toggled ? '0' : '-270px')};
  width: 270px;
  height: 100%;
  padding: 15px;
  overflow: scroll;
  box-sizing: border-box;
  background: ${props => props.theme['white-blue']};
  border-right: 1px solid ${props => props.theme['gray-1']};
  transition: left 0.3s ease-in-out;
  z-index: 11;
  ::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    display: flex;
    flex: 0 0 270px;
    position: relative;
    top: 0px;
    left: 0px;
  }
`

const ActiveIndicator = styled.div`
  top: ${props => props.offsetTop}px;
  transition: top 0.5s;
  position: absolute;
  height: 38px;
  width: 3px;
  left: 0;
  background: ${props => props.theme['marketing-primary']};
`

const Overflow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 600px;
  height: 100%;
`

const MenuLeft = props => (
  <Container toggled={props.menuOpened}>
    <Overflow>
      <ActiveIndicator offsetTop={props.offsetTop} />
      <Navigation {...props} />
      <Footer />
    </Overflow>
  </Container>
)

MenuLeft.propTypes = {
  toggled: PropTypes.bool.isRequired
}

MenuLeft.defaultProps = {
  toggled: false
}

export default MenuLeft
