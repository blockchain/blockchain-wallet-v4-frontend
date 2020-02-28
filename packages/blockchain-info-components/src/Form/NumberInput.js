import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import {
  hasValue,
  isValid,
  selectBackgroundColor,
  selectBorderColor,
  selectFocusBorderColor
} from './helper'

const BaseNumberInput = styled.input.attrs({
  type: 'number'
})`
  display: block;
  width: 100%;
  height: ${props => props.height};
  min-height: ${props => (props.minHeight ? props.minHeight : '40px')};
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: ${props => props.size || '14px'};
  font-weight: 500;
  color: ${props =>
    props.color ? props.theme[props.color] : props.theme['gray-5']};
  background-color: ${({ bgColor, hasValue, isValid, theme }) =>
    hasValue && isValid ? theme.white : theme[bgColor]};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-image: none;
  outline-width: 0;
  user-select: text;
  border-radius: 8px;
  border: ${({ borderColor, hasValue, isValid, theme }) =>
    hasValue && isValid
      ? `1px solid ${theme[borderColor]}`
      : '1px solid transparent'};
  border-right: ${props => (props.borderRightNone ? 'none' : '')};
  border-top: ${props => (props.borderTopNone ? 'none' : '')};
  cursor: ${props => props.disabled && 'not-allowed'};

  &:focus {
    background-color: ${({ theme }) => theme.white};
    border: 1px solid
      ${({ focusedBorderColor, theme }) => theme[focusedBorderColor]};
  }
  &::placeholder {
    color: ${props => props.theme['gray-3']};
    opacity: 0.4;
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const NumberInput = ({ errorState, value, ...rest }) => (
  <BaseNumberInput
    bgColor={selectBackgroundColor(errorState)}
    borderColor={selectBorderColor(errorState)}
    focusedBorderColor={selectFocusBorderColor(errorState)}
    hasValue={hasValue(value)}
    isValid={isValid(errorState)}
    value={value}
    {...rest}
  />
)

NumberInput.propTypes = {
  disabled: PropTypes.bool,
  height: PropTypes.string,
  minHeight: PropTypes.string,
  step: PropTypes.string
}

NumberInput.defaultProps = {
  disabled: false,
  height: '48px',
  minHeight: '48px',
  step: '0.01'
}

export default NumberInput
