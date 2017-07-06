import React from 'react'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'

const BaseRouterLink = ({ children, ...props }) => {
  return (
    <LinkContainer {...props}>
      {children}
    </LinkContainer>
  )
}

const RouterLink = styled(BaseRouterLink)`
  cursor: pointer;
`

export default RouterLink
