import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconVisibilityOff, IconVisibilityOn } from '@blockchain-com/icons'
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
  min-height: 48px;
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
  border-radius: 8px;
  border: ${({ borderColor, theme }) => `1px solid ${theme[borderColor]}`};

  &:focus {
    border: 1px solid ${({ focusedBorderColor, theme }) => theme[focusedBorderColor]};
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
  display: inline-block;
  width: 100%;
  height: 48px;
`
const ToggleVisibilityWrapper = styled.div`
  float: right;
  position: relative;
  bottom: 36px;
  right: 12px;
  cursor: pointer;
  z-index: 99;
`

class PasswordInput extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.active && !prevProps.active && this.input) {
      this.input.focus()
    }
  }

  refInput = (input) => {
    this.input = input
  }

  render() {
    const {
      errorState,
      isPasswordVisible,
      noLastPass,
      setPasswordVisible,
      showVisibilityToggle,
      value,
      ...rest
    } = this.props

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
        />
        {showVisibilityToggle ? (
          <ToggleVisibilityWrapper onClick={() => setPasswordVisible(!isPasswordVisible)}>
            <Icon
              color='grey400'
              label={isPasswordVisible ? 'hide password' : 'show password'}
              size='md'
            >
              {isPasswordVisible ? <IconVisibilityOff /> : <IconVisibilityOn />}
            </Icon>
          </ToggleVisibilityWrapper>
        ) : null}
      </Wrapper>
    )
  }
}

export default PasswordInput
