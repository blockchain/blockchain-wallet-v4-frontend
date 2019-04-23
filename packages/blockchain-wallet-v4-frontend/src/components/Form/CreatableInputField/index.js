import React from 'react'
import styled from 'styled-components'
import { CreatableInput } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: auto;
`
const Error = styled.label`
  position: absolute;
  top: ${props => (props.errorBottom ? '40px' : '-20px')};
  right: 0;
  display: block;
  height: 15px;
  font-size: 12px;
  font-weight: 300;
  font-family: 'Montserrat', Helvetica, sans-serif;
  color: ${props => props.theme['error']};
`

const CreatableInputField = props => {
  const { input, meta, hideErrors, errorBottom, ...rest } = props
  const { touched, invalid, error, pristine } = meta
  const errorState = touched && invalid ? 'invalid' : 'initial'

  return (
    <Container>
      <CreatableInput {...input} {...meta} {...rest} errorState={errorState} />
      {(touched || !pristine) && error && !hideErrors && (
        <Error errorBottom={errorBottom}>{error}</Error>
      )}
    </Container>
  )
}

export default CreatableInputField
