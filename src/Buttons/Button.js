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
  width: ${props => props.fullwidth ? '100%' : 'auto'};
  min-width: 120px;
  height: 40px;
  padding: 10px 15px;
  box-sizing: border-box;
  user-select: none;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  letter-spacing: normal;
  transition: all .2s ease-in-out;
  white-space: nowrap;
  line-height: 1;
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  font-family: 'Montserrat', Helvetica, sans-serif;
  font-size: 14px;
  font-weight: ${props => props.bold ? '700' : '300'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.theme[props.color]};
  background-color: ${props => props.theme[props.backgroundColor]};
  border-radius: ${props => props.rounded ? '20px' : '3px'};
  border-style: solid;
  border-width: ${props => props.rounded ? '2px' : '1px'};
  border-color: ${props => props.disabled ? 'none' : props.theme[props.borderColor]};

  &:hover {
    border-color: ${props => props.disabled ? 'none' : darken(0.1, (props.theme[props.borderColor]))};
    background-color: ${props => props.disabled ? 'none' : darken(0.1, (props.theme[props.backgroundColor]))};
  }
  &:focus { outline:0; }
 `
const selectColor = (nature, theme, disabled) => {
  if (disabled) { return { color: 'white', backgroundColor: 'iris', borderColor: 'iris' } }

  switch (nature) {
    case 'empty': return { color: 'black', backgroundColor: 'white', borderColor: 'bordergrey' }
    case 'primary': return { color: 'white', backgroundColor: 'blue', borderColor: 'blue' }
    case 'secondary': return { color: 'white', backgroundColor: 'iris', borderColor: 'iris' }
    case 'copy': return { color: 'white', backgroundColor: 'green', borderColor: 'green' }
    case 'received': return { color: 'white', backgroundColor: 'received', borderColor: 'received' }
    case 'sent': return { color: 'white', backgroundColor: 'sent', borderColor: 'sent' }
    case 'transferred': return { color: 'white', backgroundColor: 'transferred', borderColor: 'transferred' }
    case 'logout': return { color: 'white', backgroundColor: 'invalidredwine', borderColor: 'invalidredwine' }
    default: return { color: 'black', backgroundColor: 'white', borderColor: 'bordergrey' }
  }
}

const Button = (props) => {
  const { children, nature, theme, disabled, ...rest } = props
  const { color, backgroundColor, borderColor } = selectColor(nature, theme, disabled)

  return (
    <BaseButton
      {...rest}
      color={color}
      backgroundColor={backgroundColor}
      borderColor={borderColor}>
      {children}
    </BaseButton>
  )
}

Button.propTypes = {
  nature: PropTypes.oneOf(['empty', 'primary', 'secondary', 'copy', 'received', 'sent', 'transferred', 'logout']),
  fullwidth: PropTypes.bool,
  disabled: PropTypes.bool,
  rounded: PropTypes.bool,
  bold: PropTypes.bool,
  uppercase: PropTypes.bool
}

Button.defaultProps = {
  nature: 'empty',
  fullwidth: false,
  disabled: false,
  rounded: false,
  bold: false,
  uppercase: false
}

export default Button
