import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  margin-bottom: 15px;
  input[type='text'],
  input[type='number'],
  input[type='password'] {
    width: 100%;
    height: 40px;
    display: block;
    font-size: 14px;
    outline-width: 0;
    min-height: 40px;
    line-height: 1.42;
    padding: 6px 12px;
    user-select: text;
    background-image: none;
    box-sizing: border-box;
    color: ${props => props.theme['gray-5']};
    background-color: ${props => props.theme['white']};
    border: 1px solid  ${props => props.theme[props.borderColor]};
  }
  &::-webkit-input-placeholder {
    color: ${props => props.theme['gray-2']};
  }
`

const Error = styled(Text)`
  position: absolute;
  display: block;
  top: -18px;
  right: 0;
  height: 15px;
`

const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const FormGroup = props => {
  const errorState = getErrorState(field.meta)

  return (
    <Container>
      {props.children}
    </Container>
  )
}

export default FormGroup
