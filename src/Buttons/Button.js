import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Color from 'color'

const BaseButton = styled.button`
  width: ${props => props.fullwidth ? '100%' : 'auto'};
  height: 40px;
  padding: 10px 15px;
  box-sizing: border-box;
  margin-bottom: 5px;
  user-select: none;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  letter-spacing: normal;
  transition: all .2s ease-in-out;
  white-space: nowrap;
  font-family: "'Montserrat', Helvetica, sans-serif";
  font-size: 16px;
  font-weight: ${props => props.bold ? '700' : '400'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor};
  border-radius: ${props => props.rounded ? '20px' : '3px'};
  border-style: solid;
  border-width: ${props => props.rounded ? '2px' : '1px'};
  border-color: ${props => props.borderColor};

  &:hover {
    border-color: ${props => props.disabled ? 'none' : props.borderColorHover};
    background-color: ${props => props.disabled ? 'none' : props.backgroundColorHover}; 
  }
  &:focus { outline:0; }
 `

const Button = ({ ...props, children }) => {
  let color, backgroundColor, borderColor

  switch (props.type) {
    case 'empty':
      color = '#4B4D4E'
      backgroundColor = '#FFFFFF'
      borderColor = '#E0E0E0'
      break
    case 'primary':
      color = '#FFFFFF'
      backgroundColor = '#004A7C'
      borderColor = '#004A7C'
      break
    case 'secondary':
      color = '#FFFFFF'
      backgroundColor = '#10ADE4'
      borderColor = '#10ADE4'
      break
    default:
      color = '#4B4D4E'
      backgroundColor = '#FFFFFF'
      borderColor = '#E0E0E0'
  }

  if (props.disabled) {
    color = '#FFFFFF'
    backgroundColor = '#CDCDCD'
    borderColor = '#CDCDCD'
  }

  return (
    <BaseButton
      {...props}
      color={color}
      backgroundColor={backgroundColor}
      backgroundColorHover={Color(backgroundColor).darken(0.10).toString()}
      borderColor={borderColor}
      borderColorHover={Color(borderColor).darken(0.10).toString()}>
      {children}
    </BaseButton>
  )
}

Button.propTypes = {
  type: PropTypes.oneOf(['empty', 'primary', 'secondary']),
  fullwidth: PropTypes.bool,
  disabled: PropTypes.bool,
  rounded: PropTypes.bool,
  bold: PropTypes.bool,
  uppercase: PropTypes.bool
}

Button.defaultProps = {
  type: 'empty',
  fullwidth: false,
  disabled: false,
  rounded: false,
  bold: false,
  uppercase: false
}

export default Button
