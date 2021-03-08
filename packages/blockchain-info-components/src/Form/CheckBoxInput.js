import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`

const BaseCheckBoxInput = styled.input.attrs({
  type: 'checkbox'
})`
  opacity: 0;
  width: 0px;
  height: 0px;
  position: absolute;

  &:checked {
    & + label {
      &:before {
        background: ${props => props.theme.blue600};
      }
    }
  }
  &:disabled {
    & + label {
      &:before {
        cursor: not-allowed;
        border: 1px solid ${props => props.theme.grey200};
      }
    }
  }
`
const Label = styled.label`
  display: flex;
  cursor: pointer;
  position: relative;

  &:before {
    content: '';
    min-width: 12px;
    min-height: 12px;
    width: 12px;
    height: 12px;
    margin-right: 8px;
    background: white;
    border-radius: 2px;
    transition: background 0.2s;
    border: 1px solid ${props => props.theme.blue600};
  }
  &:after {
    content: '\\e910';
    font-family: 'icomoon', sans-serif;
    position: absolute;
    color: ${props => props.theme.white};
    font-weight: 600;
    font-size: 8px;
    left: 2px;
    top: 8px;
    margin-top: -5px;
  }
`

const CheckBoxInput = props => {
  const { checked, children, disabled, name, ...rest } = props

  return (
    <Wrapper>
      <BaseCheckBoxInput
        id={name}
        checked={checked}
        disabled={disabled}
        data-e2e={props['data-e2e']}
        {...rest}
      />
      <Label htmlFor={name} data-e2e={name === 'terms' && 'termsLabel'}>
        {children}
      </Label>
    </Wrapper>
  )
}

CheckBoxInput.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  checked: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

export default CheckBoxInput
