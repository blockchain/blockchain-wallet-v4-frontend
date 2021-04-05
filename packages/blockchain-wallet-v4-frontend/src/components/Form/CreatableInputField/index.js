import React from 'react'
import styled from 'styled-components'

import { CreatableInput } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  height: auto;
  width: 100%;
  max-width: ${props => props.maxWidth || '100%'};
`
const Error = styled.label`
  position: absolute;
  top: ${props => (props.errorBottom ? '40px' : '-20px')};
  right: 0;
  display: block;
  height: 15px;
  font-size: 12px;
  font-weight: 400;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: ${props => props.theme['error']};
`

const CreatableInputField = props => {
  const { errorBottom, hideErrors, input, meta, ...rest } = props
  const { error, invalid, pristine, touched } = meta
  const errorState = touched && invalid ? 'invalid' : 'initial'

  return (
    <Container maxWidth={props.maxWidth} data-e2e={props.dataE2e}>
      <CreatableInput {...input} {...meta} {...rest} errorState={errorState} />
      {(touched || !pristine) && error && !hideErrors && (
        <Error errorBottom={errorBottom}>{error}</Error>
      )}
    </Container>
  )
}

export default CreatableInputField
