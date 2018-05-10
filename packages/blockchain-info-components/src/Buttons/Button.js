import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { darken } from 'polished'

const BaseButton = styled.button.attrs({
  type: props => props.type ? props.type : 'button'
})`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${props => props.fullwidth ? '100%' : props.width ? props.width : 'auto'};
  min-width: ${props => props.width ? props.width : '140px'};
  height: ${props => props.height};
  padding: ${props => props.padding ? props.padding : '10px 15px'};
  margin: ${props => props.margin};
  box-sizing: border-box;
  user-select: none;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  letter-spacing: normal;
  transition: all .2s ease-in-out;
  white-space: nowrap;
  line-height: 1;
  text-transform: ${props => props.uppercase ? 'uppercase' : props.capitalize ? 'capitalize' : 'none'};
  font-family: 'Montserrat', Helvetica, sans-serif;
  font-size: 14px;
  font-weight: ${props => props.bold ? '700' : '300'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  color: ${props => props.theme[props.color]};
  background-color: ${props => props.theme[props.backgroundColor]};
  border-radius: ${props => props.rounded ? '20px' : '3px'};
  border-style: solid;
  border-width: ${props => props.rounded ? '2px' : '1px'};
  border-color: ${props => props.theme[props.borderColor]};
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover {
    border-color: ${props => props.disabled ? 'none' : darken(0.1, (props.theme[props.borderColor]))};
    background-color: ${props => props.disabled ? 'none' : darken(0.1, (props.theme[props.backgroundColor]))};
  }

  &:focus { outline:0; }
 `

const selectColor = (nature, disabled) => {
  if (disabled) { return { color: 'white', backgroundColor: 'brand-secondary', borderColor: 'brand-secondary' } }

  switch (nature) {
    case 'empty': return { color: 'gray-6', backgroundColor: 'white', borderColor: 'gray-2' }
    case 'primary': return { color: 'white', backgroundColor: 'brand-secondary', borderColor: 'brand-secondary' }
    case 'secondary': return { color: 'white', backgroundColor: 'brand-primary', borderColor: 'brand-primary' }
    case 'copy': return { color: 'white', backgroundColor: 'success', borderColor: 'success' }
    case 'received': return { color: 'white', backgroundColor: 'received', borderColor: 'received' }
    case 'sent': return { color: 'white', backgroundColor: 'sent', borderColor: 'sent' }
    case 'transferred': return { color: 'white', backgroundColor: 'transferred', borderColor: 'transferred' }
    case 'logout': return { color: 'white', backgroundColor: 'error', borderColor: 'error' }
    case 'dark': return { color: 'white', backgroundColor: 'gray-6', borderColor: 'gray-6' }
    case 'empty-secondary': return { color: 'white', backgroundColor: 'white', borderColor: 'brand-secondary' }
    default: return { color: 'gray-6', backgroundColor: 'white', borderColor: 'gray-2' }
  }
}

const Button = (props) => {
  const { children, nature, disabled, ...rest } = props
  const { color, backgroundColor, borderColor } = selectColor(nature, disabled)

  return (
    <BaseButton
      {...rest}
      disabled={disabled}
      color={color}
      backgroundColor={backgroundColor}
      borderColor={borderColor}>
      {children}
    </BaseButton>
  )
}

Button.propTypes = {
  nature: PropTypes.oneOf(['empty', 'primary', 'secondary', 'copy', 'received', 'sent', 'transferred', 'logout', 'dark', 'empty-secondary']),
  fullwidth: PropTypes.bool,
  disabled: PropTypes.bool,
  rounded: PropTypes.bool,
  bold: PropTypes.bool,
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
  rounded: false,
  bold: false,
  uppercase: false,
  capitalize: false,
  height: '40px'
}

export default Button
