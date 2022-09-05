import React from 'react'
import { IconVisibilityOff, IconVisibilityOn } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { selectBorderColor, selectFocusBorderColor } from './helper'

// font family needs to differ between input and placeholder due to Inter font family issue
// https://github.com/rsms/inter/issues/112
const BasePasswordInput = styled.input.attrs((props) => ({
  'data-lpignore': props.noLastPass,
  disabled: props.disabled,
  spellCheck: 'false',
  type: props.isPasswordVisible ? 'text' : 'password'
}))`
  position: relative;
  display: block;
  width: 100%;
  height: 48px;
  font-family: ${({ isPasswordVisible }) =>
    isPasswordVisible
      ? "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif"
      : 'sans-serif'};
  font-size: ${({ isPasswordVisible }) => (isPasswordVisible ? '16px' : '20px')};
  font-weight: 500;
  padding: 6px 12px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.grey800};
  background-color: ${({ theme }) => theme.white};
  background-image: none;
  outline-width: 0;
  user-select: text;
  border-radius: 8px 0 0 8px;
  border: ${({ borderColor, theme }) => `1px solid ${theme[borderColor]}`};
  border-right: none;

  &:focus {
    border: 1px solid ${({ focusedBorderColor, theme }) => theme[focusedBorderColor]};
    border-right: none;
  }

  &:focus::placeholder {
    opacity: 0.25;
  }

  &::placeholder {
    color: ${(props) => props.theme.grey400};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 14px;
    font-weight: 500;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: ${(props) => props.theme.grey100};
    border: 1px solid transparent;
  }
`

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
`
const ToggleVisibilityWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 46px;
  padding-right: 8px;
  border-radius: 0 8px 8px 0;
  border: ${({ borderColor, focusedBorderColor, isFocused, theme }) =>
    `1px solid ${theme[isFocused ? focusedBorderColor : borderColor]}`};
  border-left: none;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    background-color: ${(props) => props.theme.grey100};
    border: 1px solid transparent;
    border-left: none;
  }
`

class PasswordInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = { focused: false }
    this.onBlur = this.onBlur.bind(this)
    this.onFocus = this.onFocus.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.active && !prevProps.active && this.input) {
      this.input.focus()
    }
  }

  onFocus = (e) => {
    this.setState({ focused: true })
    if (this.props.onFocus) {
      this.props.onFocus(e)
    }
  }

  onBlur = (e) => {
    this.setState({ focused: false })
    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  }

  refInput = (input) => {
    this.input = input
  }

  render() {
    const { errorState, isPasswordVisible, noLastPass, setPasswordVisible, value, ...rest } =
      this.props

    return (
      <Wrapper>
        <BasePasswordInput
          borderColor={selectBorderColor(errorState)}
          data-e2e={this.props['data-e2e']}
          focusedBorderColor={selectFocusBorderColor(errorState)}
          isPasswordVisible={isPasswordVisible}
          noLastPass={noLastPass}
          ref={this.refInput}
          value={value}
          {...rest}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        <ToggleVisibilityWrapper
          onClick={() => setPasswordVisible(!isPasswordVisible)}
          borderColor={selectBorderColor(errorState)}
          focusedBorderColor={selectFocusBorderColor(errorState)}
          isFocused={this.state.focused}
        >
          {isPasswordVisible ? (
            <IconVisibilityOff color='grey400' label='hide password' size='medium' />
          ) : (
            <IconVisibilityOn color='grey400' label='show password' size='medium' />
          )}
        </ToggleVisibilityWrapper>
      </Wrapper>
    )
  }
}

export default PasswordInput
