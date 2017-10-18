import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  height: ${props => props.height};
  margin: 0 auto;
  background-color: ${props => props.theme['brand-primary']};

  @media(min-width: 768px) { width: ${props => props.fluid ? '720px' : '100%'}; }
  @media(min-width: 992px) { width: ${props => props.fluid ? '960px' : '100%'}; }
  @media(min-width: 1200px) { width: ${props => props.fluid ? '1140px' : '100%'}; }
`

const BaseNavbar = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: inherit;
`

const Navbar = props => {
  const { children, fluid, height, ...rest } = props

  return (
    <Wrapper fluid={fluid} height={height}>
      <BaseNavbar {...rest}>
        {children}
      </BaseNavbar>
    </Wrapper>
  )
}

Navbar.propTypes = {
  fluid: PropTypes.bool.isRequired,
  height: PropTypes.string.isRequired
}

Navbar.defaultProps = {
  fluid: false,
  height: '60px'
}

export default Navbar
