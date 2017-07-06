import React from 'react'
import styled from 'styled-components'
import * as ReactBootstrap from 'react-bootstrap'

const BasePasswordBox = (props) => {
  const { type, ...rest } = props
  return (
    <ReactBootstrap.FormControl type='password' {...rest} />
  )
}

const PasswordBox = styled(BasePasswordBox)`

`

export default PasswordBox
