import React from 'react'
import styled from 'styled-components'

import { selectBorderColor, selectFocusBorderColor } from './helper'

const BaseDateInput = styled.input.attrs((props) => ({
  disabled: props.disabled,
  type: 'date'
}))`
  display: block;
  width: 100%;
  height: 48px;
  min-height: 48px;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.grey800};
  background-color: ${({ theme }) => theme.white};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-image: none;
  outline-width: 0;
  user-select: text;
  border: ${({ borderColor, theme }) => `1px solid ${theme[borderColor]}`};
  border-right: ${(props) => (props.borderRightNone ? 'none' : '')};
  border-radius: 8px;

  &:focus {
    border: 1px solid ${({ focusedBorderColor, theme }) => theme[focusedBorderColor]};
  }
  &:focus::placeholder {
    opacity: 0.25;
  }
  &::placeholder {
    color: ${(props) => props.theme.grey400};
    font-size: 14px;
    font-weight: 500;
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${(props) => props.theme.grey100};
    border: 1px solid transparent;
  }
`
const Container = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
`
const Error = styled.label`
  position: absolute;
  top: ${(props) => (props.errorBottom ? '48px' : '-20px')};
  right: 0;
  display: block;
  height: 15px;
  font-size: 12px;
  font-weight: 400;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: ${(props) => props.theme.error};
`

const DateInput = (props) => {
  const { disabled, errorBottom, hideErrors, input, meta, ...rest } = props
  const { error, invalid, pristine, touched } = meta
  const errorState = touched && invalid ? 'invalid' : 'initial'

  return (
    <Container>
      <BaseDateInput
        borderColor={selectBorderColor(errorState)}
        disabled={disabled}
        data-e2e={props['data-e2e']}
        focusedBorderColor={selectFocusBorderColor(errorState)}
        errorState={errorState}
        {...input}
        {...rest}
      />
      {(touched || !pristine) && error && !hideErrors && (
        <Error errorBottom={errorBottom}>{error}</Error>
      )}
    </Container>
  )
}

export default DateInput
