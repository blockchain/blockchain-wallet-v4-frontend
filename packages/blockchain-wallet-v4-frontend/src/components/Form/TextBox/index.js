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
    className,
    meta,
    input,
    disabled,
    placeholder,
    center,
    errorBottom,
    noLastPass,
    maxLength,
    autoFocus,
    borderRightNone
  } = field
  const { initial, active, touched, error, warning } = meta
  const errorState = getErrorState(meta)

  return (
    <Container className={className}>
      <TextInput
        {...input}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        borderRightNone={borderRightNone}
        active={active}
        disabled={disabled}
        errorState={errorState}
        initial={initial}
        placeholder={placeholder}
        center={center}
        noLastPass={noLastPass}
        maxLength={maxLength}
        data-e2e={field['data-e2e']}
      />
      {touched && error && (
        <Error
          size='12px'
          weight={300}
          color='error'
          errorBottom={errorBottom}
          data-e2e='textBoxError'
        >
          {error}
        </Error>
      )}
      {touched && !error && warning && (
        <Error size='12px' weight={300} color='sent' errorBottom={errorBottom}>
          {warning}
        </Error>
      )}
    </Container>
  )
}

export default TextBox
