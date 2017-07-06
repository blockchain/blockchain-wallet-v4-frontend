import React from 'react'
import styled from 'styled-components'
import * as ReactBootstrap from 'react-bootstrap'

const BaseTextBox = (props) => {
  const { type, ...rest } = props
  return (
    <ReactBootstrap.FormControl type='text' {...rest} />
  )
}

const TextBox = styled(BaseTextBox)`
  
`

export default TextBox
