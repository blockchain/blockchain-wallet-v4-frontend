import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DefaultColor } from '../Colors'
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
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor};
  border-radius: ${props => props.rounded ? '20px' : '3px'};
  border-style: solid;
  border-width: ${props => props.rounded ? '2px' : '1px'};
  border-color: ${props => props.rounded ? DefaultColor.white : props.borderColor};

  &:hover {
    border-color: ${props => props.disabled ? 'none' : props.rounded ? DefaultColor.white : props.borderColorHover};
    background-color: ${props => props.disabled ? 'none' : props.backgroundColorHover};
  }
  &:focus { outline:0; }
 `
const selectColors = (nature, disabled) => {
  if (disabled) { return { color: DefaultColor.white, backgroundColor: DefaultColor.iris, borderColor: DefaultColor.iris } }

  switch (nature) {
    case 'empty': return { color: DefaultColor.black, backgroundColor: DefaultColor.white, borderColor: DefaultColor.bordergrey }
    case 'primary': return { color: DefaultColor.white, backgroundColor: DefaultColor.blue, borderColor: DefaultColor.blue }
    case 'secondary': return { color: DefaultColor.white, backgroundColor: DefaultColor.iris, borderColor: DefaultColor.iris }
    case 'copy': return { color: DefaultColor.white, backgroundColor: DefaultColor.green, borderColor: DefaultColor.green }
    case 'received': return { color: DefaultColor.white, backgroundColor: DefaultColor.received, borderColor: DefaultColor.received }
    case 'sent': return { color: DefaultColor.white, backgroundColor: DefaultColor.sent, borderColor: DefaultColor.sent }
    case 'transferred': return { color: DefaultColor.white, backgroundColor: DefaultColor.transferred, borderColor: DefaultColor.transferred }
    case 'logout': return { color: DefaultColor.white, backgroundColor: DefaultColor.invalidredwine, borderColor: DefaultColor.invalidredwine }
    default: return { color: DefaultColor.black, backgroundColor: DefaultColor.white, borderColor: DefaultColor.bordergrey }
  }
}

const Button = ({ ...props, children }) => {
  const { color, backgroundColor, borderColor } = selectColors(props.nature, props.disabled)
  return (
    <BaseButton
      {...props}
      color={color}
      backgroundColor={backgroundColor}
      backgroundColorHover={darken(0.1, backgroundColor)}
      borderColor={borderColor}
      borderColorHover={darken(0.1, borderColor)}>
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
