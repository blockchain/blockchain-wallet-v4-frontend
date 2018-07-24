import React from 'react'
import styled from 'styled-components'

import { Text, TextInput } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  height: 40px;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  height: 15px;
  top: ${props => (props.errorBottom ? '40px' : '-20px')};
  right: 0;
`
const getErrorState = ({ touched, invalid }) => {
  return touched && invalid ? 'invalid' : 'initial'
}

const TextBox = field => {
  const {
    autoComplete,
    meta,
    input,
    disabled,
    placeholder,
    center,
    errorBottom,
    noLastPass,
    borderRightNone
  } = field
  const { initial, active, touched, error, warning } = meta
  const errorState = getErrorState(meta)

  return (
    <Container>
      <TextInput
        {...input}
        autoComplete={autoComplete}
        borderRightNone={borderRightNone}
        active={active}
        disabled={disabled}
        errorState={errorState}
        initial={initial}
        placeholder={placeholder}
        center={center}
        noLastPass={noLastPass}
      />
      {touched &&
        error && (
          <Error
            size='12px'
            weight={300}
            color='error'
            errorBottom={errorBottom}
          >
            {error}
          </Error>
        )}
      {touched &&
        !error &&
        warning && (
          <Error
            size='12px'
            weight={300}
            color='sent'
            errorBottom={errorBottom}
          >
            {warning}
          </Error>
        )}
    </Container>
  )
}

export default TextBox
