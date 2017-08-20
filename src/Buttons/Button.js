import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Color from 'color'

const BaseButton = styled.button.attrs({ type: 'button' })`
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
  line-height: 20px;
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  font-family: 'Montserrat', Helvetica, sans-serif;
  font-size: 16px;
  font-weight: ${props => props.bold ? '700' : '300'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor};
  border-radius: ${props => props.rounded ? '20px' : '3px'};
  border-style: solid;
  border-width: ${props => props.rounded ? '2px' : '1px'};
  border-color: ${props => props.rounded ? '#FFFFFF' : props.borderColor};

  &:hover {
    border-color: ${props => props.disabled ? 'none' : props.rounded ? '#FFFFFF' : props.borderColorHover};
    background-color: ${props => props.disabled ? 'none' : props.backgroundColorHover}; 
  }
  &:focus { outline:0; }
 `
const selectColors = (nature, disabled) => {
  if (disabled) { return { color: '#FFFFFF', backgroundColor: '#CDCDCD', borderColor: '#CDCDCD' } }

  switch (nature) {
    case 'empty': return { color: '#4B4D4E', backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }
    case 'primary': return { color: '#FFFFFF', backgroundColor: '#004A7C', borderColor: '#004A7C' }
    case 'secondary': return { color: '#FFFFFF', backgroundColor: '#10ADE4', borderColor: '#10ADE4' }
    case 'copy': return { color: '#FFFFFF', backgroundColor: '#006600', borderColor: '#006600' }
    case 'received': return { color: '#FFFFFF', backgroundColor: '#00BABC', borderColor: '#00BABC' }
    case 'sent': return { color: '#FFFFFF', backgroundColor: '#F26C57', borderColor: '#F26C57' }
    case 'transferred': return { color: '#FFFFFF', backgroundColor: '#799EB2', borderColor: '#799EB2' }
    case 'logout': return { color: '#FFFFFF', backgroundColor: '#660000', borderColor: '#660000' }
    default: return { color: '#4B4D4E', backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }
  }
}

const Button = ({ ...props, children }) => {
  const { color, backgroundColor, borderColor } = selectColors(props.nature, props.disabled)

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
