import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div<{ height: string }>`
  width: 100%;
  height: ${(props) => props.height};
  margin: 0 auto;
  background-color: ${(props) => props.theme.grey900};
`

const BaseNavbar = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: inherit;
`

const Navbar = ({ children, height = '60px', ...rest }) => {
  return (
    <Wrapper height={height}>
      <BaseNavbar {...rest}>{children}</BaseNavbar>
    </Wrapper>
  )
}

Navbar.propTypes = {
  height: PropTypes.string.isRequired
}

export default Navbar
