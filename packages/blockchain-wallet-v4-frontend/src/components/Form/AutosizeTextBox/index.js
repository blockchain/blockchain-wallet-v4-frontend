import React from 'react'
import styled from 'styled-components'

import { AutosizeTextInput, Text } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  height: 40px;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  height: 15px;
  top: ${(props) => (props.errorBottom ? '40px' : '-20px')};
  right: 0;
`
const getErrorState = ({ invalid, touched }) => {
  return touched && invalid ? 'invalid' : 'initial'
}

export const AutosizeTextBox = (props) => {
  const {
    autoComplete,
    autoFocus,
    borderRightNone,
    center,
    className,
    disabled,
    errorBottom,
    hideError,
    input,
    maxLength,
    meta,
    noLastPass,
    placeholder,
    pointerToLeft
  } = props
  const { active, error, initial, touched, warning } = meta
  const errorState = getErrorState(meta)

  return (
    <Container className={className}>
      <AutosizeTextInput
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
        pointerToLeft={pointerToLeft}
        data-e2e={props['data-e2e']}
      />
      {touched && error && !hideError && (
        <Error size='12px' weight={500} color='error' errorBottom={errorBottom}>
          {error}
        </Error>
      )}
      {touched && !error && warning && (
        <Error size='12px' weight={500} color='error' errorBottom={errorBottom}>
          {warning}
        </Error>
      )}
    </Container>
  )
}

export default AutosizeTextBox
