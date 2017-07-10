import React from 'react'
import styled from 'styled-components'

const BaseLink = styled.a`
  text-decoration: none;
  &:hover { text-decoration: none; }
  &:focus { text-decoration: none; }
`

const Link = ({...props, children}) => {
  return (
    <BaseLink {...props}>
      {children}
    </BaseLink>
  )
}

export default Link
