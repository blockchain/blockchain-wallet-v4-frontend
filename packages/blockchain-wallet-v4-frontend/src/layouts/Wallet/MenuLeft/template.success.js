import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Navigation from './Navigation'
import Footer from './Footer'

export const Container = styled.div`
  display: flex;
  position: absolute;
  flex-direction: column;
  justify-content: space-between;
  left: ${props => (props.toggled ? '0' : '-250px')};
  width: 250px;
  height: 100%;
  padding: 8px;
  overflow: scroll;
  box-sizing: border-box;
  background: ${props => props.theme['white']};
  transition: left 0.3s ease-in-out;
  z-index: 11;
  ::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    display: flex;
    flex: 0 0 250px;
    position: relative;
    top: 0;
    left: 0;
  }
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
      <Navigation {...props} />
      <Footer {...props} />
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
