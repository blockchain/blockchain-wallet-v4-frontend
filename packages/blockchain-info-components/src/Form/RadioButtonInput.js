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

const BaseRadioButtonInput = styled.input.attrs({
  type: 'radio'
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
  align-items: center;
  &:before {
    content: '';
    width: 12px;
    height: 12px;
    margin-right: 5px;
    background: white;
    border-radius: 2px;
    transition: background 0.2s;
    border: 1px solid ${props => props.theme.blue600};
  }
`

const RadioButtonInput = props => {
  const { checked, children, disabled, name, ...rest } = props
  const { id } = props.props

  return (
    <Wrapper>
      <BaseRadioButtonInput
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        data-e2e={[`${props.value}AddressRadioButton`]}
        {...rest}
      />
      <Label htmlFor={id}>{children}</Label>
    </Wrapper>
  )
}

RadioButtonInput.propTypes = {
  name: PropTypes.string.isRequired,
  props: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.string
}

export default RadioButtonInput
