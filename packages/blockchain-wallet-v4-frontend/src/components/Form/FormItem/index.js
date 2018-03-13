import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: ${props => props.width || '100%'};
  &:not(:first-child) {
    margin-top: 10px;
  }
`

const FormGroup = props => {
  const { children, ...rest } = props

  return (
    <Wrapper {...rest}>
      {children}
    </Wrapper>
  )
}

export default FormGroup
