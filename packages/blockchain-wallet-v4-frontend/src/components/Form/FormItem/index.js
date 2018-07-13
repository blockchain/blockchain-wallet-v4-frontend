import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  width: ${props => props.width || '100%'};
`

const FormGroup = props => {
  const { children, ...rest } = props

  return <Wrapper {...rest}>{children}</Wrapper>
}

export default FormGroup
