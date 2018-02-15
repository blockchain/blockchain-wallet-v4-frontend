import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 15px;
  flex-direction: ${props => props.inline ? 'row' : 'column'};
  > div {
    margin-right: ${props => props.inline ? '15px' : '0px'};
    &:last-child { margin-right: 0px; }
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
