import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { darken } from 'polished'

const BaseButton = styled.button.attrs({
  type: props => (props.type ? props.type : 'button')
})`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${props =>
    props.fullwidth ? '100%' : props.width ? props.width : 'auto'};
  min-width: ${props => (props.width ? props.width : '140px')};
  height: ${props => (props.jumbo ? '56px' : props.height)};
  padding: ${props => (props.padding ? props.padding : '10px 15px')};
  margin: ${props => props.margin};
  box-sizing: border-box;
  user-select: none;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  letter-spacing: normal;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  line-height: 1;
  text-transform: ${props =>
    props.uppercase ? 'uppercase' : props.capitalize ? 'capitalize' : 'none'};
  font-family: 'Montserrat', Helvetica, sans-serif;
  font-size: ${props => (props.jumbo ? '16px' : props.size)};
  font-weight: ${props => (props.jumbo ? '500' : '300')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  color: ${props => props.theme[props.color]};
  background-color: ${props => props.theme[props.backgroundColor]};
  border-radius: ${props => (props.rounded ? '20px' : '3px')};
  border-style: solid;
  border-width: ${props => (props.rounded ? '2px' : '1px')};
  border-color: ${props => props.theme[props.borderColor]};

  &:hover {
    border-color: ${props =>
      props.disabled ? 'none' : darken(0.1, props.theme[props.borderColor])};
    background-color: ${props =>
      props.disabled
        ? 'none'
        : darken(0.1, props.theme[props.backgroundColor])};
  }

  &:focus {
    outline: 0;
  }
`

const selectColor = (nature, disabled, small) => {
  switch (nature) {
    case 'empty':
      return {
        color: small ? 'brand-secondary' : 'gray-6',
        backgroundColor: 'white',
        borderColor: 'gray-2'
      }
    case 'light':
      return {
        color: 'brand-secondary',
        backgroundColor: 'white',
        borderColor: 'brand-secondary'
      }
    case 'primary':
      return {
        color: 'white',
        backgroundColor: 'brand-secondary',
        borderColor: 'brand-secondary'
      }
    case 'secondary':
      return {
        color: 'white',
        backgroundColor: 'brand-primary',
        borderColor: 'brand-primary'
      }
    case 'success':
      return {
        color: 'white',
        backgroundColor: 'success',
        borderColor: 'success'
      }
    case 'received':
      return {
        color: 'white',
        backgroundColor: 'received',
        borderColor: 'received'
      }
    case 'sent':
      return { color: 'white', backgroundColor: 'sent', borderColor: 'sent' }
    case 'transferred':
      return {
        color: 'white',
        backgroundColor: 'transferred',
        borderColor: 'transferred'
      }
    case 'warning':
      return { color: 'white', backgroundColor: 'error', borderColor: 'error' }
    case 'dark':
      return {
        color: 'white',
        backgroundColor: 'gray-6',
        borderColor: 'gray-6'
      }
    case 'gray': {
      return {
        color: 'white',
        backgroundColor: 'gray-4',
        borderColor: 'gray-4'
      }
    }
    case 'empty-secondary':
      return {
        color: 'brand-secondary',
        backgroundColor: 'white',
        borderColor: 'brand-secondary'
      }
    default:
      return {
        color: 'gray-6',
        backgroundColor: 'white',
        borderColor: 'gray-2'
      }
  }
}

const Button = props => {
  const { children, nature, disabled, small, ...rest } = props
  const { color, backgroundColor, borderColor } = selectColor(nature, small)

  return (
    <BaseButton
      {...rest}
      disabled={disabled}
      color={color}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
    >
      {children}
    </BaseButton>
  )
}

Button.propTypes = {
  nature: PropTypes.oneOf([
    'empty',
    'light',
    'primary',
    'secondary',
    'copy',
    'received',
    'sent',
    'transferred',
    'warning',
    'dark',
    'success',
    'empty-secondary'
  ]),
  fullwidth: PropTypes.bool,
  disabled: PropTypes.bool,
  rounded: PropTypes.bool,
  bold: PropTypes.bool,
  small: PropTypes.bool,
  uppercase: PropTypes.bool,
  capitalize: PropTypes.bool,
  width: PropTypes.string,
  padding: PropTypes.string,
  margin: PropTypes.string
}

Button.defaultProps = {
  nature: 'empty',
  fullwidth: false,
  disabled: false,
  small: false,
  rounded: false,
  bold: false,
  size: '14px',
  uppercase: false,
  capitalize: false,
  height: '40px'
}

export default Button
