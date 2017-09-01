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
        background: ${props => props.theme['brand-secondary']};
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
    width: 15px;
    height: 15px;
    margin-right: 5px;
    background: white;
    border-radius: 2px;
    transition: background .2s;
    border: 1px solid ${props => props.theme['brand-secondary']};
  }
`

const CheckBoxInput = props => {
  const { name, errorState, children, ...rest } = props

  return (
    <Wrapper>
      <BaseCheckBoxInput id={name} {...rest} />
      <Label htmlFor={name}>
        { children }
      </Label>
    </Wrapper>
  )
}

CheckBoxInput.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default CheckBoxInput
