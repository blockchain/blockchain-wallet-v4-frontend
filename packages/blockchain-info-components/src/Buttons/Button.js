import React from 'react'
import { darken } from 'polished'
import styled from 'styled-components'

const BaseButton = styled.button.attrs((props) => ({
  type: props.type ? props.type : 'button'
}))`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.fullwidth ? '100%' : props.width ? props.width : 'auto')};
  min-width: ${(props) => (props.small ? '86px' : props.width ? props.width : '140px')};
  height: ${(props) => (props.jumbo ? '56px' : props.small ? '32px' : props.height)};
  padding: ${(props) => (props.padding ? props.padding : '10px 15px')};
  margin: ${(props) => props.margin};
  box-sizing: border-box;
  user-select: none;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  letter-spacing: normal;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  line-height: 1;
  text-transform: ${(props) =>
    props.uppercase ? 'uppercase' : props.capitalize ? 'capitalize' : 'none'};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: ${(props) => (props.jumbo ? '16px' : props.size)};
  font-weight: ${(props) => (props.jumbo ? '600' : '600')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  color: ${(props) => props.theme[props.color]};
  background-color: ${(props) =>
    props.backgroundColor ? props.theme[props.backgroundColor] : 'transparent'};
  border-radius: ${(props) => (props.rounded ? '20px' : '8px')};
  border-style: solid;
  border-width: ${(props) => (props.rounded ? '2px' : '1px')};
  border-color: ${(props) => props.theme[props.borderColor]};

  &:hover {
    border-color: ${(props) =>
      props.disabled
        ? 'none'
        : props.hoverBorderColor
        ? props.theme[props.hoverBorderColor]
        : darken(0.1, props.theme[props.borderColor])};
    background-color: ${(props) =>
      props.disabled
        ? 'none'
        : props.backgroundColor
        ? darken(0.1, props.theme[props.backgroundColor])
        : 'transparent'};
  }

  &:focus {
    outline: 0;
  }
`

const selectColor = (nature, small) => {
  switch (nature) {
    case 'dark':
      return {
        backgroundColor: 'grey800',
        borderColor: 'grey800',
        color: 'white'
      }
    case 'dark-grey':
      return {
        backgroundColor: 'grey800',
        borderColor: 'grey800',
        color: 'white'
      }
    case 'empty':
      return {
        backgroundColor: 'white',
        borderColor: 'grey000',
        color: small ? 'blue600' : 'grey800',
        hoverBorderColor: 'white'
      }
    case 'empty-blue': {
      return {
        backgroundColor: 'white',
        borderColor: 'grey100',
        color: 'blue600',
        hoverBorderColor: 'blue600'
      }
    }
    case 'empty-purple': {
      return {
        backgroundColor: 'white',
        borderColor: 'grey100',
        color: 'purple600',
        hoverBorderColor: 'purple600'
      }
    }
    case 'empty-red': {
      return {
        backgroundColor: 'white',
        borderColor: 'grey100',
        color: 'red600',
        hoverBorderColor: 'red600'
      }
    }
    case 'empty-secondary':
      return {
        backgroundColor: 'white',
        borderColor: 'blue600',
        color: 'blue600'
      }
    case 'gray':
      return {
        backgroundColor: 'grey500',
        borderColor: 'grey500',
        color: 'white'
      }
    case 'light':
      return {
        backgroundColor: 'white',
        borderColor: 'grey000',
        color: 'blue600'
      }
    case 'light-red':
      return {
        backgroundColor: 'white',
        borderColor: 'grey000',
        color: 'red400'
      }
    case 'exchangeTurquoise':
      return {
        backgroundColor: 'exchangeTurquoise',
        borderColor: 'exchangeTurquoise',
        color: 'exchangeNight'
      }
    case 'primary':
      return {
        backgroundColor: 'blue600',
        borderColor: 'blue600',
        color: 'white'
      }
    case 'purple':
      return {
        backgroundColor: 'purple',
        borderColor: 'purple',
        color: 'white'
      }
    case 'secondary':
      return {
        backgroundColor: 'blue900',
        borderColor: 'blue900',
        color: 'white'
      }
    case 'received':
      return {
        backgroundColor: 'received',
        borderColor: 'received',
        color: 'white'
      }
    case 'sent':
      return { backgroundColor: 'sent', borderColor: 'sent', color: 'white' }
    case 'success':
      return {
        backgroundColor: 'success',
        borderColor: 'success',
        color: 'white'
      }
    case 'transferred':
      return {
        backgroundColor: 'transferred',
        borderColor: 'transferred',
        color: 'white'
      }
    case 'warning':
      return { backgroundColor: 'error', borderColor: 'error', color: 'white' }
    case 'white-transparent':
      return {
        borderColor: 'white',
        color: 'white'
      }
    case 'white-blue':
      return {
        backgroundColor: 'white',
        borderColor: 'white',
        color: 'blue600'
      }
    case 'green':
      return {
        backgroundColor: 'green600',
        borderColor: 'green600',
        color: 'white'
      }
    case 'grey800':
      return {
        backgroundColor: 'grey800',
        borderColor: 'grey800',
        color: 'white'
      }
    default:
      return {
        backgroundColor: 'grey000',
        borderColor: 'grey200',
        color: 'grey800',
        hoverBorderColor: 'white'
      }
  }
}

const Button = (props) => {
  const { children, disabled, nature, small, ...rest } = props
  const { backgroundColor, borderColor, color, hoverBorderColor } = selectColor(nature, small)

  return (
    <BaseButton
      {...rest}
      small={small}
      disabled={disabled}
      color={color}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      hoverBorderColor={hoverBorderColor}
    >
      {children}
    </BaseButton>
  )
}

Button.defaultProps = {
  bold: false,
  capitalize: false,
  disabled: false,
  fullwidth: false,
  height: '40px',
  nature: 'empty',
  rounded: false,
  size: '14px',
  small: false,
  uppercase: false
}

export default Button
