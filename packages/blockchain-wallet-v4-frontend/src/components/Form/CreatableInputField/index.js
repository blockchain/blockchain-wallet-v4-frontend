import { CreatableInput } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

import media from 'services/ResponsiveService'

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

  ${media.mobile`
  top: ${({ errorBottom, errorDoubleLine }) =>
    errorBottom ? '48px' : errorDoubleLine ? '-32px' : '-20px'}
  width: ${({ errorWidth }) => (errorWidth || 'inherit')}
`}
`

const CreatableInputField = props => {
  const {
    input,
    meta,
    hideErrors,
    errorBottom,
    errorDoubleLine,
    errorWidth,
    ...rest
  } = props
  const { touched, invalid, error, pristine } = meta
  const errorState = touched && invalid ? 'invalid' : 'initial'

  return (
    <Container maxWidth={props.maxWidth} data-e2e={props.dataE2e}>
      <CreatableInput {...input} {...meta} {...rest} errorState={errorState} />
      {(touched || !pristine) && error && !hideErrors && (
        <Error
          errorBottom={errorBottom}
          errorDoubleLine={errorDoubleLine}
          errorWidth={errorWidth}
        >
          {error}
        </Error>
      )}
    </Container>
  )
}

export default CreatableInputField
