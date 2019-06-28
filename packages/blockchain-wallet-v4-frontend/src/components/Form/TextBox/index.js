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
  height: ${props => props.height};
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  height: 15px;
  top: ${props => (props.errorBottom ? props.height : '-20px')};
  right: 0;
`
const getErrorState = ({ touched, invalid }) => {
  return touched && invalid ? 'invalid' : 'initial'
}

const TextBox = field => {
  const {
    autoComplete,
    autoFocus,
    borderRightNone,
    center,
    className,
    disabled,
    disableSpellcheck,
    errorBottom,
    height,
    input,
    maxLength,
    meta,
    noLastPass,
    placeholder
  } = field
  const { initial, active, touched, error, warning } = meta
  const errorState = getErrorState(meta)

  return (
    <Container className={className} height={height}>
      <TextInput
        {...input}
        active={active}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        borderRightNone={borderRightNone}
        center={center}
        data-e2e={field['data-e2e']}
        disabled={disabled}
        disableSpellcheck={disableSpellcheck}
        errorState={errorState}
        height={height}
        initial={initial}
        maxLength={maxLength}
        noLastPass={noLastPass}
        placeholder={placeholder}
      />
      {touched && error && (
        <Error
          size='12px'
          weight={500}
          color='error'
          height={height}
          errorBottom={errorBottom}
          data-e2e='textBoxError'
        >
          {error}
        </Error>
      )}
      {touched && !error && warning && (
        <Error size='12px' weight={400} color='sent' errorBottom={errorBottom}>
          {warning}
        </Error>
      )}
    </Container>
  )
}

TextBox.defaultProps = {
  height: '48px'
}

export default TextBox
